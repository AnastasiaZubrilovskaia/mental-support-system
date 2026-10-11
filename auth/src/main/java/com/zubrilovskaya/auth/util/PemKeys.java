package com.zubrilovskaya.auth.util;

import com.nimbusds.jose.jwk.RSAKey;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

//Загрузка RSA-ключа из PEM (PKCS#8)
public final class PemKeys {

    private PemKeys() {
    }

    public static RSAKey loadRsaKey(String privateKeyPath) {
        try {
            String pem = Files.readString(Path.of(privateKeyPath));
            if (pem.contains("BEGIN RSA PRIVATE KEY")) {
                throw new IllegalStateException(
                        "Ключ в формате PKCS#1. Нужен PKCS#8 (BEGIN PRIVATE KEY): создайте его через openssl genpkey");
            }
            String base64 = pem.replaceAll("-----[A-Z ]+-----", "").replaceAll("\\s", "");
            byte[] der = Base64.getDecoder().decode(base64);

            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
            RSAPrivateCrtKey privateKey =
                    (RSAPrivateCrtKey) keyFactory.generatePrivate(new PKCS8EncodedKeySpec(der));
            RSAPublicKey publicKey = (RSAPublicKey) keyFactory.generatePublic(
                    new RSAPublicKeySpec(privateKey.getModulus(), privateKey.getPublicExponent()));

            return new RSAKey.Builder(publicKey).privateKey(privateKey).build();
        } catch (IOException | GeneralSecurityException e) {
            throw new IllegalStateException("Не удалось загрузить RSA-ключ из " + privateKeyPath, e);
        }
    }
}