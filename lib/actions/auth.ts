//https://chatgpt.com/share/67e3dbb3-7da0-8012-9cf9-dfe523f9ee8f

//this notation tells this file and the rest of the code that whatever function you have in this file will only be called from the server side not the client side and this is important because whenerver you make databse calls or db muations those calls have to be vary secure
'use server';
import { db } from "@/database/drizzle";               // Drizzle ORM database instance
import { users } from "@/database/schema";             // Database schema definition for users table
import { eq } from "drizzle-orm";                      // Drizzle ORM equality operator for queries

import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { error } from "console";
import { headers } from "next/headers";
  
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

import { signOut } from "@/auth";






                                              //Object as an argument
export const signInWithCredentials = async (params: Pick<AuthCredentials, 'email' | 'password'> //we pick only em & pas
) => {
    const { email, password } = params;

        //getting ip adress from user
        const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1.';
        const { success } = await ratelimit.limit(ip);
    
        if(!success) return redirect("/too-fast");
        

    try{
        // we wanna signIn using the "credential methods" 
        const result = await signIn('credentials', {email, password, redirect: false,});

        if(result?.error) {
            return { success: false, error: result.error}
        }

        return { success: true};

    }catch(error){
        console.log(error, "Signin error");
        return { success: false, error:"signin error"};
    }
}


//Object as an argument
export const signUp = async (params: AuthCredentials) => {     //AuthCredentials Coming from type.d.ts
    const { fullName, email, universityCard, password, universityId} = params;

    //getting ip adress from user
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1.';
    const { success } = await ratelimit.limit(ip);

    if(!success) return redirect("/too-fast");


    //lets try to fetch an existing user
    const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

    if(existingUser.length>0) {
        return { success: false, error: "User already exists"};
    }

    const hashedPassword = await hash(password, 10); //salt:10 means the complexity


    try{
        //Sign Up process
        await db.insert(users).values({
            fullName,
            email,
            universityId,
            password: hashedPassword,
            universityCard,
        })

        //After SignUp we sign them in directly
        await signInWithCredentials({email, password}); // { email, password } Object as an argument

        return {success: true};

    }catch(error){
        console.log(error,"Signup error");
        return { success: false, error: "Signup error"};
    }
}


export async function logoutAction(){
    await signOut();
}





/*
-You're using NextAuth.js to handle authentication, and this line calls the signIn function provided:
  1-'credentials' specifies that we are using CredentialsProvider as the authentication method (instead of OAuth, GitHub, Google, etc.).


-User submits the sign-in form (email + password).
-The request is sent to NextAuth's credentials provider.
-The authorize function in your auth.ts file is triggered.

If authentication succeeds, NextAuth:
-Creates a JWT token and attaches user details (id, name, email).
-Calls the jwt and session callbacks to store user details.
-Since redirect: false is set, it returns a response instead of redirecting.
 */


/* 
4. Why Use redirect: false?
If redirect: true (default behavior), NextAuth automatically redirects the user to the configured sign-in success page.

By setting redirect: false, you handle the response manually, allowing custom error handling in the UI.
*/