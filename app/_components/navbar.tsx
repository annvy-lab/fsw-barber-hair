import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Navbar = () => {
    return ( 
        <Card className="w-full rounded-none bg-background">
            <CardContent className="flex justify-between items-center px-6 py-4">
                <img src="logo.png" alt="logo app" />
                <Button size="icon" variant="ghost"><MenuIcon/></Button>
            </CardContent>
        </Card>
     );
}
 
export default Navbar;