import { db } from "@/app/_lib/prisma";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import Link from "next/link";
import {
  ChevronLeft,
  MenuIcon,
  MapPin,
  Star,
  Smartphone,
  Wrench,
} from "lucide-react";
import ServiceItem from "@/app/_components/service-item";
import CopyPhoneButton from "@/app/_components/copy-phone-button";
import SideBarSheet from "@/app/_components/sidebar-sheet";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import EmptyState from "@/app/_components/empty-state";

// TODO: add social media links to barbershop

interface BarbershopPageProps {
  params: { id: string };
}

const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const barbershop = await db.barbershop.findUnique({
    where: { id: params.id },
    include: { services: true },
  });

  if (!barbershop) {
    return (
      <section className="relative">
        {/* Banner */}
        <div className="relative w-full h-64">
          <Image
            src="/placeholder.svg"
            alt="barbershop not found"
            fill
            className="object-cover"
            priority
          />
          <Button
            size="icon"
            variant="outline"
            asChild
            className="absolute top-6 left-6 rounded-full"
          >
            <Link href={"/#barbershops"}>
              <ChevronLeft />
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="absolute top-6 right-6 rounded-full"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SideBarSheet />
          </Sheet>
        </div>

        {/* Card principal */}
        <div className="-mt-6 relative z-10">
          <div className="w-full bg-background text-card-foreground rounded-t-3xl overflow-hidden">
            <div className="flex flex-col gap-2 p-6 py-16">
              <EmptyState
                icon={Wrench}
                title="Estabelecimento não encontrado..."
                description="Retorne à página inicial e confira nossos estabelecimentos!"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative">
      {/* Banner */}
      <div className="relative w-full h-64">
        <Image
          src={barbershop.imageUrl}
          alt={`banner ${barbershop.name}`}
          fill
          className="object-cover"
          priority
        />
        <Button
          size="icon"
          variant="outline"
          asChild
          className="absolute top-6 left-6 rounded-full"
        >
          <Link href={"/#barbershops"}>
            <ChevronLeft />
          </Link>
        </Button>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="absolute top-6 right-6 rounded-full"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SideBarSheet />
        </Sheet>
      </div>

      {/* Card principal */}
      <div className="-mt-6 relative z-10">
        <div className="w-full bg-background text-card-foreground rounded-t-3xl overflow-hidden">
          {/* Título */}
          <div className="flex flex-col gap-2 p-6 border-b border-border">
            <h1 className="text-2xl font-bold line-clamp-1">
              {barbershop.name}
            </h1>
            <h2 className="flex items-center text-sm gap-2">
              <MapPin size={18} className="text-primary" /> {barbershop.address}
            </h2>
            <h2 className="flex items-center text-sm gap-2">
              <Star size={18} className="fill-primary text-primary" /> 5,0 (568
              avaliações)
            </h2>
          </div>

          {/* Sobre nós */}
          <div className="flex flex-col gap-1 p-6 border-b border-border">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-400">
              Sobre nós
            </h2>
            <p className="text-sm font-light line-clamp-5">
              {barbershop.description}
            </p>
          </div>

          {/* Serviços */}
          <div className="flex flex-col gap-2 p-6 border-b border-border">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-400">
              Serviços
            </h2>
            <div className="flex flex-col gap-4">
              {barbershop.services.map((service) => (
                <ServiceItem
                  key={service.id}
                  service={JSON.parse(JSON.stringify(service))}
                  barbershop={JSON.parse(JSON.stringify(barbershop))}
                />
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="flex flex-col gap-2 p-6 pb-14">
            <h2 className="mb-2 text-sm font-bold uppercase text-gray-400">
              Contato
            </h2>
            <div className="flex flex-col gap-3">
              {barbershop.phones.map((phone, index) => (
                <div
                  key={phone ?? index}
                  className="flex items-center justify-between gap-2"
                >
                  <p className="flex items-center gap-2 text-sm">
                    <Smartphone size={18} className="text-primary" /> {phone}
                  </p>
                  <CopyPhoneButton phone={phone} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BarbershopPage;
