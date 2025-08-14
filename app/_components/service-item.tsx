import { BarbershopService } from "@prisma/client";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";
import { ClockFading } from "lucide-react";

interface ServiceItemProps {
  service: BarbershopService;
}
const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <Card className="p-0">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="relative max-w-28 max-h-w-28 min-w-28 min-h-w-28">
          <Image
            src={service.imageUrl || "/placeholder.svg"}
            alt={service.name}
            width={110}
            height={110}
            className="object-cover rounded-lg"
          ></Image>
        </div>
        <div className="w-full flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold line-clamp-1">
              {service.name}
            </h2>
            <p className="text-sm line-clamp-2 text-secondary-foreground/80">
              {service.description}
            </p>
          </div>
          <div className="w-full flex items-baseline justify-between mt-2">
            <h3 className="text-xl text-primary font-semibold items-baseline">
              <span className="text-xs">R$ </span>
              {service.price.toString()}
            </h3>
            <Button variant="secondary" className="text-xs rounded-full">
              <ClockFading className="text-primary" />
              Agendar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;
