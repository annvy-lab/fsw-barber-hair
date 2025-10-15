import { format, isFuture, isToday, isTomorrow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Prisma } from "@prisma/client";
import Link from "next/link";
// import CopyBookIDButton from "./copy-book-id";

interface BookProps {
  booking: Prisma.BookingGetPayload<{
    include: { service: { include: { barbershop: true } } };
  }>;
  isSingle?: boolean;
}

// TODO: redirect user from homepage if not logged in

const BookItem = ({ booking, isSingle = false }: BookProps) => {
  const isConfirmed = isFuture(booking.date);

  return (
    <Card className={`p-0 ${isSingle ? "min-w-full" : "min-w-[85%]"}`}>
      <CardContent className="flex flex-row items-center justify-between p-0">
        {/* LEFT */}
        <div className="flex flex-col gap-1 w-full p-4">
          <div className="full flex gap-2 items-center justify-between">
            <h3 className="font-semibold text-xl line-clamp-1">
              {booking.service.name}
            </h3>
            <Badge
              className="w-fit rounded-full ml-[-0.1rem] mb-1"
              variant={isConfirmed ? "default" : "secondary"}
            >
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
          </div>
          <Link
            href={`/barbershops/${booking.service.barbershopId}`}
            className="w-fit flex flex-row items-center gap-2 text-sm text-foreground/90 mt-1"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={booking.service.barbershop.imageUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="line-clamp-1 mt-1">
              {booking.service.barbershop.name}
            </p>
          </Link>
          <div className="flex items-baseline gap-1 mt-2 justify-between">
            <p className="line-clamp-1 text-[0.65rem] text-foreground/35">
              {format(booking.date, "dd/MM/yyyy", { locale: ptBR })} •{" "}
              {booking.id}
            </p>
            {/* <CopyBookIDButton id={booking.id} /> */}
          </div>
        </div>
        {/* RIGHT */}
        {isToday(booking.date) ? (
          <div className="h-full min-w-24 max-w-min-w-24 flex flex-col border-l-2 justify-between items-center p-2">
            <p className="text-xl font-medium text-primary">Hoje</p>
            <p className="text-base">
              {format(booking.date, "EEE", { locale: ptBR })}
            </p>
            <p className="text-lg">{format(booking.date, "HH:mm")}</p>
          </div>
        ) : isTomorrow(booking.date) ? (
          <div className="h-full min-w-24 max-w-min-w-24 flex flex-col border-l-2 justify-between items-center p-2">
            <p className="text-sm">
              {format(booking.date, "EEE", { locale: ptBR })}
            </p>
            <p className="text-base font-medium text-primary">Amanhã</p>
            <p className="text-lg">{format(booking.date, "HH:mm")}</p>
          </div>
        ) : (
          <div className="h-full min-w-24 max-w-min-w-24 flex flex-col border-l-2 justify-between items-center p-2">
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
  );
};

export default BookItem;
