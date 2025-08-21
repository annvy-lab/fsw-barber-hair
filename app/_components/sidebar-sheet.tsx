import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { House, CalendarDays, LogOut, LogIn } from "lucide-react";
import quickSearchOptions from "../_constants/quickSearchOptions";
import { Button } from "./ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "./ui/sheet";
import Link from "next/link";

const SideBarSheet = () => {
  return (
    <SheetContent>
      <SheetHeader className="w-full items-center justify-start text-start">
        <SheetTitle className="self-start mt-[-0.7rem]">Menu</SheetTitle>
        {/* USER NOT LOGGED IN */}
                <div className="w-full flex flex-col items-center gap-4 mb-4 border-b border-solid py-4 pt-2">
          <div className="w-full flex items-start flex-col justify-start text-start">
            <h3 className="text-md font-bold line-clamp-1">Olá, realize login</h3>
            <p className="mt-[-0.1rem] text-sm text-foreground/70 line-clamp-2 font-normal">
              para aproveitar todos os recursos do app! 
            </p>
          </div>
          <div className="w-full flex items-center justify-center">
            <Button  className="w-full">
                <LogIn/>
                LogIn
            </Button>
          </div>
        </div>

        {/* USER LOGGED IN */}
        {/* <div className="w-full flex items-center gap-4 mb-4 border-b border-solid py-4 pt-2">
          <Avatar className="h-10 w-10 border-solid border-primary border-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>Lila</AvatarFallback>
          </Avatar>
          <div className="w-full flex items-start flex-col justify-start text-start">
            <h3 className="text-md font-bold line-clamp-1">Lila Baka</h3>
            <p className="mt-[-0.1rem] text-xs text-foreground/70 line-clamp-1 font-normal">
              emaildalila@gmail.com
            </p>
          </div>
        </div> */}
      </SheetHeader>

      <div className="w-full flex flex-col justify-start gap-2 border-b border-solid py-4">
        <SheetClose asChild>
          <Button asChild variant={"secondary"} className="w-full justify-start font-light">
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
          <Button
            key={title}
            variant="ghost"
            className="w-full justify-start font-light"
            type="button"
          >
            <Icon className="h-4 w-4 mr-2" />
            {title}
          </Button>
        ))}
      </div>

      <SheetFooter className="w-full flex flex-col justify-start gap-4 py-4">
        <Button
          variant="ghost"
          className="w-full justify-start font-light"
          type="button"
        >
          <LogOut className="h-4 w-4 mr-2 text-primary" />
          logout
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default SideBarSheet;
