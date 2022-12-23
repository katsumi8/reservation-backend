import { Context } from "index";

export const Query = {
  seatmap: (_: any, __: any, { prisma }: Context) => {
    return prisma.table.findMany({
      where: { tableName: { not: "Dummy" } },
      orderBy: { tableName: "asc" },
    });
  },

  reservTable: (_: any, __: any, { prisma }: Context) => {
    return prisma.reservation.findMany();
  },

  reservationReadWithDate: (
    _: any,
    { reservedDate }: { reservedDate: string },
    { prisma }: Context
  ) => {
    return prisma.reservation.findMany({ where: { date: reservedDate } });
  },

  userRead: (_: any, __: any, { prisma }: Context) => {
    return prisma.user.findMany();
  },
};
