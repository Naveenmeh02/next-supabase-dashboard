"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "@/lib/utils";
import { loginWithEmailAndPassword, signUpWithEmailAndPassword } from "../actions";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthMode = 'login' | 'signup';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    form.clearErrors();
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsPending(true);
    try {
      if (mode === 'login') {
        const { error } = await loginWithEmailAndPassword(data);
        
        if (error) {
          throw new Error(error.message);
        }
        
        // The redirect will happen in the server action
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      } else {
        const signupResult = await signUpWithEmailAndPassword(data);
        
        if (signupResult && 'error' in signupResult && signupResult.error) {
          throw new Error(signupResult.error.message);
        }
        
        // If we get here, signup was successful and redirect happened
        // or will happen in the server action
        toast({
          title: "Success",
          description: "Account created successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {mode === 'login' ? 'Welcome back' : 'Create an account'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'login' 
            ? 'Enter your credentials to sign in' 
            : 'Create your account to get started'}
        </p>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    {mode === 'login' && (
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isPending}
            >
              {isPending && (
                <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
              )}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
