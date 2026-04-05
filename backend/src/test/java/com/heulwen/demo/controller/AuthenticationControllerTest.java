package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.LoginRequest;
import com.heulwen.demo.dto.request.UserCreateRequest;
import com.heulwen.demo.dto.response.AuthenticateResponse;
import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.MfaService;
import com.heulwen.demo.service.SystemConfigService;
import com.heulwen.demo.service.UserService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthenticationController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private MfaService mfaService;

    @MockitoBean private SystemConfigService systemConfigService;
    @MockitoBean private JpaMetamodelMappingContext jpaMappingContext;
    @MockitoBean private JwtService jwtService;

    private UserCreateRequest validRequest() {
        UserCreateRequest request = new UserCreateRequest();
        request.setEmail("user@test.com");
        request.setPassword("abc12345");
        request.setPhone("0123456789");
        request.setFirstName("Nguyen");
        request.setLastName("Chau");
        request.setDateOfBirth(LocalDate.of(2000, 1, 1));
        return request;
    }

    @Test
    void login_Success() throws Exception {
        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123456");

        AuthenticateResponse mockResponse = new AuthenticateResponse();
        mockResponse.setAccessToken("mock-jwt-access-token");
        mockResponse.setRefreshToken("mock-jwt-refresh-token");

        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(mockResponse);

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.result.accessToken").value("mock-jwt-access-token"))
                .andExpect(jsonPath("$.result.refreshToken").value("mock-jwt-refresh-token"));

    }

    @Test
    void register_Success() throws Exception {
        UserCreateRequest request = new UserCreateRequest();
        request.setEmail("user@test.com");
        request.setPassword("abc12345");

        UserResponse mockResponse = new UserResponse();
        mockResponse.setId(1L);
        mockResponse.setEmail("user@test.com");

        Mockito.when(userService.createUser(any())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Register successful"))
                .andExpect(jsonPath("$.result.email").value("user@test.com"));
    }

    @Test
    void register_EmailBlank() throws Exception {
        UserCreateRequest request = validRequest();
        request.setEmail("");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_EmailInvalid() throws Exception {
        UserCreateRequest request = validRequest();
        request.setEmail("abc");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_PasswordBlank() throws Exception {
        UserCreateRequest request = validRequest();
        request.setPassword("");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_PasswordInvalid() throws Exception {
        UserCreateRequest request = validRequest();
        request.setPassword("12345678");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_PhoneInvalid() throws Exception {
        UserCreateRequest request = validRequest();
        request.setPhone("123");

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void logout_Success() throws Exception {
        String mockToken = "Bearer mock-token";
        Mockito.doNothing().when(authService).logout(mockToken);

        mockMvc.perform(post("/api/logout")
                        .header("Authorization", mockToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Logout successful"));
    }
}