"use client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { House, CalendarDays, LogOut, LogIn } from "lucide-react";
import quickSearchOptions from "../_constants/quickSearchOptions";
import { Button } from "./ui/button";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "./ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

const SideBarSheet = () => {
  const { data } = useSession();

  const HandleLoginGoogleClick = () => signIn("google");

  const HandleSignOut = () => signOut();

  return (
    <SheetContent>
      <SheetHeader className="w-full items-center justify-start text-start">
        <SheetTitle className="self-start mt-[-0.7rem]">Menu</SheetTitle>
        {/* USER NOT LOGGED IN */}
        {!data?.user && (
          <div className="w-full flex flex-col items-center gap-4 mb-4 border-b border-solid py-4 pt-2">
            <div className="w-full flex items-start flex-col justify-start text-start">
              <h3 className="text-md font-bold line-clamp-1">
                Olá, Realize Login
              </h3>
              <p className="mt-[-0.1rem] text-sm text-foreground/70 line-clamp-2 font-normal">
                para aproveitar todos os recursos do app!
              </p>
            </div>
            <div className="w-full flex items-center justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <LogIn />
                    login
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-fit rounded-lg p-8">
                  <DialogHeader className="space-y-2 whitespace-nowrap">
                    <DialogTitle>Faça login na plataforma</DialogTitle>
                    <DialogDescription>
                      Conecte-se usando sua conta Google
                    </DialogDescription>
                  </DialogHeader>
                  <Button
                    onClick={HandleLoginGoogleClick}
                    variant="outline"
                    className="font-bold"
                  >
                    <div className="relative w-4 h-4">
                      <Image
                        src="/google-logo.svg"
                        alt="Fazer login com Google"
                        fill
                        className="object-cover"
                      />
                    </div>
                    Google
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}

        {/* USER LOGGED IN */}
        {data?.user && (
          <div className="w-full flex items-center gap-4 mb-4 border-b border-solid py-4 pt-2">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage
                src={data.user.image ?? "/avatar-placeholder.png"}
                alt={data.user.name ?? data.user.email ?? "Usuário"}
              />
              <AvatarFallback>
                {(
                  data.user.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("") ||
                  data.user.email?.[0] ||
                  "U"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="w-full flex flex-col">
              <h3 className="text-md font-bold line-clamp-1 text-primary">
                {data.user.name}
              </h3>
              <p className="mt-[-0.1rem] text-xs text-foreground/70 line-clamp-1">
                {data.user.email}
              </p>
            </div>
          </div>
        )}
      </SheetHeader>

      <div className="w-full flex flex-col justify-start gap-2 border-b border-solid py-4">
        <SheetClose asChild>
          <Button
            asChild
            variant={"secondary"}
            className="w-full justify-start font-light "
          >
            <Link href="/">
              <House className="h-4 w-4 mr-2" />
              início
            </Link>
          </Button>
        </SheetClose>

        <Button
          variant="ghost"
          className="w-full justify-start font-light"
          type="button"
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          agendamentos
        </Button>
      </div>

      <div className="w-full flex flex-col justify-start gap-2 border-b border-solid py-4">
        {quickSearchOptions.map(({ icon: Icon, title }) => (
          <SheetClose key={title} asChild>
            <Button
              variant="ghost"
              className="w-full justify-start font-light"
              asChild
            >
              <Link
                href={{
                  pathname: "/barbershops",
                  query: { search: title },
                }}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4 mr-2" />
                {title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {data?.user && (
        <SheetFooter className="w-full flex flex-col justify-start gap-4 py-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start font-light"
                type="button"
              >
                <LogOut className="h-4 w-4 mr-2 text-primary" />
                logout
              </Button>
            </DialogTrigger>
            <DialogContent className="w-fit rounded-lg p-8">
              <DialogHeader className="space-y-2 whitespace-nowrap">
                <DialogTitle>Sair</DialogTitle>
                <DialogDescription>
                  Você tem certeza que deseja sair da sua conta?
                </DialogDescription>
              </DialogHeader>
              <div className="w-full flex justify-end gap-2 mt-1">
                <DialogClose className="w-3/6">
                  <Button variant="outline" className="font-bold w-full">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  onClick={HandleSignOut}
                  variant="destructive"
                  className="font-bold w-3/6"
                  aria-label="Sair"
                >
                  Sair
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </SheetFooter>
      )}
    </SheetContent>
  );
};

export default SideBarSheet;
