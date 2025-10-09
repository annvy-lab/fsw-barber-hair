"use server"

import { db } from "../_lib/prisma"

interface CreateBookingParams{
userId: string,
serviceId: string,
date: Date,
}

export const CreateBooking = async (params: CreateBookingParams) => {
    await db.booking.create({
        data: params
    })
}