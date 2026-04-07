package com.dev.HiddenBath.interceptor;

import java.util.Date;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class LogInterceptor implements HandlerInterceptor {

	private final String IS_MOBILE = "MOBILE";
	private final String IS_PHONE = "PHONE";
	private final String IS_TABLET = "TABLET";
	private final String IS_PC = "PC";

	public static String getClientIP(HttpServletRequest request) {
		String ip = request.getHeader("X-Forwarded-For");

		if (ip == null) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_CLIENT_IP");
		}
		if (ip == null) {
			ip = request.getHeader("HTTP_X_FORWARDED_FOR");
		}
		if (ip == null) {
			ip = request.getRemoteAddr();
		}

		return ip;
	}

	public String isDevice(HttpServletRequest req) {
		String userAgent = req.getHeader("User-Agent").toUpperCase();

		if (userAgent.indexOf(IS_MOBILE) > -1) {
			if (userAgent.indexOf(IS_PHONE) == -1)
				return IS_MOBILE;
			else
				return IS_TABLET;
		} else
			return IS_PC;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
		
		
//		System.out.println(new Date());
//		System.out.println(request.getHeader("REFERER"));
//		System.out.println(getClientIP(request));
//		System.out.println(isDevice(request));
//		String requestURI = request.getRequestURI();
//		if (!requestURI.contains("/front") && !requestURI.contains("highLightTitle.png")
//				&& !requestURI.contains("error") && !requestURI.contains("/administration")) {
//			System.out.println(requestURI);
//			HttpSession session = request.getSession();
//			int a = (int) (Math.random() * 100);
//			if (request.getSession().getAttribute("user") == null) {
//				session.setAttribute("user", a);
//			}
//			return true;
//		}
		
		HttpSession session = request.getSession();
		if (request.getSession().getAttribute("user") == null) {
			int a = (int) (Math.random() * 100);
			session.setAttribute("user", a);
			System.out.println(new Date());
			System.out.println(request.getHeader("REFERER"));
			System.out.println(getClientIP(request));
			System.out.println(isDevice(request));
		}else {
			
			
			String requestURI = request.getRequestURI();
			if (!requestURI.contains("/front") && !requestURI.contains("highLightTitle.png")
					&& !requestURI.contains("error") && !requestURI.contains("/administration")) {
				System.out.println(request.getSession().getAttribute("user"));
				System.out.println(requestURI);
				return true;
			}
		}

		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
	}

}
