package com.zubrilovskaya.business.service;

import com.zubrilovskaya.business.config.EncryptionProperties;
import com.zubrilovskaya.business.exception.EncryptionException;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Base64;

//Шифрование чувствительных полей (AES-256-GCM).Формат результата: "v1:" + Base64(IV + шифртекст + тег)
@Service
public class FieldEncryptor {

    private static final String ALGORITHM = "AES/GCM/NoPadding";
    private static final int KEY_BYTES = 32;
    private static final int IV_BYTES = 12;
    private static final int TAG_BITS = 128;
    private static final String VERSION = "v1";

    private final SecretKey key;
    private final SecureRandom random = new SecureRandom();

    public FieldEncryptor(EncryptionProperties props) {
        this.key = loadKey(props.getKey());
    }

    //коллекция, пользователь, ключ записи
    public static String context(String collection, Long userId, String recordKey) {
        return collection + "|" + userId + "|" + recordKey;
    }

    public String encrypt(String plaintext, String context) {
        try {
            byte[] iv = new byte[IV_BYTES];
            random.nextBytes(iv);

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, iv));
            cipher.updateAAD(context.getBytes(StandardCharsets.UTF_8));
            byte[] ciphertext = cipher.doFinal(plaintext.getBytes(StandardCharsets.UTF_8));

            byte[] result = ByteBuffer.allocate(iv.length + ciphertext.length)
                    .put(iv)
                    .put(ciphertext)
                    .array();
            return VERSION + ":" + Base64.getEncoder().encodeToString(result);
        } catch (GeneralSecurityException e) {
            throw new EncryptionException("Не удалось зашифровать данные", e);
        }
    }

    public String decrypt(String payload, String context) {
        String prefix = VERSION + ":";
        if (payload == null || !payload.startsWith(prefix)) {
            throw new EncryptionException("Неизвестный формат зашифрованных данных");
        }
        try {
            byte[] data = Base64.getDecoder().decode(payload.substring(prefix.length()));
            if (data.length < IV_BYTES + TAG_BITS / 8) {
                throw new EncryptionException("Зашифрованные данные повреждены");
            }

            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, key, new GCMParameterSpec(TAG_BITS, data, 0, IV_BYTES));
            cipher.updateAAD(context.getBytes(StandardCharsets.UTF_8));
            byte[] plaintext = cipher.doFinal(data, IV_BYTES, data.length - IV_BYTES);
            return new String(plaintext, StandardCharsets.UTF_8);
        } catch (GeneralSecurityException | IllegalArgumentException e) {
            throw new EncryptionException("Не удалось расшифровать данные", e);
        }
    }

    private static SecretKey loadKey(String base64Key) {
        if (base64Key == null || base64Key.isBlank()) {
            throw new IllegalStateException("Не задан ENCRYPTION_KEY");
        }
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(base64Key.trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("ENCRYPTION_KEY должен быть в формате Base64", e);
        }
        if (bytes.length != KEY_BYTES) {
            throw new IllegalStateException(
                    "ENCRYPTION_KEY должен содержать 32 байта (в Base64 это 44 символа), сейчас " + bytes.length);
        }
        return new SecretKeySpec(bytes, "AES");
    }
}