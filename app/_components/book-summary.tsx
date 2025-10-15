"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type BookingSummaryProps = {
  service: { name: string; price: any };
  barbershop: { name: string; address: string };
  selectedDay: Date;
  selectedTime: string;
  userName?: string | null;
  className?: string;
};

export default function BookingSummary({
  service,
  barbershop,
  selectedDay,
  selectedTime,
  userName,
  className,
}: BookingSummaryProps) {
  const priceBRL = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(service.price));

  return (
    <Card className={className ?? "my-2"}>
      <CardContent className="p-4 flex flex-col gap-1">
        <div className="flex items-start justify-between gap-1">
          <h2 className="text-lg font-semibold line-clamp-3">{service.name}</h2>
          <h3 className="text-xl text-primary font-semibold">{priceBRL}</h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Data</p>
          <h2 className="text-base">
            {format(selectedDay, "d MMMM yyyy", { locale: ptBR })}
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Horário</p>
          <h2 className="text-base">{selectedTime}</h2>
        </div>

        <div className="flex items-start justify-between">
          <p className="text-sm text-gray-400">Barbearia</p>
          <h2 className="text-base line-clamp-2">{barbershop.name}</h2>
        </div>

        <div className="flex items-start gap-2 justify-between">
          <p className="text-sm text-gray-400">Endereço</p>
          <h2 className="text-md line-clamp-1">{barbershop.address}</h2>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">Reservado por</p>
          <h2 className="text-lg text-primary line-clamp-1">
            {userName ?? ""}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
}
