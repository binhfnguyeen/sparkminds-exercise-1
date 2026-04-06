package com.heulwen.demo.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;

@Converter
public class MfaSecretConverter implements AttributeConverter<String, String> {

    private static final String AES = "AES";

    private static final byte[] CONVERTER_SECRET = "VCO8Ufj4XaPC6Rnk".getBytes();

    @Override
    public String convertToDatabaseColumn(String attribute) {
        if (attribute == null){
            return null;
        }
        try {
            Key key = new SecretKeySpec(CONVERTER_SECRET, AES);
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return Base64.getEncoder().encodeToString(cipher.doFinal(attribute.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi mã hóa MFA Secret", e);
        }
    }

    @Override
    public String convertToEntityAttribute(String dbData) {
        if (dbData == null){
            return null;
        }
        try {
            Key key = new SecretKeySpec(CONVERTER_SECRET, AES);
            Cipher cipher = Cipher.getInstance(AES);
            cipher.init(Cipher.DECRYPT_MODE, key);
            return new String(cipher.doFinal(Base64.getDecoder().decode(dbData)));
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi giải mã MFA Secret", e);
        }
    }
}
