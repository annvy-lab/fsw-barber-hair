"use client";

import { useEffect, useRef } from "react";
import {
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogHeader,
} from "./ui/dialog";
import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { Confetti, type ConfettiRef } from "./ui/confetti";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type BookingMessageProps = {
  service: { name: string; price: any };
  barbershop: { name: string; address: string; phone?: string };
  selectedDay: Date;
  selectedTime: string;
  userName?: string | null;
  className?: string;
};

const CreateBookingDialog = ({
  service,
  barbershop,
  selectedDay,
  selectedTime,
  userName,
}: BookingMessageProps) => {
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    confettiRef.current?.fire({});
  }, []);

  const toBRL = (v: any) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
      Number(v)
    );

  const sanitizePhone = (n?: string) => {
    if (!n) return null;
    const digits = n.replace(/\D/g, "");
    if (digits.startsWith("55")) return digits;
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits || null;
  };

  const buildWhatsAppUrl = () => {
    const when =
      `${format(selectedDay, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}` +
      ` às ${selectedTime}`;

    const lines = [
      "🗓️ *Novo agendamento*",
      "",
      `👤 Cliente: ${userName || "Cliente"}`,
      `✂️ Serviço: ${service.name}`,
      `💰 Valor: ${toBRL(service.price)}`,
      `📅 Data/Horário: ${when}`,
      "",
      `🏢 Estabelecimento: ${barbershop.name}`,
      `📍 Endereço: ${barbershop.address}`,
      "",
      "Por favor, confirme o recebimento. Obrigado!",
    ];

    const text = encodeURIComponent(lines.join("\n"));
    const phone = sanitizePhone(barbershop.phone);

    return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  const handleSendWhatsApp = () => {
    const url = buildWhatsAppUrl();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <DialogContent className="w-[60%] rounded-lg px-6 py-8 flex flex-col items-center justify-center">
      <Confetti ref={confettiRef} className="absolute top-0 left-0 z-0 size-full" />

      <DialogHeader className="space-y-2">
        <DialogTitle>Agendamento Efetuado!</DialogTitle>
        <DialogDescription>
          Obrigado! Confira os detalhes na sua área de agendamentos.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center justify-center p-2 mb-4 mt-2 rounded-full bg-primary">
        <Check size={60} strokeWidth={1.8} className="text-foreground" />
      </div>

      <DialogDescription className="text-center">
        Agilize o processo enviando os detalhes do agendamento para o
        estabelecimento.
      </DialogDescription>

      <DialogClose asChild>
        <Button
          onClick={handleSendWhatsApp}
          aria-label="enviar no whatsapp"
          className="w-full bg-emerald-500 cursor-pointer"
        >
          Enviar no WhatsApp
        </Button>
      </DialogClose>
    </DialogContent>
  );
};

export default CreateBookingDialog;
