// who booked and which table
// which table booked resolver
import { ReservationParentType } from "types/parentArgs";
import { Context } from "../../index";

export const Reservation = {
  table: ({ tableId }: ReservationParentType, __: any, { prisma }: Context) => {
    return prisma.table.findUnique({
      where: {
        id: tableId,
      },
    });
  },

  reservedBy: (
    { reservedById }: ReservationParentType,
    __: any,
    { prisma }: Context
  ) => {
    return prisma.user.findUnique({ where: { id: reservedById } });
  },
};
