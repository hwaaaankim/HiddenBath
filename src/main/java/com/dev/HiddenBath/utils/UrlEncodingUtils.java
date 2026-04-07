package com.dev.HiddenBath.utils;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

public class UrlEncodingUtils {
    public static String encode(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Encoding failed", e);
        }
    }
}
