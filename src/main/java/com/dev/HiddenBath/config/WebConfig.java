package com.dev.HiddenBath.config;

import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.dev.HiddenBath.interceptor.LogInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LogInterceptor());
	}
	
	@Value("${spring.upload.env}")
	private String env;

	@Value("${spring.upload.path}")
	private String commonPath;
	
	@Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String path = Paths.get(commonPath).toUri().toString();
        registry.addResourceHandler("/administration/upload/**")
                .addResourceLocations(path); 
    }
}
