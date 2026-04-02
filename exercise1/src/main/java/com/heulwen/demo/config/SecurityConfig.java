package com.heulwen.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
public class SecurityConfig {
    @Value("${spring.jwt.signerkey}")
    private String SIGNER_KEY;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(request
                    -> request.requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers("/images/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/verify-email").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/verify-email-link").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/resend-verification").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/refresh-token").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/reset-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login/mfa-verify").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/login/google").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/upload-image").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/logout").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/change-password").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/change-phone").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/send-otp-change-mail").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/change-mail").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/mfa/setup").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/mfa/enable").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/profile").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/books/{book_id}/borrow").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/members/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/members/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/members/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/members/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/borrow/books").hasRole("USER")
                        .anyRequest().authenticated()
                );

        httpSecurity.oauth2ResourceServer(oauth2
            -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                .decoder(jwtDecoder())
                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
        );

        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        return httpSecurity.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(){
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:3000"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.addAllowedHeader("*");
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
