"use server";

import { db } from "../_lib/prisma";
import { endOfDay, startOfDay } from "date-fns";

interface GetBookingsProps {
  serviceID: string;
  date: Date;
}

const GetBookings = ({ date }: GetBookingsProps) => {
  return db.booking.findMany({
    where: {
      date: {
        lte: endOfDay(date),
        gte: startOfDay(date),
      },
    },
  });
};

export default GetBookings;
