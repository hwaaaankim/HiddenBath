package com.dev.HiddenBath.config;

import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;

public class SessionListener implements HttpSessionListener {

	public void sessionCreated(HttpSessionEvent se) {
		se.getSession().setMaxInactiveInterval(60*60*30);
	}

	public void sessionDestroyed(HttpSessionEvent se) {
	}
}
