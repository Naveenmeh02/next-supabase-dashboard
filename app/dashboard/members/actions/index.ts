"use server";

import { readUserSession } from "@/lib/actions";
import { createSupabaseAdmin, createSupabaseServerClient } from "@/lib/supabase";
import { error } from "console";
import { unstable_noStore } from "next/cache";

export async function createMember(data: {
    email: string;
    password: string;
    name: string;
    role: "user" | "admin";
    status: "active" | "resigned";
    confirm: string;
}) {

	const {data:userSession} = await readUserSession()
	if(userSession.session?.user.user_metadata.role!=="admin"){

		return JSON.stringify({error:{message:"you are not allowed	"}})
	}
	const supabase = await createSupabaseAdmin()

	const createResult = await supabase.auth.admin.createUser({
		email:data.email,
		password:data.password,
		email_confirm:true,
		user_metadata:{
			role:data.role
		}
	})

	if(createResult.error?.message){
		return JSON.stringify(createResult)
	}else{
		const memberResult = await supabase.from("member").insert({
			name:data.name,
			id:createResult.data.user?.id,
		})
		if(memberResult.error?.message){
			return JSON.stringify(memberResult)
		}else{
			const permissionResult = await supabase.from("permission").insert({
				role:data.role,
				member_id:createResult.data.user?.id,
				status:data.status
			})
			return JSON.stringify(permissionResult)
		}
	}
}
export async function updateMemberById(id: string) {
	console.log("update member");
}
export async function deleteMemberById(id: string) {}
export async function readMembers() {
	unstable_noStore()
	const supabase = await createSupabaseServerClient()
	return await supabase.from("permission").select("*,member(*)")
}
