import { SearchX } from "lucide-react";
import BarbershopItem from "../_components/barbershop-item";
import SearchBar from "../_components/search";
import { db } from "../_lib/prisma";
import Navbar from "@/app/_components/navbar";
import EmptyState from "../_components/empty-state";

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const barbershops = await db.barbershop.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams?.search,
            mode: "insensitive",
          },
        },
        {
          services: {
            some: {
              name: {
                contains: searchParams?.search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          address: {
            contains: searchParams?.search,
            mode: "insensitive",
          },
        },
      ],
    },
  });
  return (
    <div>
      <Navbar />
      {/* SEARCH BAR */}
      <div className="py-4">
        <SearchBar />
      </div>

      {/* SEARCH RESULTS */}
      <div id="barbershops" className="px-6 py-2 flex flex-col">
        <h2 className="mb-2 text-xs font-bold uppercase text-gray-400">
          Resultados para &quot;{searchParams.search}&quot;
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {barbershops.length === 0 && (
            <div className="col-span-2 gap-2 py-12 flex flex-col justify-center items-center">
              <EmptyState
                icon={SearchX}
                title="Nenhum resultado encontrado..."
                description="Tente outra busca!"
              />
            </div>
          )}
          {barbershops.map((barbershop) => (
            <BarbershopItem key={barbershop.id} barbershop={barbershop} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarbershopsPage;
