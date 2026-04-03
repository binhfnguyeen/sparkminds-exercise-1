package com.heulwen.demo.service.impl;

import com.heulwen.demo.service.SystemConfigService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SystemConfigServiceImpl implements SystemConfigService {

    RedisTemplate<String, Object> redisTemplate;
    static String MAINTENANCE_KEY = "SYSTEM_MAINTENANCE_MODE";

    @Override
    public void setMaintenanceMode(boolean enabled) {
        redisTemplate.opsForValue().set(MAINTENANCE_KEY, enabled);
    }

    @Override
    public boolean isMaintenanceMode() {
        Object val = redisTemplate.opsForValue().get(MAINTENANCE_KEY);
        return val != null && (boolean) val;
    }
}
