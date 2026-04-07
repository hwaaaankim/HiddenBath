package com.dev.HiddenBath.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class KakaoConfig {

    @Value("${kakao.javascript.key}")
    private String javascriptKey;

    public String getJavascriptKey() {
        return javascriptKey;
    }
}