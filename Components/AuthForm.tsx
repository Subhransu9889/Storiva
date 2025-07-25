"use client"
import React, {useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from '@/Components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/Components/ui/form'
import { Input } from '@/Components/ui/input'
import Image from "next/image";
import Link from "next/link";
import {createAccount, SignInUser} from "@/lib/actions/user.actions";
import OTPModals from "@/Components/OTPModals";


type FormType = 'signin' | 'signup';

const AuthForm = ({type} : {type: FormType}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [accountId, setAccountId] = useState(null);

    const authFormSchema = (formType : FormType) => {
        return z.object({
            email: z.string().email(),
            fullName: formType === 'signup' ? z.string().min(2).max(50) : z.string().optional(),
        });
    }
  // 1. Define your form.
    const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
        email: '',
    },
  })

  // 2. Define a submit handler.
  const  onSubmit = async (values: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      setErrorMessage('');
    try {
        const user = type === 'signup' ? await createAccount({
            fullName: values.fullName || '',
            email: values.email,
        }) : await SignInUser({email: values.email});
        setAccountId(user.accountId);
    } catch {
        setErrorMessage('Failed to create account. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }
  return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className="form-title">
                    {type === "sign-in" ? "Sign In" : "Sign Up"}
                </h1>
                {type === "sign-up" && (
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">Full Name</FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Enter your full name"
                                            className="shad-input"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>

                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />
                )}

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <div className="shad-form-item">
                                <FormLabel className="shad-form-label">Email</FormLabel>

                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        className="shad-input"
                                        {...field}
                                    />
                                </FormControl>
                            </div>

                            <FormMessage className="shad-form-message" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="form-submit-button"
                    disabled={isLoading}
                >
                    {type === "sign-in" ? "Sign In" : "Sign Up"}

                    {isLoading && (
                        <Image
                            src="/assets/icons/loader.svg"
                            alt="loader"
                            width={24}
                            height={24}
                            className="ml-2 animate-spin"
                        />
                    )}
                </Button>

                {errorMessage && <p className="error-message">*{errorMessage}</p>}

                <div className="body-2 flex justify-center">
                    <p className="text-light-100">
                        {type === "sign-in"
                            ? "Don't have an account?"
                            : "Already have an account?"}
                    </p>
                    <Link
                        href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                        className="ml-1 font-medium text-brand"
                    >
                        {" "}
                        {type === "sign-in" ? "Sign Up" : "Sign In"}
                    </Link>
                </div>
            </form>
        </Form>

        {accountId && (
            <OTPModals email={form.getValues("email")} accountId={accountId} />
        )}
    </>
  )
};

export default AuthForm;