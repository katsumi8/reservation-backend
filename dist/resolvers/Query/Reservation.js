"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reservation = void 0;
exports.Reservation = {
    table: ({ tableId }, __, { prisma }) => {
        return prisma.table.findUnique({
            where: {
                id: tableId,
            },
        });
    },
    reservedBy: ({ reservedById }, __, { prisma }) => {
        return prisma.user.findUnique({ where: { id: reservedById } });
    },
};
