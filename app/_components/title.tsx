"use client";

import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/skeleton";

const Title = () => {
  const { data, status } = useSession();

  const formatDate = () => {
    const s = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      timeZone: "America/Fortaleza",
    }).format(new Date());
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  if (status === "loading") {
    return (
      <div className="px-6 my-6" aria-busy="true">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-10" />
            <Skeleton className="h-7 w-40" />
          </div>
          <Skeleton className="h-5 w-52" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* USER NOT LOGGED IN */}
      {!data?.user && (
        <div className="px-6 my-6 gap-3">
          <h2 className="text-2xl">
            Olá, <span className="font-bold">Realize login</span>
          </h2>
          <p className="text-sm text-primary/70 line-clamp-2 font-normal mb-1">
            para aproveitar todos os recursos do app!
          </p>
          <p>{formatDate()}</p>
        </div>
      )}

      {/* USER LOGGED IN */}
      {data?.user && (
        <div className="px-6 my-6 gap-3">
          <h2 className="text-2xl">
            Olá, <span className="font-bold">{data.user.name}!</span>
          </h2>
          <p>{formatDate()}</p>
        </div>
      )}
    </div>
  );
};

export default Title;
