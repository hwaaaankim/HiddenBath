package com.dev.HiddenBath.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.WebApplicationInitializer;

import jakarta.servlet.ServletContext;
import jakarta.servlet.ServletException;

@Configuration
public class MainWebAppInitializer implements WebApplicationInitializer {
   
	@Override
    public void onStartup(ServletContext sc) throws ServletException {
        sc.getSessionCookieConfig().setHttpOnly(false);        
        sc.getSessionCookieConfig().setSecure(false);        
    }
}
