import { UserParentType } from "types/parentArgs";
import { Context } from "../../index";

export const User = {
  reservations: ({ id }: UserParentType, __: any, { prisma }: Context) => {
    return prisma.reservation.findMany({
      where: { reservedById: id },
    });
  },
};
