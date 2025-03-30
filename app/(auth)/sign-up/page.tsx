"use client";

import React from "react";
import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { signUp } from "@/lib/actions/auth";


//Using the AuthForm (SIGN_UP type)
const Page = () => {
    return (

    //TypeScript can infer T here
    <AuthForm 
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
        email: '',
        password: '',
        fullName: '',
        universityId: 0,
        universityCard: '',
    }}
    onSubmit={signUp}
    />
)

/*
// Explicitly pass the type `T` if necessary
<AuthForm<MyFormType>
  type="SIGN_UP"
  schema={signUpSchema}
  defaultValues={{
    email: '',
    password: '',
    fullName: '',
    universityId: 0,
    universityCard: '',
  }}
  onSubmit={signUp}
/>
*/
}



/*

function Greeting({ name, age }) {}

<Greeting name="Alice" age={25} />;


*/


export default Page; 










/*
It’s an object with key-value pairs:
    {
        email: '',
        password: '',
        fullName: '',
        universityId: 0,
        universityCard: '',
    }
*/