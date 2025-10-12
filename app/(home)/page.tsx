import React from "react";
import { readUserSession } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Home() {
	const { data: userSession } = await readUserSession();

	if (userSession.session) {
		return redirect("/dashboard");
	} else {
		return redirect("/auth");
	}
}
