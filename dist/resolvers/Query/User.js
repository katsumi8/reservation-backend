"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.User = {
    reservations: ({ id }, __, { prisma }) => {
        return prisma.reservation.findMany({
            where: { reservedById: id },
        });
    },
};
