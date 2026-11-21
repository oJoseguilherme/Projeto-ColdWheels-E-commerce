package io.github.ojoseguilherme.service;

import java.io.InputStream;
import java.net.URI;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;

/**
 * Cliente de integração com Object Storage compatível com a API S3 (RustFS, AWS S3, SeaweedFS, Garage).
 */
@ApplicationScoped
public class S3StorageService {

    @ConfigProperty(name = "coldwheels.s3.endpoint")
    String endpoint;

    @ConfigProperty(name = "coldwheels.s3.region")
    String region;

    @ConfigProperty(name = "coldwheels.s3.access-key")
    String accessKey;

    @ConfigProperty(name = "coldwheels.s3.secret-key")
    String secretKey;

    @ConfigProperty(name = "coldwheels.s3.bucket")
    String bucket;

    private volatile S3Client s3Client;
    private volatile boolean bucketVerificado = false;

    public void upload(String objectKey, InputStream data, long size, String contentType) {
        garantirBucket();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .contentType(contentType)
                .contentLength(size)
                .build();

        getClient().putObject(request, RequestBody.fromInputStream(data, size));
    }

    public ResponseInputStream<GetObjectResponse> download(String objectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();

        return getClient().getObject(request);
    }

    public void delete(String objectKey) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(objectKey)
                .build();

        getClient().deleteObject(request);
    }

    private void garantirBucket() {
        if (bucketVerificado) {
            return;
        }
        synchronized (this) {
            if (bucketVerificado) {
                return;
            }
            try {
                getClient().headBucket(HeadBucketRequest.builder().bucket(bucket).build());
            } catch (NoSuchBucketException e) {
                getClient().createBucket(CreateBucketRequest.builder().bucket(bucket).build());
            } catch (S3Exception e) {
                if (e.statusCode() == 404) {
                    getClient().createBucket(CreateBucketRequest.builder().bucket(bucket).build());
                } else {
                    throw e;
                }
            }
            bucketVerificado = true;
        }
    }

    private S3Client getClient() {
        if (s3Client == null) {
            synchronized (this) {
                if (s3Client == null) {
                    s3Client = S3Client.builder()
                            .endpointOverride(URI.create(endpoint))
                            .region(Region.of(region))
                            .credentialsProvider(StaticCredentialsProvider.create(
                                    AwsBasicCredentials.create(accessKey, secretKey)))
                            .serviceConfiguration(S3Configuration.builder()
                                    .pathStyleAccessEnabled(true)
                                    .build())
                            .httpClientBuilder(UrlConnectionHttpClient.builder())
                            .build();
                }
            }
        }
        return s3Client;
    }

    @PreDestroy
    void close() {
        if (s3Client != null) {
            s3Client.close();
        }
    }
}
