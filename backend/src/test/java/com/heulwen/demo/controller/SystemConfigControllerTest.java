package com.heulwen.demo.controller;

import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.JwtService;
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

import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(SystemConfigController.class)
@AutoConfigureMockMvc(addFilters = false)
class SystemConfigControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SystemConfigService systemConfigService;

    @MockitoBean
    private EmailService emailService;

    @MockitoBean
    private UserService userService;

    @MockitoBean private JpaMetamodelMappingContext jpaMappingContext;
    @MockitoBean private JwtService jwtService;
    @MockitoBean private AuthService authService;

    @Test
    void getConfig_Success() throws Exception {
        Mockito.when(systemConfigService.isMaintenanceMode()).thenReturn(true);

        mockMvc.perform(get("/api/admin/config")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.maintenanceMode").value(true));
    }

    @Test
    void toggleMaintenanceMode_Enable_Success() throws Exception {
        Mockito.doNothing().when(systemConfigService).setMaintenanceMode(true);
        Mockito.when(userService.allEmails()).thenReturn(List.of("user@test.com"));
        Mockito.doNothing().when(emailService).sendMaintenanceEmailToAll(Mockito.anyList());

        mockMvc.perform(put("/api/admin/config/maintenance")
                        .param("enabled", "true")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Maintenance mode updated to: true"));

        Mockito.verify(emailService, Mockito.times(1)).sendMaintenanceEmailToAll(Mockito.anyList());
    }
}