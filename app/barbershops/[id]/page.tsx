import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import { ChevronLeft, MenuIcon, MapPin, Star } from "lucide-react";

interface BarbershopPageProps {
  params: { id: string };
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
  });

  if (!barbershop) {
    return (
      <section>
        <div className="relative w-full h-64">
          <Image
            src="/placeholder.svg"
            alt="Banner Genérico"
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            asChild
            className="absolute top-6 left-6"
          >
            <Link href={"/"}>
              <ChevronLeft />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-6 right-6"
          >
            <MenuIcon />
          </Button>
        </div>
        <div className="flex flex-col gap-2 p-6 border-b border-solid">
          <h1 className="text-2xl line-clamp-1 font-bold">
            Estabelecimento Indisponível
          </h1>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section>
        <div className="relative w-full h-64">
          <Image
            src={barbershop.imageUrl}
            alt={`banner ${barbershop.name}`}
            fill
            className="object-cover"
          />
          <Button
            size="icon"
            variant="secondary"
            asChild
            className="absolute top-6 left-6"
          >
            <Link href={"/"}>
              <ChevronLeft />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-6 right-6"
          >
            <MenuIcon />
          </Button>
        </div>
        {/* TITLE */}
        <div className="flex flex-col gap-2 p-6 border-b border-solid">
          <h1 className="text-2xl line-clamp-1 font-bold">{barbershop.name}</h1>
          <h2 className="flex items-center text-sm gap-2">
            <MapPin size={18} className="text-primary" />{" "}
            {barbershop.address}
          </h2>
          <h2 className="flex items-center text-sm gap-2">
            <Star size={18} className="fill-primary text-primary" /> 5,0 (568
            avaliações)
          </h2>
        </div>
        {/* DESCRIPTION */}
        <div className="flex flex-col gap-2 p-6 border-b border-solid">
          <h2 className="mb-2 text-sm font-bold uppercase text-gray-400">
            Sobre nós
          </h2>
          <p className="text-sm line-clamp-5 font-light">
            {barbershop.description}
          </p>
        </div>
      </section>
      <section>
        {/* SERVICES */}
        <div className="flex flex-col gap-2 p-6 border-b border-solid">
          <h2 className="mb-2 text-sm font-bold uppercase text-gray-400">
            Serviços
          </h2>
          <div className="flex flex-col gap-4">

          {/* {.map((barbershop) => (
              <ServiceItem key={barbershop.id} barbershop={barbershop} />
              ))} */}
              </div>
        </div>
      </section>
    </div>
  );
};

export default BarbershopPage;
