package io.github.ojoseguilherme.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.github.ojoseguilherme.exception.BusinessValidationException;
import io.github.ojoseguilherme.exception.ResourceNotFoundException;
import io.github.ojoseguilherme.model.Arquivo;
import io.github.ojoseguilherme.repository.ArquivoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@ApplicationScoped
public class ArquivoServiceImpl implements ArquivoService {

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private static final Map<String, String> EXTENSOES_POR_TIPO = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    @ConfigProperty(name = "coldwheels.upload.max-size-bytes", defaultValue = "5242880")
    long maxSizeBytes;

    @Inject
    ArquivoRepository repository;

    @Inject
    S3StorageService s3StorageService;

    @Override
    @Transactional
    public Arquivo salvarImagem(String pastaPrefixo, String nomeOriginal, String contentType, byte[] conteudo) {
        String tipoNormalizado = normalizarContentType(contentType);
        validarImagem(nomeOriginal, tipoNormalizado, conteudo);

        String nomeLimpo = sanitizarNomeArquivo(nomeOriginal);
        String extensao = EXTENSOES_POR_TIPO.getOrDefault(tipoNormalizado, ".bin");
        String objectKey = pastaPrefixo + "/" + UUID.randomUUID() + extensao;

        s3StorageService.upload(objectKey, new ByteArrayInputStream(conteudo), conteudo.length, tipoNormalizado);

        Arquivo arquivo = new Arquivo();
        arquivo.setObjectKey(objectKey);
        arquivo.setNomeOriginal(nomeLimpo);
        arquivo.setContentType(tipoNormalizado);
        arquivo.setTamanhoBytes((long) conteudo.length);

        repository.persist(arquivo);
        return arquivo;
    }

    @Override
    public Arquivo findById(Long id) {
        return repository.findByIdOptional(id)
                .orElseThrow(() -> new ResourceNotFoundException("Arquivo não encontrado para o ID: " + id));
    }

    @Override
    public ResponseInputStream<GetObjectResponse> abrirStream(Arquivo arquivo) {
        return s3StorageService.download(arquivo.getObjectKey());
    }

    @Override
    public ResponseInputStream<GetObjectResponse> abrirAsset(String caminhoRelativo) {
        if (caminhoRelativo == null || caminhoRelativo.isBlank() || caminhoRelativo.contains("..")) {
            throw new BusinessValidationException("Caminho de imagem inválido.");
        }
        String limpo = caminhoRelativo.replace("\\", "/").replaceAll("^/+", "");
        String objectKey = "assets/images/" + limpo;
        try {
            return s3StorageService.download(objectKey);
        } catch (software.amazon.awssdk.services.s3.model.NoSuchKeyException e) {
            throw new ResourceNotFoundException("Imagem não encontrada no storage: " + limpo);
        } catch (software.amazon.awssdk.services.s3.model.S3Exception e) {
            if (e.statusCode() == 404) {
                throw new ResourceNotFoundException("Imagem não encontrada no storage: " + limpo);
            }
            throw e;
        }
    }

    @Override
    @Transactional
    public void excluir(Arquivo arquivo) {
        if (arquivo == null) {
            return;
        }
        String key = arquivo.getObjectKey();
        if (arquivo.getId() != null) {
            repository.deleteById(arquivo.getId());
        }
        if (key != null && !key.isBlank()) {
            s3StorageService.delete(key);
        }
    }

    @Override
    public void validarImagem(String nomeOriginal, String contentType, byte[] conteudo) {
        if (conteudo == null || conteudo.length == 0) {
            throw new BusinessValidationException("O arquivo enviado está vazio.");
        }

        if (conteudo.length > maxSizeBytes) {
            long maxMb = Math.max(1, maxSizeBytes / (1024 * 1024));
            throw new BusinessValidationException(
                    "O arquivo excede o tamanho máximo permitido de " + maxMb + " MB.");
        }

        String tipoNormalizado = normalizarContentType(contentType);
        if (!TIPOS_PERMITIDOS.contains(tipoNormalizado)) {
            throw new BusinessValidationException(
                    "Tipo de arquivo não permitido. Envie uma imagem JPEG, PNG ou WEBP.");
        }

        if (!correspondeAssinaturaImagem(tipoNormalizado, conteudo)) {
            throw new BusinessValidationException(
                    "O conteúdo do arquivo não corresponde a uma imagem válida (" + tipoNormalizado + ").");
        }
    }

    @Override
    public byte[] lerBytesLimitados(InputStream inputStream) {
        if (inputStream == null) {
            throw new BusinessValidationException("Nenhum arquivo foi enviado.");
        }
        try (InputStream in = inputStream; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            long total = 0;
            int read;
            while ((read = in.read(buffer)) != -1) {
                total += read;
                if (total > maxSizeBytes) {
                    long maxMb = Math.max(1, maxSizeBytes / (1024 * 1024));
                    throw new BusinessValidationException(
                            "O arquivo excede o tamanho máximo permitido de " + maxMb + " MB.");
                }
                out.write(buffer, 0, read);
            }
            return out.toByteArray();
        } catch (IOException e) {
            throw new BusinessValidationException("Não foi possível ler o arquivo enviado.");
        }
    }

    private String normalizarContentType(String contentType) {
        if (contentType == null) {
            return "";
        }
        String base = contentType.split(";")[0].trim().toLowerCase();
        if ("image/jpg".equals(base)) {
            return "image/jpeg";
        }
        return base;
    }

    private String sanitizarNomeArquivo(String nomeOriginal) {
        if (nomeOriginal == null || nomeOriginal.isBlank()) {
            return "imagem";
        }
        String apenasNome = nomeOriginal.replace("\\", "/");
        int lastSlash = apenasNome.lastIndexOf('/');
        if (lastSlash >= 0) {
            apenasNome = apenasNome.substring(lastSlash + 1);
        }
        String limpo = apenasNome.replaceAll("[^a-zA-Z0-9._-]", "_");
        return limpo.isBlank() ? "imagem" : limpo;
    }

    private boolean correspondeAssinaturaImagem(String tipo, byte[] bytes) {
        if ("image/jpeg".equals(tipo)) {
            return bytes.length >= 3
                    && (bytes[0] & 0xFF) == 0xFF
                    && (bytes[1] & 0xFF) == 0xD8
                    && (bytes[2] & 0xFF) == 0xFF;
        }
        if ("image/png".equals(tipo)) {
            return bytes.length >= 8
                    && (bytes[0] & 0xFF) == 0x89
                    && bytes[1] == 0x50
                    && bytes[2] == 0x4E
                    && bytes[3] == 0x47
                    && bytes[4] == 0x0D
                    && bytes[5] == 0x0A
                    && bytes[6] == 0x1A
                    && bytes[7] == 0x0A;
        }
        if ("image/webp".equals(tipo)) {
            return bytes.length >= 12
                    && bytes[0] == 'R' && bytes[1] == 'I' && bytes[2] == 'F' && bytes[3] == 'F'
                    && bytes[8] == 'W' && bytes[9] == 'E' && bytes[10] == 'B' && bytes[11] == 'P';
        }
        return false;
    }
}
