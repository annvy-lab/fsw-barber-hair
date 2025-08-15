import Navbar from "@/app/_components/navbar";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";
import { db } from "@/app/_lib/prisma";
import BarbershopItem from "./_components/barbershop-item";
import { Badge } from "@/app/_components/ui/badge";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/_components/ui/avatar";
import Footer from "./_components/footer";
import quickSearchOptions from "./_constants/quickSearchOptions";

const Home = async () => {
  const barbershops = await db.barbershop.findMany();

  const popularBarbershops = await db.barbershop.findMany({
    orderBy: { name: "desc" },
  });

  return (
    <div>
      {/* HEADER */}
      <section id="header">
        <Navbar />

        <div className="px-6 my-6 gap-3">
          <h2 className="text-2xl">
            Olá, <span className="font-bold">Usuário!</span>
          </h2>
          <p>Sábado, 09 de agosto</p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center gap-2 px-6 mt-4">
          <Input placeholder="Buscar..." aria-label="Buscar" />
          <Button size="icon" className="w-10" aria-label="Pesquisar">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* QUICK SEARCH */}
        <div className="px-6 flex flex-col mt-2">
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {quickSearchOptions.map(({ icon: Icon, title }) => (
              <Button
                variant="secondary"
                key={title}
                className="flex items-center gap-2"
              >
                <Icon size={10} />
                {title}
              </Button>
            ))}
          </div>
        </div>

        {/* BANNER */}
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

      {/* BODY */}
      <section>
        {/* BOOKING*/}
        <div className="px-6 mt-6">
          <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
            Agendamentos
          </h2>
          <Card className="p-0">
            <CardContent className="flex flex-row items-center justify-between px-4 py-3">
              {/* LEFT */}
              <div className="flex flex-col gap-2 w-full">
                <Badge className="w-fit bg-primary/20 text-primary rounded-full">
                  Concluído
                </Badge>
                <h3 className="font-semibold">Corte de Cabelo</h3>
                <div className="flex flex-row items-center gap-2 mt-1 text-xs">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p>Barbearia XY</p>
                </div>
              </div>
              {/* RIGHT */}
              <div className="flex flex-col border-l-2 justify-between items-center pl-4 pr-1 py-0 full">
                <p className="text-xs">Agosto</p>
                <p className="text-xl font-medium">09</p>
                <p className="text-sm">15:00</p>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* BARBERSHOPS */}
        <div id="barbershops" className="px-6 flex flex-col mt-6">
          <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
            Recomendados
          </h2>
          <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <BarbershopItem key={barbershop.id} barbershop={barbershop} />
            ))}
          </div>
        </div>
        {/* POPULARS */}
        <div className="px-6 flex flex-col mt-6">
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
