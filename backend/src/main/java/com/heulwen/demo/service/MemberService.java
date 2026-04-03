package com.heulwen.demo.service;

import com.heulwen.demo.dto.request.MemberCreateRequest;
import com.heulwen.demo.dto.request.MemberUpdateRequest;
import com.heulwen.demo.dto.response.UserResponse;
import org.springframework.data.domain.Page;

public interface MemberService {
    Page<UserResponse> searchMembers(String keyword, String dobFromStr, String dobToStr,
                                     int page, int size, String sortBy, String sortDir);
    UserResponse createMember(MemberCreateRequest request);
    UserResponse updateMember(Long id, MemberUpdateRequest request);
    void deleteMemberSoft(Long id);
    void unblockMember(Long id);
    void blockMember(Long id);
}
