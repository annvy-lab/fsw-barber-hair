"use client";

import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import Image from "next/image";

const DialogLogin = () => {
  const handleLoginGoogleClick = () => signIn("google");

  return (
    <DialogContent className="w-fit rounded-lg p-8">
      <DialogHeader className="space-y-2 whitespace-nowrap">
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>Conecte-se usando sua conta Google</DialogDescription>
      </DialogHeader>

      <Button onClick={handleLoginGoogleClick} variant="outline" className="font-bold gap-2">
        <div className="relative w-4 h-4">
          <Image src="/google-logo.svg" alt="Fazer login com Google" fill className="object-cover" />
        </div>
        Google
      </Button>
    </DialogContent>
  );
};

export default DialogLogin;
