"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationResolvers = void 0;
exports.reservationResolvers = {
    rsrvtnCreate: (_, { reservation }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const { tableId, description, PplNo, time, userInput } = reservation;
        const { date, timeSlot } = time;
        const { name, email, phoneNo } = userInput;
        console.log(tableId);
        const dummyTable = [];
        const findUser = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!tableId) {
            const findDummyTable = yield prisma.table.findMany({
                where: { tableName: "Dummy" },
            });
            if (!findDummyTable) {
                const createDummyTable = yield prisma.table.create({
                    data: {
                        tableName: "Dummy",
                        capability: "0",
                        position: "none",
                    },
                });
                dummyTable.push(createDummyTable);
            }
            else {
                dummyTable.push(findDummyTable[0]);
            }
            if (!findUser) {
                const createdUser = yield prisma.user.create({
                    data: {
                        name,
                        email,
                        phoneNo,
                    },
                });
                return {
                    userErrors: [],
                    reservation: prisma.reservation.create({
                        data: {
                            date,
                            timeSlot,
                            description,
                            PplNo,
                            tableId: dummyTable[0].id,
                            reservedById: createdUser.id,
                        },
                    }),
                };
            }
            else {
                return {
                    userErrors: [],
                    reservation: prisma.reservation.create({
                        data: {
                            date,
                            timeSlot,
                            description,
                            PplNo,
                            tableId: dummyTable[0].id,
                            reservedById: findUser.id,
                        },
                    }),
                };
            }
        }
        else {
            // table id exists but find User doesn't
            if (!findUser) {
                const createdUser = yield prisma.user.create({
                    data: {
                        name,
                        email,
                        phoneNo,
                    },
                });
                return {
                    userErrors: [],
                    reservation: prisma.reservation.create({
                        data: {
                            date,
                            timeSlot,
                            description,
                            PplNo,
                            tableId,
                            reservedById: createdUser.id,
                        },
                    }),
                };
            }
            else {
                // table id and user already exists
                return {
                    userErrors: [],
                    reservation: prisma.reservation.create({
                        data: {
                            date,
                            timeSlot,
                            description,
                            PplNo,
                            tableId,
                            reservedById: findUser.id,
                        },
                    }),
                };
            }
        }
    }),
};
