'use server';
import {cookies} from "next/headers";
import {MemberCreateRequest, MemberUpdateRequest, SearchMemberParams} from "@/shared/types/member.types";
import {memberService} from "@/features/member/services/member.service";
import {revalidatePath} from "next/cache";

const getToken = async (): Promise<string> => {
    const cookieStore = await cookies();
    return (
        cookieStore.get('adminAccessToken')?.value ||
        cookieStore.get('accessToken')?.value ||
        ''
    );
};

export async function searchMembersAction(params: SearchMemberParams) {
    const token = await getToken();
    return memberService.searchMembers(token, params);
}

export async function createMemberAction(data: MemberCreateRequest) {
    const token = await getToken();
    const result = await memberService.createMember(token, data);

    revalidatePath('/admin/members');
    return result;
}

export async function updateMemberAction(id: number, data: MemberUpdateRequest) {
    const token = await getToken();
    const result = await memberService.updateMember(token, id, data);

    revalidatePath('/admin/members');
    return result;
}

export async function deleteMemberAction(id: number) {
    const token = await getToken();
    const result = await memberService.deleteMember(token, id);

    revalidatePath('/admin/members');
    return result;
}