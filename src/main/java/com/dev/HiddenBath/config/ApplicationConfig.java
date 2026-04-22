package com.dev.HiddenBath.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dev.HiddenBath.service.auth.PrincipalDetailsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationConfig {

	private final PrincipalDetailsService principalDetailsService;

	@Bean
	AuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
		log.info("DaoAuthenticationProvider");
		DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(principalDetailsService);
		authProvider.setPasswordEncoder(passwordEncoder);
		authProvider.setHideUserNotFoundExceptions(false);
		return authProvider;
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}