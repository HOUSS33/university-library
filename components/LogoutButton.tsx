'use client';

import React from "react";
import { Button } from "./ui/button";
import { logoutAction } from "@/lib/actions/auth";
import { useFormStatus } from "react-dom";

function LogoutButtonInner() {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending}>
      {pending ? 'Logging out...' : 'Logout'}
    </Button>
  );
}

const LogoutButton = () => {
  return (
    <form action={logoutAction}>
      <LogoutButtonInner />
    </form>
  );
};

export default LogoutButton;
