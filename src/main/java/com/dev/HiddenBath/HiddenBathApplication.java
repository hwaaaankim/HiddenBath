package com.dev.HiddenBath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.dev.HiddenBath.config.SessionListener;

import jakarta.servlet.http.HttpSessionListener;

@EnableScheduling
@SpringBootApplication
public class HiddenBathApplication {

	public static void main(String[] args) {
		SpringApplication.run(HiddenBathApplication.class, args);
	}

	@Bean
	HttpSessionListener httpSessionListener() {
		
		return new SessionListener();
	}
}
