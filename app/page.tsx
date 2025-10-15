/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/app/_components/navbar";
import { Button } from "@/app/_components/ui/button";
import Image from "next/image";
import { db } from "@/app/_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import quickSearchOptions from "./_constants/quickSearchOptions";
import SearchBar from "./_components/search";
import Title from "./_components/title";
import Link from "next/link";
import BookItem from "./_components/book-item";
import { getServerSession } from "next-auth";
import authOptions from "./_lib/auth";

const Home = async () => {
  const session = await getServerSession(authOptions);

  const [barbershops, popularBarbershops, bookings] = await Promise.all([
    db.barbershop.findMany(),
    db.barbershop.findMany({ orderBy: { name: "desc" } }),
    session
      ? db.booking.findMany({
          where: {
            userId: (session.user as any).id,
            date: { gte: new Date() },
          },
          include: { service: { include: { barbershop: true } } },
          orderBy: { date: "asc" },
        })
      : Promise.resolve([] as any[]),
  ]);

  return (
    <div>
      <section id="header">
        <Navbar />
        <Title />
        <SearchBar />

        <div className="px-6 flex flex-col mt-2">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {quickSearchOptions.map(({ icon: Icon, title }) => (
              <Button
                variant="secondary"
                key={title}
                className="flex items-center gap-2"
              >
                <Link
                  href={{ pathname: "/barbershops", query: { search: title } }}
                  className="flex items-center gap-1"
                >
                  <Icon size={10} className="h-4 w-4 mr-2" />
                  {title}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="px-6 mt-6">
          <div className="relative mt-4 h-[150px] w-full">
            <Image
              alt="Agende nos melhores com FSW Barber"
              src="/banner01.png"
              fill
              sizes="(max-width: 768px) 100vw, 1200px"
              className="rounded-xl object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section>
        {session && bookings.length > 0 && (
          <div className="px-6 mt-10">
            <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
              Meus Agendamentos
            </h2>
            <div className="items-center flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {bookings.map((book) => (
                <BookItem
                  key={book.id}
                  booking={book}
                  isSingle={bookings.length === 1}
                  userName={session?.user?.name}
                />
              ))}
            </div>
          </div>
        )}

        <div id="barbershops" className="px-6 flex flex-col mt-10">
          <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
            Recomendados
          </h2>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>

        <div className="px-6 flex flex-col mt-10 mb-10">
          <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
            Populares
          </h2>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {popularBarbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
