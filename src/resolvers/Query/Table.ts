import { TableParentType } from "types/parentArgs";
import { Context } from "../../index";

export const Table = {
  reservations: ({ id }: TableParentType, __: any, { prisma }: Context) => {
    return prisma.reservation.findMany({
      where: {
        tableId: id,
      },
    });
  },
};
