/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Barbershop, BarbershopService, Booking } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { Clock, Check, ClockAlert } from "lucide-react";
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
import { startOfToday, format, set } from "date-fns";
import { useSession } from "next-auth/react";
import { CreateBooking } from "../_actions/create-booking";
import toast from "react-hot-toast";
import GetBookings from "../_actions/get-bookings";
import DialogLogin from "./dialog-login";
import EmptyState from "./empty-state";
import BookingSummary from "./book-summary";

interface ServiceItemProps {
  service: BarbershopService;
  barbershop: Pick<Barbershop, "name" | "address">;
}

const TIME_LIST = [
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
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const getTimeList = (bookings: Booking[], day?: Date) =>
  TIME_LIST.filter((time) => {
    const [h, m] = time.split(":");
    const hour = Number(h);
    const minute = Number(m);
    const taken = bookings.some((booking) => {
      const d =
        booking.date instanceof Date
          ? booking.date
          : new Date(booking.date as unknown as string);
      return d.getHours() === hour && d.getMinutes() === minute;
    });
    if (taken) return false;
    if (!day) return true;
    const candidate = set(day, {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    });
    return candidate.getTime() > Date.now();
  });

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession();
  const isLoggedIn = Boolean((data?.user as any)?.id);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined
  );
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);
  const [openSheet, setOpenSheet] = useState(false);

  const resetBookingState = (clearDay = false) => {
    if (clearDay) setSelectedDay(undefined);
    setSelectedTime(undefined);
    setDayBookings([]);
  };

  const availableTimes = useMemo(
    () => getTimeList(dayBookings, selectedDay),
    [dayBookings, selectedDay]
  );

  useEffect(() => {
    const loadBookings = async () => {
      if (!selectedDay) {
        setDayBookings([]);
        return;
      }
      const bookings = await GetBookings({
        serviceID: service.id,
        date: selectedDay,
      });
      setDayBookings(bookings);
    };
    loadBookings();
  }, [selectedDay, service.id]);

  useEffect(() => {
    if (selectedTime && !availableTimes.includes(selectedTime)) {
      setSelectedTime(undefined);
    }
  }, [availableTimes, selectedTime]);

  const handleDaySelect = (date: Date | undefined) => {
    setSelectedDay(date);
    setSelectedTime(undefined);
    setDayBookings([]);
  };

  const handleTimeSelect = (time: string | undefined) => setSelectedTime(time);

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime || !(data?.user as any)?.id) return;
      const [h, m] = selectedTime.split(":");
      const date = set(selectedDay, { hours: Number(h), minutes: Number(m) });
      await CreateBooking({
        serviceId: service.id,
        date,
      });
      toast.success("Agendamento criado com sucesso!");
      setOpenSheet(false);
      resetBookingState(true);
    } catch {
      toast.error("Não foi possível agendar. Tente novamente");
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  const onWheelHorizontal = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  const canShowSummary =
    !!selectedDay &&
    !!selectedTime &&
    availableTimes.length > 0 &&
    availableTimes.includes(selectedTime);

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

            {isLoggedIn ? (
              <Sheet
                open={openSheet}
                onOpenChange={(open) => {
                  setOpenSheet(open);
                  if (open) {
                    setSelectedDay(startOfToday());
                    setSelectedTime(undefined);
                    setDayBookings([]);
                  } else {
                    resetBookingState(true);
                  }
                }}
              >
                <SheetTrigger asChild>
                  <Button variant="secondary" className="text-xs rounded-full">
                    <Clock className="text-primary h-4 w-4" />
                    Agendar
                  </Button>
                </SheetTrigger>

                <SheetContent className="w-[85%] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-8">
                  <SheetHeader>
                    <SheetTitle className="text-primary">
                      Agendamento
                    </SheetTitle>
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
                      defaultMonth={startOfToday()}
                      disabled={{ before: startOfToday() }}
                    />
                  </div>

                  <div
                    ref={scrollRef}
                    onWheel={onWheelHorizontal}
                    className="w-full border-t border-b py-5 mb-7 flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x [&::-webkit-scrollbar]:hidden"
                    style={{ WebkitOverflowScrolling: "touch" }}
                  >
                    {availableTimes.length === 0 ? (
                      <div className="flex flex-col w-full items-center self-center">
                        <EmptyState
                          icon={ClockAlert}
                          title="Sem horários disponíveis"
                          description="Por favor, tente outro dia do calendário!"
                        />
                      </div>
                    ) : (
                      availableTimes.map((time) => (
                        <Button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          variant={
                            selectedTime === time ? "default" : "secondary"
                          }
                          className="rounded-full shrink-0"
                        >
                          {time}
                        </Button>
                      ))
                    )}
                  </div>

                  {canShowSummary && (
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
                              {format(selectedDay as Date, "d 'de' MMMM", {
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

                            {/* Booking Summary */}
                            <BookingSummary
                              service={{
                                name: service.name,
                                price: service.price,
                              }}
                              barbershop={{
                                name: barbershop.name,
                                address: barbershop.address,
                              }}
                              selectedDay={selectedDay as Date}
                              selectedTime={selectedTime}
                              userName={data?.user?.name}
                            />

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
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="text-xs rounded-full">
                    <Clock className="text-primary h-4 w-4" />
                    Agendar
                  </Button>
                </DialogTrigger>
                <DialogLogin />
              </Dialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
