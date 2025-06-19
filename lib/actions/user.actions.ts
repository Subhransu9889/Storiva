'use server'
//* *****Create Account Flow********
// 1. User enters a full name and email
// 2. Check if the user already exists using the email (we will use this to identify if we still need to create a user document or not)
// 3. Send OTP to the user's email
// 4. This will send a secret Key for Creating a new session.
// 5. Create a new user document if the use is a new user
// 6. Return the user's accountId that will be used to complete the log
// 7. Verify OTP and authenticate to login

import {createAdminClient, createSessionClient} from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {Query, ID} from "node-appwrite";
import {parseStringify} from "@/lib/utils";
import {cookies} from "next/headers";
import {avatarPlaceholderUrl} from "@/constants";

const getUserByEmail = async (email : string) => {
    const {databases} = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("email", [email])],
    );
    return result.total > 0 ? result.documents[0] : null;
}

const handleError = (err : unknown, message: string) => {
    console.log(err, message);
    throw new Error
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send email OTP");
    }
};

export const createAccount = async ({fullName, email} : {fullName : string; email: string}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({email});

    if(!accountId) throw new Error('Failed to send an OTP');

    if(!existingUser){
        const {databases} = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
            }
        )
    }

    return parseStringify({accountId});
}

export const verifySecret = async ({accountId, password}: {
    accountId: string;
    password: string;
}) => {
    try{
        const {account} = await createAdminClient();
        const session = await account.createSession(accountId, password);

        (await cookies()).set('storiva-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true,
        });

        return parseStringify({ sessionId: session.$id });
    } catch (error) {
        handleError(error, "Failed to verify OTP");
    }
}


export  const getCurrentUser = async () => {
   try{
       const {databases, account} = await createSessionClient();

       const result = await account.get();
       const user = await  databases.listDocuments(
           appwriteConfig.databaseId,
           appwriteConfig.userCollectionId,
           [Query.equal("accountId", result.$id)],
       );

       if(user.total <= 0) return null;

       return parseStringify(user.documents[0]);
   } catch (error) {
       console.log(error, 'Failed to get current user');
   }
}