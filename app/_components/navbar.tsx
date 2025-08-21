/* eslint-disable @next/next/no-img-element */
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetTrigger } from "./ui/sheet";
import SideBarSheet from "./sidebar-sheet";
import Link from "next/link";

const Navbar = () => {
  return (
    <Card className="w-full rounded-none bg-background">
      <CardContent className="flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="logo.png" alt="logo app" />
        </Link>
        <Sheet>
          <SheetTrigger>
            <Button size="icon" variant="ghost" className="rounded-full">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SideBarSheet />
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Navbar;
