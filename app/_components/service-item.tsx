/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Barbershop, BarbershopService } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Clock, Check } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet";
import { Calendar } from "./ui/calendar";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import { format, set } from "date-fns";
import { useSession } from "next-auth/react";
import { CreateBooking } from "../_actions/create-booking";
import toast from "react-hot-toast";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name" | "address">;
}

const time_list = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
];

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession();

  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(
    undefined
  );
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    undefined
  );

  const handleDaySelect = (date: Date | undefined) => setSelectedDay(date);
  const handleTimeSelect = (time: string | undefined) => setSelectedTime(time);

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime || !(data?.user as any).id) return;

      const hour: number = Number(selectedTime.split(":")[0]);
      const minute: number = Number(selectedTime.split(":")[1]);

      const date = set(selectedDay, {
        hours: hour,
        minutes: minute,
      });

      await CreateBooking({
        serviceId: service.id,
        userId: (data?.user as any).id,
        date,
      });
      toast.success("Agendamento criado com sucesso!");
      setOpenSheet(false);
    } catch (error) {
      console.log(error);
      toast.error("Não foi possível agendar. Tente novamente");
    }
  };

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const onWheelHorizontal = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };
  const [openSheet, setOpenSheet] = React.useState(false);

  return (
    <Card className="p-0">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="relative w-28 h-28 shrink-0">
          <Image
            src={service.imageUrl || "/placeholder.svg"}
            alt={service.name}
            width={110}
            height={110}
            className="object-cover rounded-lg"
          />
        </div>

        <div className="w-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold line-clamp-1">
              {service.name}
            </h2>
            <p className="text-sm line-clamp-2 text-secondary-foreground/80">
              {service.description}
            </p>
          </div>

          <div className="w-full flex items-baseline justify-between mt-2">
            <h3 className="text-xl text-primary font-semibold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </h3>

            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
              <SheetTrigger asChild>
                <Button variant="secondary" className="text-xs rounded-full">
                  <Clock className="text-primary h-4 w-4" />
                  Agendar
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto [&::-webkit-scrollbar]:hidden pb-8">
                <SheetHeader>
                  <SheetTitle className="text-primary">Agendamento</SheetTitle>
                  <SheetDescription>
                    Selecione abaixo o dia e horário para prosseguir:
                  </SheetDescription>
                </SheetHeader>

                <div className="w-full">
                  <Calendar
                    mode="single"
                    locale={ptBR}
                    selected={selectedDay}
                    onSelect={handleDaySelect}
                  />
                </div>

                <div
                  ref={scrollRef}
                  onWheel={onWheelHorizontal}
                  className="w-full border-t border-b py-5 mb-7 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x [&::-webkit-scrollbar]:hidden"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {time_list.map((time) => (
                    <Button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      variant={selectedTime === time ? "default" : "secondary"}
                      className="rounded-full shrink-0"
                    >
                      {time}
                    </Button>
                  ))}
                </div>

                {selectedDay && selectedTime && (
                  <div>
                    <h2 className="mb-4 text-sm font-bold uppercase text-gray-400">
                      Resumo
                    </h2>
                    <Card>
                      <CardContent className="p-4 flex flex-col gap-1">
                        <div className="flex items-start justify-between">
                          <h2 className="text-lg font-semibold line-clamp-2">
                            {service.name}
                          </h2>
                          <h3 className="text-xl text-primary font-semibold">
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(Number(service.price))}
                          </h3>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Data</p>
                          <h2 className="text-base">
                            {format(selectedDay, "d 'de' MMMM", {
                              locale: ptBR,
                            })}
                          </h2>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-400">Horário</p>
                          <h2 className="text-base">{selectedTime}</h2>
                        </div>
                        <div className="flex items-start justify-between">
                          <p className="text-sm text-gray-400">Barbearia</p>
                          <h2 className="text-base line-clamp-2">
                            {barbershop.name}
                          </h2>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center gap-2 mt-16">
                      <SheetClose asChild>
                        <Button variant="outline" className="w-4/12">
                          Cancelar
                        </Button>
                      </SheetClose>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-8/12">
                            <Clock /> Continuar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-fit rounded-lg p-8">
                          <DialogHeader className="space-y-2 whitespace-nowrap">
                            <DialogTitle>Resumo Agendamento</DialogTitle>
                            <DialogDescription>
                              Você tem certeza que deseja confirmar esse
                              agendamento?
                            </DialogDescription>
                          </DialogHeader>
                          <Card className="my-2">
                            <CardContent className="p-4 flex flex-col gap-1">
                              <div className="flex items-start justify-between">
                                <h2 className="text-lg font-semibold line-clamp-2">
                                  {service.name}
                                </h2>
                                <h3 className="text-xl text-primary font-semibold">
                                  {Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(Number(service.price))}
                                </h3>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400">Data</p>
                                <h2 className="text-base">
                                  {format(selectedDay, "d 'de' MMMM", {
                                    locale: ptBR,
                                  })}
                                </h2>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400">Horário</p>
                                <h2 className="text-base">{selectedTime}</h2>
                              </div>
                              <div className="flex items-start justify-between">
                                <p className="text-sm text-gray-400">
                                  Barbearia
                                </p>
                                <h2 className="text-base line-clamp-2">
                                  {barbershop.name}
                                </h2>
                              </div>
                              <div className="flex items-start gap-2 justify-between">
                                <p className="text-sm text-gray-400">
                                  Endereço
                                </p>
                                <h2 className="text-md line-clamp-1">
                                  {barbershop.address}
                                </h2>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-400">
                                  Reservado por
                                </p>
                                <h2 className="text-lg text-primary line-clamp-1">
                                  {data?.user?.name}
                                </h2>
                              </div>
                            </CardContent>
                          </Card>

                          <div className="w-full flex justify-end gap-2 mt-1">
                            <DialogClose className="w-3/6">
                              <Button
                                variant="outline"
                                className="font-bold w-full"
                              >
                                Cancelar
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={handleCreateBooking}
                                className="font-bold w-3/6"
                                aria-label="confirmar reserva"
                              >
                                <Check /> Confirmar
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
