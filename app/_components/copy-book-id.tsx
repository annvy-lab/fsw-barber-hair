"use client";

import { Button } from "@/app/_components/ui/button";
import { Clipboard } from "lucide-react";
import toast from "react-hot-toast";

export default function CopyBookIDButton({ id }: { id: string }) {
  const handleCopyID = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID copiado para a área de transferência");
    } catch {
      toast("Não foi possível copiar o id.");
    }
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      className="text-xs p-2 w-fit"
      onClick={handleCopyID}
      aria-label="Copiar ID do agendamento"
    >
      <Clipboard size={6} className="mr-0" />
    </Button>
  );
}
