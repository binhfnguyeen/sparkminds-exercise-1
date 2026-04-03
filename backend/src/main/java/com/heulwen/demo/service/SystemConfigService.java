package com.heulwen.demo.service;

public interface SystemConfigService {
    void setMaintenanceMode(boolean enabled);
    boolean isMaintenanceMode();
}
