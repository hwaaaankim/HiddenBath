package com.dev.HiddenBath.config;

public interface EmailSendable {
	void send(String[] to, String subject, String message) throws InterruptedException;
}