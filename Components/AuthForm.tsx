"use client"
import React, {useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import Image from "next/image";
import Link from "next/link";


type FormType = 'signin' | 'signup';

const AuthForm = ({type} : {type: FormType}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                <h1 className='form-title'>{type === "signin" ? 'Sign In' : 'Sign Up'}</h1>
                {type === "signup" && (
                   <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                <FormLabel className="shad-form-label">FullName</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your Full Name" className='shad-input' {...field} />
                                </FormControl>

                                 </div>
                                <FormMessage className='shad-form-message'/>
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
                                    <Input placeholder="Enter your Email" className='shad-input' {...field} />
                                </FormControl>

                            </div>
                                <FormMessage className='shad-form-message'/>
                        </FormItem>
                    )}
                />
                <Button type="submit" className='form-submit-button' disabled={isLoading}>
                    {type === 'signin'? 'Sign In' : 'Sign Up'}
                    {
                        isLoading && (<Image src='/assets/icons/loader.svg' alt='loader' height={24} width={24} className='ml-2 animate-spin'/>)
                    }
                </Button>

                {
                    errorMessage && (
                        <p className='error-message'>*{errorMessage}</p>
                    )
                }
                <div className='body-2 flex justify-center'>
                    <p className='text-light-100'>
                        {type === 'signin' ? 'Don\'t have an account?' : 'Already have an account?' }
                    </p>
                    <Link href={type === 'signin' ? '/sign-up' : '/sign-in'} className='ml-1 font-medium text-brand'>{type === 'signin'? 'Sign Up' : 'Sign In'}</Link>
                </div>
            </form>
        </Form>
    </>
  )
};

export default AuthForm;