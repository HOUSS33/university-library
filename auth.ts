//https://chatgpt.com/share/67e3db12-8708-8012-bf06-c198d5be9bd9

import NextAuth, { User } from "next-auth";
import { compare } from "bcryptjs";     // bcryptjs function to compare plain text password with hashed password
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from "./database/drizzle"; // Drizzle ORM database instance
import { users } from "./database/schema"; // Database schema definition for users table
import { eq } from "drizzle-orm"; // Drizzle ORM equality operator for queries




export const { handlers, signIn, signOut, auth } = NextAuth({


    session:{
        //Configures session management to use JSON Web Tokens (JWT), Alternative would be 'database' strategy
        strategy: 'jwt',
    },


  providers: [
    //Defines authentication providers (in this case, credentials-based), authorize: Async function to verify user credentials
    CredentialsProvider({
      async authorize(credentials){
        // Logic here

        
        // Check if there is no credentials
        if(!credentials?.email || !credentials?.password){
          return null;
        }

        // Fetch the user from DB
        const user = await db 
        .select() 
        .from(users)
        .where(eq(users.email, credentials.email.toString()))
        .limit(1);

        // If User not found
        if(user.length === 0) return null;

        // If User found, Check if its password is correct
        const isPasswordValid = await compare(credentials.password.toString(), user[0].password);

        // If incorrect password
        if(!isPasswordValid) return null;

        // If correct password return an Object User containing info
        //Returns user object if authentication succeeds, Casts to NextAuth User type, Converts id to string (required by NextAuth)
        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName
        } as User;
      },
    })
  ],



  
  //When authentication is required (e.g., when trying to access a protected page), NextAuth automatically redirects users to a sign-in page.
  pages: {                        
    signIn: "/sign-in"            //the sign-in page
  },




  callbacks: {
    //jwt callback: Modifies JWT token, Adds user id and name to token when user is present, Called when token is created/updated
    async jwt({ token, user }){
      if(user){
        token.id = user.id;
        token.name = user.name;
      }

      return token;
    },



    //session callback: Modifies session object, Syncs session data with token data, Adds id and name to session.user
    async session({ session, token }) {
      //If a Session exist
      if(session.user){
        session.user.id = token.id as string;
        session.user.name = token.name as string;

      }

      return session;
    },
  }
})



/*
How It Works Together:
1-User submits credentials via sign-in form
2-CredentialsProvider's authorize function verifies:
3-Checks credentials existence
4-Queries database for user
5-Validates password
6-If successful, creates JWT with user data
7-Session is populated with user data from token
8-Custom sign-in page is used at "/sign-in"
*/