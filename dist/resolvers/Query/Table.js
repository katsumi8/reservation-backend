"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
exports.Table = {
    reservations: ({ id }, __, { prisma }) => {
        return prisma.reservation.findMany({
            where: {
                tableId: id,
            },
        });
    },
};
