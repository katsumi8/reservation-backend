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
exports.tableResolvers = void 0;
exports.tableResolvers = {
    tableCreate: (_, { table }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const { tableName, capability, isReserved, position, isRounded, isUnReserved, } = table;
        if (!tableName || !capability || !position) {
            return {
                userErrors: [
                    {
                        message: "You must provide tableId, capability and position",
                    },
                ],
                table: null,
            };
        }
        let payloadToCreate = {
            tableName,
            capability,
            isReserved,
            position,
            isRounded,
            isUnReserved,
        };
        if (typeof isReserved === "undefined")
            delete payloadToCreate.isReserved;
        if (typeof isRounded === "undefined")
            delete payloadToCreate.isRounded;
        if (typeof isUnReserved === "undefined")
            delete payloadToCreate.isUnReserved;
        const newTable = yield prisma.table.create({
            data: Object.assign({}, payloadToCreate),
        });
        return { userErrors: [], table: newTable };
    }),
    tableReservationStatusUpdate: (_, { time }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const { date, timeSlot } = time;
        if (date && timeSlot) {
            // theres no date or timeSlot
            const targetDateTableList = yield prisma.reservation.findMany({
                where: {
                    date,
                },
            });
            if (!targetDateTableList) {
                // すべて、falseにアップデートする
                yield prisma.table.updateMany({
                    data: { isReserved: false },
                });
                return {
                    userErrors: [],
                    table: prisma.table.findMany(),
                };
            }
            // それぞれの予約時間帯と比較して、アップデートする対象を割り出す
            // 入力されたインプットの時間帯を比較可能にする
            const comparableInputTime = Number(timeSlot.replace(":", ""));
            // 比較可能な時間帯と、Reservationができないテーブルを洗い出す
            const filteredReservation = targetDateTableList.filter((reservation) => Number(reservation.timeSlot.replace(":", "")) - 300 >=
                comparableInputTime ===
                false &&
                Number(reservation.timeSlot.replace(":", "")) + 300 <=
                    comparableInputTime ===
                    false);
            const reservedTableId = filteredReservation.map((reservation) => reservation.tableId);
            yield prisma.table.updateMany({
                data: { isReserved: false },
                where: { id: { notIn: reservedTableId } },
            });
            yield prisma.table.updateMany({
                data: { isReserved: true },
                where: { id: { in: reservedTableId } },
            });
            return {
                userErrors: [],
                table: prisma.table.findMany(),
            };
        }
        return {
            userErrors: [
                {
                    message: "Please kindly provide your reservation date and timeslot",
                },
            ],
            table: null,
        };
    }),
    tableUpdate: (_, { id, table }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const { tableName, capability, isReserved, position, isRounded, isUnReserved, } = table;
        let payloadToUpdate = {
            tableName,
            capability,
            isReserved,
            position,
            isRounded,
            isUnReserved,
        };
        if (!tableName)
            delete payloadToUpdate.tableName;
        if (!capability)
            delete payloadToUpdate.capability;
        if (!position)
            delete payloadToUpdate.position;
        if (typeof isReserved === "undefined")
            delete payloadToUpdate.isReserved;
        if (typeof isRounded === "undefined")
            delete payloadToUpdate.isRounded;
        if (typeof isUnReserved === "undefined")
            delete payloadToUpdate.isUnReserved;
        console.log(payloadToUpdate.isRounded);
        if (!payloadToUpdate.tableName &&
            !payloadToUpdate.capability &&
            !payloadToUpdate.position &&
            !payloadToUpdate.isReserved &&
            !payloadToUpdate.isRounded &&
            !payloadToUpdate.isUnReserved) {
            return {
                userErrors: [
                    {
                        message: "Need to have at least one field",
                    },
                ],
                table: null,
            };
        }
        const foundTable = yield prisma.table.findUnique({
            where: { id: Number(id) },
        });
        if (!foundTable) {
            return {
                userErrors: [
                    {
                        message: "Table does not exist",
                    },
                ],
                table: null,
            };
        }
        const updatedTable = yield prisma.table.update({
            data: Object.assign({}, payloadToUpdate),
            where: { id: Number(id) },
        });
        if (id) {
            const foundReservation = yield prisma.reservation.findMany({
                where: { tableId: foundTable.id },
            });
            if (foundReservation) {
                yield prisma.reservation.updateMany({
                    data: { tableId: foundTable.id },
                    where: { tableId: foundTable.id },
                });
            }
        }
        return {
            userErrors: [],
            table: updatedTable,
        };
    }),
    tableDelete: (_, { id }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const foundTable = yield prisma.table.findUnique({
            where: { id: Number(id) },
        });
        if (!foundTable) {
            return {
                userErrors: [
                    {
                        message: "Table does not exist",
                    },
                ],
                table: null,
            };
        }
        const foundReservations = yield prisma.reservation.findMany({
            where: { tableId: foundTable.id },
        });
        const dummyTable = yield prisma.table.findMany({
            where: { tableName: "Dummy" },
        });
        if (!dummyTable) {
            yield prisma.table.create({
                data: {
                    tableName: "Dummy",
                    capability: "0",
                    position: "none",
                },
            });
        }
        if (dummyTable.length === 1) {
            if (foundReservations) {
                yield prisma.reservation.updateMany({
                    data: { tableId: dummyTable[0].id },
                    where: { tableId: foundTable.id },
                });
            }
            else
                return {
                    userErrors: [
                        {
                            message: "Too many Dummy tables, please delete them",
                        },
                    ],
                    table: null,
                };
        }
        yield prisma.table.delete({
            where: { id: Number(id) },
        });
        return {
            userErrors: [],
            table: foundTable,
        };
    }),
};
