package com.heulwen.demo.controller;

import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.EmailService;
import com.heulwen.demo.service.SystemConfigService;
import com.heulwen.demo.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SystemConfigController {

    SystemConfigService systemConfigService;
    EmailService emailService;
    UserService userService;

    @GetMapping
    public ApiResponse<Map<String, Object>> getConfig(){
        return ApiResponse.<Map<String, Object>>builder()
                .result(Map.of("maintenanceMode", systemConfigService.isMaintenanceMode()))
                .build();
    }

    @PutMapping("/maintenance")
    public ApiResponse<String> toggleMaintenanceMode(@RequestParam boolean enabled){
        systemConfigService.setMaintenanceMode(enabled);

        if (enabled){
            List<String> allEmails = userService.allEmails();
            emailService.sendMaintenanceEmailToAll(allEmails);
        }

        return ApiResponse.<String>builder()
                .message("Maintenance mode updated to: " + enabled)
                .build();
    }
}
