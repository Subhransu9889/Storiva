import React from 'react';
import Image from "next/image";
import Search from "@/Components/Search";
import FileUploader from "@/Components/FileUploader";
import {SignOutUser} from "@/lib/actions/user.actions";

const Header = () => {
  return <header className='header'>
      <Search/>

      <div className='header-wrapper'>
          <FileUploader/>

          <form action={async () => {
              "use server";

              await SignOutUser();
          }}
          >
              <button type='submit' className='sign-out-button'>
                  <Image src='/assets/icons/logout.svg' alt='logout' width={24} height={24} className='w-6'/>
              </button>
          </form>
      </div>
  </header>;
};

export default Header;