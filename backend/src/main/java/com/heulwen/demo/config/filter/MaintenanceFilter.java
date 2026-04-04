package com.heulwen.demo.config.filter;

import com.heulwen.demo.service.SystemConfigService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class MaintenanceFilter extends OncePerRequestFilter {
    private final SystemConfigService systemConfigService;
    private final AntPathMatcher pathMatcher = new AntPathMatcher();
    private final List<String> ALWAYS_ALLOWED_URL = Arrays.asList(
            "/api/login/**",
            "/api/refresh-token",
            "/images/**"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();

        if (systemConfigService.isMaintenanceMode()) {

            boolean isAllowedUrl = ALWAYS_ALLOWED_URL.stream()
                    .anyMatch(pattern -> pathMatcher.match(pattern, path));

            if (!isAllowedUrl) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                        .anyMatch(auth -> Objects.equals(auth.getAuthority(), "ROLE_ADMIN"));
                if (!isAdmin) {
                    response.setStatus(HttpStatus.SERVICE_UNAVAILABLE.value());
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"code\": 5003, \"message\": \"Hệ thống đang bảo trì. Vui lòng quay lại sau.\"}");
                    return;
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
