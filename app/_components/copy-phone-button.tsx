"use client";

import { Button } from "@/app/_components/ui/button";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyPhoneButton({ phone }: { phone: string }) {
  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(phone);
      toast.success("Copiado para a área de transferência");
    } catch {
      toast("Não foi possível copiar o número.");
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="text-xs"
      onClick={handleCopyPhone}
    >
      <Copy size={12} className="mr-1" /> Copiar
    </Button>
  );
}
