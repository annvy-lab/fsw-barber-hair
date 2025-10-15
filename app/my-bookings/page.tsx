/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/app/_components/navbar";
import { db } from "@/app/_lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../_lib/auth";
import BookItem from "../_components/book-item";
import { CalendarSearch } from "lucide-react";
import EmptyState from "../_components/empty-state";
import { Dialog } from "@/app/_components/ui/dialog";
import DialogLogin from "../_components/dialog-login";

const MyBookings = async () => {
  const session = await getServerSession(authOptions);

  const [confirmedBookings, finishedBookings] = session?.user
    ? await Promise.all([
        db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: { gte: new Date() },
          },
          include: { service: { include: { barbershop: true } } },
          orderBy: { date: "asc" },
        }),
        db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: { lt: new Date() },
          },
          include: { service: { include: { barbershop: true } } },
          orderBy: { date: "desc" },
        }),
      ])
    : [[], []];

  return (
    <div>
      {/* HEADER */}
      <section id="header">
        <Navbar />
        <div className="px-6 mt-6">
          <h2 className="mb-2 text-xl font-bold text-foreground uppercase">
            Agendamentos
          </h2>
        </div>
      </section>

      {!session?.user && (
        <Dialog defaultOpen>
          <DialogLogin />
        </Dialog>
      )}

      {/* BODY */}
      {confirmedBookings.length === 0 && finishedBookings.length === 0 && (
        <div className="flex items-center mb-10 mt-10">
          <EmptyState
            icon={CalendarSearch}
            title="Nenhum agendamento encontrado..."
            description="Realize um novo para vê-lo aqui!"
          />
        </div>
      )}

      {/* BOOKINGS */}
      {confirmedBookings.length > 0 && (
        <div className="px-6 mt-6">
          <h2 className="mb-4 text-sm font-bold uppercase text-gray-400">
            Confirmados
          </h2>
          <div className="flex flex-col gap-4">
            {confirmedBookings.map((book) => (
              <BookItem
                key={book.id}
                booking={book}
                userName={session?.user?.name}
              />
            ))}
          </div>
        </div>
      )}

      {finishedBookings.length > 0 && (
        <div id="barbershops" className="px-6 flex flex-col mt-10 mb-10">
          <h2 className="mb-4 text-sm font-bold uppercase text-gray-400">
            Finalizados
          </h2>
          <div className="flex flex-col gap-4">
            {finishedBookings.map((book) => (
              <BookItem
                key={book.id}
                booking={book}
                userName={session?.user?.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
