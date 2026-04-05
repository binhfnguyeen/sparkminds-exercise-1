package com.heulwen.demo.controller;

import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.service.AuthService;
import com.heulwen.demo.service.JwtService;
import com.heulwen.demo.service.MemberService;
import com.heulwen.demo.service.SystemConfigService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.mapping.JpaMetamodelMappingContext;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
@AutoConfigureMockMvc(addFilters = false)
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MemberService memberService;

    @MockitoBean private SystemConfigService systemConfigService;
    @MockitoBean private JpaMetamodelMappingContext jpaMappingContext;
    @MockitoBean private JwtService jwtService;
    @MockitoBean private AuthService authService;

    @Test
    void searchMembers_Success() throws Exception {
        UserResponse mockUser = new UserResponse();
        mockUser.setId(1L);
        mockUser.setEmail("test@gmail.com");
        Page<UserResponse> mockPage = new PageImpl<>(List.of(mockUser));

        Mockito.when(memberService.searchMembers(any(), any(), any(), anyInt(), anyInt(), anyString(), anyString()))
                .thenReturn(mockPage);

        mockMvc.perform(get("/api/members/search")
                        .param("page", "0")
                        .param("size", "10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.result.content[0].email").value("test@gmail.com"));
    }

    @Test
    void blockMember_Success() throws Exception {
        Mockito.doNothing().when(memberService).blockMember(1L);

        mockMvc.perform(put("/api/members/1/block")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1000))
                .andExpect(jsonPath("$.message").value("Unblock member successfully!")); // Lưu ý: Hình như API thực tế của bạn trả về chung message "Unblock member..." ở cả hàm block.
    }
}