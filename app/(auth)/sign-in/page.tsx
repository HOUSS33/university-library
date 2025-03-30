"use client";

import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";
import { signInSchema } from "@/lib/validations";
import React from "react";


//Using the AuthForm (SIGN_IN type)
const Page = () => {
    return <AuthForm 
    type="SIGN_IN"
    schema={signInSchema}
    defaultValues={{
        email: '',
        password: '',
    }}
    onSubmit={signInWithCredentials}    // we are jsut passing the dunction to the AutForm component
    />

}


export default Page;