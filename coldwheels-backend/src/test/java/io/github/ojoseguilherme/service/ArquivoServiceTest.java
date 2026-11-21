package io.github.ojoseguilherme.service;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import io.github.ojoseguilherme.exception.BusinessValidationException;

class ArquivoServiceTest {

    private ArquivoServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new ArquivoServiceImpl();
        service.maxSizeBytes = 1024; // 1 KB para teste
    }

    @Test
    void deveRejeitarArquivoVazio() {
        assertThrows(BusinessValidationException.class,
                () -> service.validarImagem("vazio.png", "image/png", new byte[0]));
    }

    @Test
    void deveRejeitarArquivoAcimaDoTamanhoMaximo() {
        byte[] grande = new byte[2048];
        grande[0] = (byte) 0x89;
        grande[1] = 0x50;
        grande[2] = 0x4E;
        grande[3] = 0x47;
        assertThrows(BusinessValidationException.class,
                () -> service.validarImagem("grande.png", "image/png", grande));
    }

    @Test
    void deveRejeitarTipoNaoPermitido() {
        byte[] texto = "nao e imagem".getBytes();
        assertThrows(BusinessValidationException.class,
                () -> service.validarImagem("doc.txt", "text/plain", texto));
    }

    @Test
    void deveRejeitarAssinaturaInvalidaMesmoComContentTypeDeImagem() {
        byte[] falsoPng = "conteudo falso".getBytes();
        assertThrows(BusinessValidationException.class,
                () -> service.validarImagem("falso.png", "image/png", falsoPng));
    }

    @Test
    void deveAceitarPngValidoDentroDoLimite() {
        byte[] pngValido = new byte[] { (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00 };
        assertDoesNotThrow(() -> service.validarImagem("foto.png", "image/png", pngValido));
    }

    @Test
    void deveAceitarJpegValidoDentroDoLimite() {
        byte[] jpegValido = new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0 };
        assertDoesNotThrow(() -> service.validarImagem("foto.jpg", "image/jpeg", jpegValido));
    }
}
