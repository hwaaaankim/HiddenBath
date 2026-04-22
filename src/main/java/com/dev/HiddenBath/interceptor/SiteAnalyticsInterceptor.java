package com.dev.HiddenBath.interceptor;

import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.dev.HiddenBath.service.access.SiteAnalyticsService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SiteAnalyticsInterceptor implements HandlerInterceptor {

    private final SiteAnalyticsService siteAnalyticsService;

    @Override
    public void postHandle(HttpServletRequest request,
                           HttpServletResponse response,
                           Object handler,
                           ModelAndView modelAndView) {

        if (!(handler instanceof HandlerMethod)) {
            return;
        }

        if (modelAndView == null) {
            return;
        }

        String viewName = modelAndView.getViewName();
        if (viewName == null || viewName.isBlank()) {
            return;
        }

        if (viewName.startsWith("redirect:") || viewName.startsWith("forward:")) {
            return;
        }

        String uri = request.getRequestURI();
        if (uri == null || uri.isBlank()) {
            return;
        }

        siteAnalyticsService.recordPageView(request, response);
    }
}