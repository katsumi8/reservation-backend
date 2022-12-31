"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Query = void 0;
exports.Query = {
    seatmap: (_, __, { prisma }) => {
        return prisma.table.findMany({
            where: { tableName: { not: "Dummy" } },
            orderBy: { tableName: "asc" },
        });
    },
    reservTable: (_, __, { prisma }) => {
        return prisma.reservation.findMany();
    },
    reservationReadWithDate: (_, { reservedDate }, { prisma }) => {
        return prisma.reservation.findMany({ where: { date: reservedDate } });
    },
    userRead: (_, __, { prisma }) => {
        return prisma.user.findMany();
    },
};
