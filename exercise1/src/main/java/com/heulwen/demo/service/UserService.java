package com.heulwen.demo.service;

import com.heulwen.demo.dto.UserDto;
import com.heulwen.demo.form.UserCreateForm;
import com.heulwen.demo.form.VerifyEmailForm;

public interface UserService {
    UserDto createUser(UserCreateForm form);
    UserDto verifyEmailOtp(VerifyEmailForm form);
}
