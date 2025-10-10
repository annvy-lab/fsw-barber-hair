/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import authOptions from "../_lib/auth";

interface CreateBookingParams {
  serviceId: string;
  date: Date;
}

export const CreateBooking = async (params: CreateBookingParams) => {
  const user = await getServerSession(authOptions);
  if (!user) {
    throw new Error("Usuário não autenticado!");
  }
  await db.booking.create({
    data: { ...params, userId: (user as any).user.id },
  });
  revalidatePath("/barbershops/[id]");
};
