package com.dev.HiddenBath.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.dev.HiddenBath.utils.UrlEncodingUtils;

@Configuration
public class AppConfig {
    
	@Bean
    UrlEncodingUtils urlEncodingUtils() {
        return new UrlEncodingUtils();
    }
}
