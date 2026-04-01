package com.heulwen.demo.service.impl;

import com.heulwen.demo.dto.request.MemberCreateRequest;
import com.heulwen.demo.dto.request.MemberUpdateRequest;
import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.exception.AppException;
import com.heulwen.demo.exception.ErrorCode;
import com.heulwen.demo.mapper.UserMapper;
import com.heulwen.demo.model.User;
import com.heulwen.demo.model.enumType.Role;
import com.heulwen.demo.model.enumType.UserStatus;
import com.heulwen.demo.repository.UserRepository;
import com.heulwen.demo.service.MemberService;
import com.heulwen.demo.specification.UserSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MemberServiceImpl implements MemberService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> searchMembers(String keyword, String dobFromStr, String dobToStr, int page, int size, String sortBy, String sortDir) {
        LocalDate dobFrom = null;
        LocalDate dobTo = null;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("ddMMyyyy");

        try {
            if (dobFromStr != null && !dobFromStr.isEmpty()) dobFrom = LocalDate.parse(dobFromStr, formatter);
            if (dobToStr != null && !dobToStr.isEmpty()) dobTo = LocalDate.parse(dobToStr, formatter);
        } catch (DateTimeParseException e) {
            throw new AppException(ErrorCode.INVALID_DATE_FORMAT);
        }

        if (dobFrom != null && dobTo != null && dobFrom.isAfter(dobTo)) {
            throw new AppException(ErrorCode.INVALID_DATE_RANGE);
        }

        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<User> members = userRepository.findAll(UserSpecification.searchMembers(keyword, dobFrom, dobTo), pageable);

        return members.map(UserMapper::map);
    }

    @Override
    public UserResponse createMember(MemberCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .role(Role.USER)
                .status(UserStatus.ACTIVE)
                .deleted(false)
                .build();

        return UserMapper.map(userRepository.save(user));
    }

    @Override
    public UserResponse updateMember(Long id, MemberUpdateRequest request) {
        User user = userRepository.findByIdAndRoleAndDeletedFalse(id, Role.USER)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.getPhone() != null && !request.getPhone().equals(user.getPhone()) && userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());

        return UserMapper.map(userRepository.save(user));
    }

    @Override
    public void deleteMemberSoft(Long id) {
        User user = userRepository.findByIdAndRoleAndDeletedFalse(id, Role.USER)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setDeleted(true);
        userRepository.save(user);
    }
}
