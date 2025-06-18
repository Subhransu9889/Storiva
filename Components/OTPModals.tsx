'use client'
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/Components/ui/alert-dialog'
import Image from 'next/image';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/Components/ui/input-otp'
import {Button} from "@/Components/ui/button";
import {sendEmailOTP, verifySecret} from "@/lib/actions/user.actions";
import {useRouter} from "next/navigation";

const OTPModals = ({accountId, email}: {accountId:string; email: string}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [otpError, setOtpError] = React.useState('');

  const handleSubmit = async(e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        // call api to varify otp
      const sessionId = await verifySecret({accountId, password});

      if(sessionId){
        router.push('/');
      }
    } catch (error) {
      console.log(error);
      setOtpError('Invalid OTP');
    }
    setIsLoading(false);
  }

  const handleResetOTP = async () => {
  //   call api to resend the OTP
    await sendEmailOTP({email});
  }

  return <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
    <AlertDialogContent className='shad-alert-dialog'>
      <AlertDialogHeader className='relative flex justify-center'>
        <AlertDialogTitle className='h2 text-center'>
          Enter Your OTP
          <Image src='/assets/icons/close-dark.svg' alt='close' width={24} height={24} className='otp-close-button' onClick={() => setIsOpen(false)}/>
        </AlertDialogTitle>
        <AlertDialogDescription className='subtitle-2 text-center text-light-100'>
          We&#39;ve sent an OTP to <span className='pl-1 text-brand'>{email}</span>. Please enter the OTP to continue.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <InputOTP maxLength={6} value={password} onChange={setPassword}>
        <InputOTPGroup className='shad-otp'>
          <InputOTPSlot index={0} className='shad-otp-slot'/>
          <InputOTPSlot index={1} className='shad-otp-slot'/>
          <InputOTPSlot index={2} className='shad-otp-slot'/>
          <InputOTPSlot index={3} className='shad-otp-slot'/>
          <InputOTPSlot index={4} className='shad-otp-slot'/>
          <InputOTPSlot index={5} className='shad-otp-slot'/>
        </InputOTPGroup>
      </InputOTP>
      {otpError && (
          <div className='flex items-center justify-center'>
            <p className='text-rose-700'>{otpError}</p>
          </div>
      )}
      <AlertDialogFooter>
        <div className='flex w-full flex-col gap-4'>
        <AlertDialogAction onClick={handleSubmit} className='shad-submit-btn h-12' type='button'>
          Submit
          {
            isLoading && (<Image src='/assets/icons/loader.svg' alt='loader' height={24} width={24} className='ml-2 animate-spin'/>)
          }
        </AlertDialogAction>

          <div className='subtitle-2 mt-2 text-center text-light-100'>
            Didn&#39;t receive the OTP?
            <Button type='button' variant='link' className='pl-1 text-brand' onClick={handleResetOTP}>
              Click to resend
            </Button>
          </div>

        </div>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
};

export default OTPModals;