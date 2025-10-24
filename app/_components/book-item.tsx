/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { format, isFuture, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import BookingSummary from "./book-summary";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DeleteBooking } from "../_actions/delete-booking";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";
// import CopyBookIDButton from "./copy-book-id";

interface BookProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } };
  }>;
  userName: any;
  isSingle?: boolean;
}

const BookItem = ({ booking, isSingle = false, userName }: BookProps) => {
  const isConfirmed = isFuture(booking.date);
  const handleDeleteBooking = () => {
    if (!isConfirmed) {
      toast.error("Esse agendamento já foi finalizado!");
      return;
    } else {
      try {
        DeleteBooking(booking.id);
        toast.success("Agendamento cancelado com sucesso!");
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cancelar o agendamento. Tente novamente.");
      }
    }
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card
          className={`p-0 ${
            isSingle ? "min-w-full" : "min-w-[85%]"
          } cursor-pointer rounded-xl`}
        >
          <CardContent className="flex flex-row items-center justify-between p-0">
            {/* LEFT */}
            <div className="flex flex-col gap-1 w-[76%] min-w-[76%] max-w-[76%] p-4">
              <div className="full flex gap-2 items-center justify-between mb-1">
                <Badge
                  className="w-fit rounded-full"
                  variant={isConfirmed ? "default" : "secondary"}
                >
                  {isConfirmed ? "Confirmado" : "Finalizado"}
                </Badge>
                <Badge
                  className="w-fit rounded-full gap-1 pr-1"
                  variant="outline"
                >
                  Ver mais <ChevronRight size={15} />
                </Badge>
              </div>
              <h3 className="font-semibold text-xl line-clamp-1 break-words whitespace-break-spaces text-ellipsis">
                {booking.service.name}
              </h3>
              <div className="w-fit flex flex-row items-center gap-2 text-sm text-foreground/90">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={booking.service.barbershop.imageUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="line-clamp-1 mt-1">
                  {booking.service.barbershop.name}
                </p>
              </div>
            </div>
            {/* RIGHT */}
            {isToday(booking.date) ? (
              <div className="h-full w-[24%] min-w-[24%] max-w-[24%] flex flex-col border-l-2 justify-center items-center">
                <p className="text-xl font-medium text-primary">Hoje</p>
                <p className="text-base">
                  {format(booking.date, "EEE", { locale: ptBR })}
                </p>
                <p className="text-lg">{format(booking.date, "HH:mm")}</p>
              </div>
            ) : isTomorrow(booking.date) ? (
              <div className="h-full w-[24%] min-w-[24%] max-w-[24%] flex flex-col border-l-2 justify-center items-center">
                <p className="text-base font-medium text-primary">Amanhã</p>
                <p className="text-base">
                  {format(booking.date, "EEE", { locale: ptBR })}
                </p>
                <p className="text-lg">{format(booking.date, "HH:mm")}</p>
              </div>
            ) : (
              <div className="h-full w-[24%] min-w-[24%] max-w-[24%] flex flex-col border-l-2 justify-center items-center">
                <p className="text-2xl font-medium">
                  {format(booking.date, "dd", { locale: ptBR })}
                </p>
                <p className="text-base">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <p className="text-base">{format(booking.date, "HH:mm")}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </SheetTrigger>
      <SheetContent className="w-[85%] min-h-svh flex flex-col justify-between">
        <div className="flex flex-col p-0">
          <SheetHeader>
            <SheetTitle className="self-start mb-3 text-start">
              Detalhes do Agendamento
              <br />
              <p className="line-clamp-1 text-[0.70rem] -mt-1 text-foreground/35">
                {booking.id}
              </p>
            </SheetTitle>
          </SheetHeader>
          <div className="relative w-full min-h-44 max-w-prose rounded-xl overflow-hidden">
            <Image
              src="/barbershop-adress-card.png"
              alt={booking.service.barbershop.name}
              fill
              className="object-cover object-center"
              priority
            />
            <Link
              href={`/barbershops/${booking.service.barbershopId}`}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-card w-64 max-w-72 flex flex-row items-center gap-2 p-2 px-4 rounded-xl text-sm text-foreground/90 justify-start shadow-md"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={booking.service.barbershop.imageUrl} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0 items-start justify-center">
                <p className="line-clamp-2 text-base">
                  {booking.service.barbershop.name}
                </p>
                <p className="line-clamp-3 text-sm text-foreground/50">
                  {booking.service.barbershop.address}
                </p>
              </div>
            </Link>
          </div>

          <Badge
            className="w-fit rounded-full ml-[-0.1rem] mb-2 mt-4"
            variant={isConfirmed ? "default" : "secondary"}
          >
            {isConfirmed ? "Confirmado" : "Finalizado"}
          </Badge>
          <BookingSummary
            service={{
              name: booking.service.name,
              price: booking.service.price,
            }}
            barbershop={{
              name: booking.service.barbershop.name,
              address: booking.service.barbershop.address,
            }}
            selectedDay={new Date(booking.date)}
            selectedTime={format(booking.date, "HH:mm")}
            userName={userName}
          />
        </div>
        {isConfirmed && (
          <SheetFooter className="flex flex-row items-center gap-2 justify-center">
            <SheetClose asChild>
              <Button variant="secondary" className="w-2/5">
                Voltar
              </Button>
            </SheetClose>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-3/5">
                  Cancelar Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[90%] rounded-lg p-8">
                <DialogHeader className="space-y-2">
                  <DialogTitle>Cancelar Agendamento</DialogTitle>
                  <DialogDescription>
                    Você tem certeza que irá fazer o cancelamento do agendamento
                    abaixo? Isso é uma ação irreversível!
                  </DialogDescription>
                </DialogHeader>
                <BookingSummary
                  service={{
                    name: booking.service.name,
                    price: booking.service.price,
                  }}
                  barbershop={{
                    name: booking.service.barbershop.name,
                    address: booking.service.barbershop.address,
                  }}
                  selectedDay={new Date(booking.date)}
                  selectedTime={format(booking.date, "HH:mm")}
                  userName={userName}
                />
                <p className="line-clamp-1 text-[0.70rem] -mt-2 text-foreground/35">
                  {booking.id}
                </p>
                <div className="w-full flex justify-end gap-2 mt-1">
                  <DialogClose className="w-3/6">
                    <Button variant="outline" className="font-bold w-full">
                      Voltar
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={handleDeleteBooking}
                    variant="destructive"
                    className="font-bold w-3/6"
                    aria-label="Confirmar Cancelamento do Agendamento"
                  >
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default BookItem;
