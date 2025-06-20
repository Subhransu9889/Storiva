'use client'

import React, {useState} from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/Components/ui/sheet'
import Image from "next/image";
import {usePathname} from "next/navigation";
import {Separator} from "@/Components/ui/separator";
import {navItems} from "@/constants";
import Link from "next/link";
import {cn} from "@/lib/utils";
import FileUploader from "@/Components/FileUploader";
import {SignOutUser} from "@/lib/actions/user.actions";

interface Props {
  $id: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}


const MobileNavigation = ({$id: ownerId, accountId, fullName, avatar, email}: Props) => {

  const [open, setOpen] = useState(false);
  const pathname = usePathname();


  return <header className='mobile-header'>
    <Image src='/assets/icons/logo.svg' alt='logo' width={120} height={52} className='h-auto'/>
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Image src='/assets/icons/menu.svg' alt='Search' width={30} height={30}/>
      </SheetTrigger>
      <SheetContent className='shad-sheet h-screen px-3'>
          <SheetTitle>
            <div className='header-user'>
              <Image src={avatar} alt='avatar' width={44} height={44} className='header-user-avatar'/>
              <div className='sm:hidden lg:block'>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption w-full'>{email}</p>
              </div>
            </div>
            <Separator className='mb-4 bg-light-200/20'/>
          </SheetTitle>
          <nav className='mobile-nav'>
            {navItems.map(({name, url, icon}) => (
                <Link href={url} key={name} className='lg:w-full'>
                  <li className={cn("mobile-nav-item", pathname === url && "shad-active")}>
                    <Image src={icon} alt={name} width={24} height={24} className={cn('nav-icon', pathname === url && 'nav-icon-active')}/>
                    <p>{name}</p>
                  </li>
                </Link>
            ))}
          </nav>
        <Separator className='my-5 bg-light-200/20'/>
        <div className='flex flex-col justify-between gap-5 pb-5'>
          <FileUploader ownerId={ownerId} accountId={accountId}/>

          <button type='submit' className='mobile-sign-out-button justify-center' onClick={async () => await SignOutUser()}>
            <Image src='/assets/icons/logout.svg' alt='logout' width={24} height={24} className='w-6'/>
            <p>Sign Out</p>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  </header>
};

export default MobileNavigation;