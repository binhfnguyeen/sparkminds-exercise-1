package com.heulwen.demo.service;

import com.heulwen.demo.dto.AuthenticateDto;
import com.heulwen.demo.form.LoginForm;

public interface AuthService {
    AuthenticateDto login(LoginForm form);
}
