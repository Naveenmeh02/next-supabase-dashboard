"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const logout = async () => {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to sign out');
  }
  
  return response.json();
};

export default function SignOut({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSignOut = async () => {
    startTransition(async () => {
      try {
        await logout();
        router.push('/auth');
        router.refresh();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    });
  };

  return (
    <form action={handleSignOut}>
      <Button
        type="submit"
        className={cn("w-full flex items-center gap-2", className)}
        variant="outline"
        disabled={isPending}
      >
        Sign Out
        <AiOutlineLoading3Quarters
          className={cn("animate-spin", { hidden: !isPending })}
        />
      </Button>
    </form>
  );
}
