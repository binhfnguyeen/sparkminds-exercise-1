package com.heulwen.demo.controller;

import com.heulwen.demo.dto.request.MemberCreateRequest;
import com.heulwen.demo.dto.request.MemberUpdateRequest;
import com.heulwen.demo.dto.response.ApiResponse;
import com.heulwen.demo.dto.response.UserResponse;
import com.heulwen.demo.service.MemberService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MemberController {

    MemberService memberService;

    @GetMapping("/members/search")
    public ApiResponse<Page<UserResponse>> searchMembers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String dobFrom,
            @RequestParam(required = false) String dobTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        return ApiResponse.<Page<UserResponse>>builder()
                .code(1000)
                .message("Find members successfully!")
                .result(memberService.searchMembers(keyword, dobFrom, dobTo, page, size, sortBy, sortDir))
                .build();
    }

    @PostMapping("/members")
    public ApiResponse<UserResponse> createMember(@Valid @RequestBody MemberCreateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Create member successfully!")
                .result(memberService.createMember(request))
                .build();
    }

    @PutMapping("/members/{id}")
    public ApiResponse<UserResponse> updateMember(@PathVariable Long id, @RequestBody MemberUpdateRequest request) {
        return ApiResponse.<UserResponse>builder()
                .code(1000)
                .message("Update member successfully!")
                .result(memberService.updateMember(id, request))
                .build();
    }

    @DeleteMapping("/members/{id}")
    public ApiResponse<String> deleteMember(@PathVariable Long id) {
        memberService.deleteMemberSoft(id);
        return ApiResponse.<String>builder()
                .code(1000)
                .message("Delete member successfully!")
                .result(null)
                .build();
    }
}
