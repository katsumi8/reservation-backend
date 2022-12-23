import { TableArgs, TimeArgs } from "types/args";
import { Context } from "../../index";
import type {
  TablePayload,
  TableRsvrvtnStatusPayload,
} from "../../types/payload";

export const tableResolvers = {
  tableCreate: async (
    _: any,
    { table }: TableArgs,
    { prisma }: Context
  ): Promise<TablePayload> => {
    const {
      tableName,
      capability,
      isReserved,
      position,
      isRounded,
      isUnReserved,
    } = table;

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

    if (typeof isReserved === "undefined") delete payloadToCreate.isReserved;
    if (typeof isRounded === "undefined") delete payloadToCreate.isRounded;
    if (typeof isUnReserved === "undefined")
      delete payloadToCreate.isUnReserved;

    const newTable = await prisma.table.create({
      data: {
        ...payloadToCreate,
      },
    });

    return { userErrors: [], table: newTable };
  },

  tableReservationStatusUpdate: async (
    _: any,
    { time }: TimeArgs,
    { prisma }: Context
  ): Promise<TableRsvrvtnStatusPayload> => {
    const { date, timeSlot } = time;

    if (date && timeSlot) {
      // theres no date or timeSlot
      const targetDateTableList = await prisma.reservation.findMany({
        where: {
          date,
        },
      });

      if (!targetDateTableList) {
        // すべて、falseにアップデートする

        await prisma.table.updateMany({
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
      const filteredReservation = targetDateTableList.filter(
        (reservation) =>
          Number(reservation.timeSlot.replace(":", "")) - 300 >=
            comparableInputTime ===
            false &&
          Number(reservation.timeSlot.replace(":", "")) + 300 <=
            comparableInputTime ===
            false
      );

      const reservedTableId = filteredReservation.map(
        (reservation) => reservation.tableId
      );

      await prisma.table.updateMany({
        data: { isReserved: false },
        where: { id: { notIn: reservedTableId } },
      });

      await prisma.table.updateMany({
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
  },

  tableUpdate: async (
    _: any,
    { id, table }: TableArgs,
    { prisma }: Context
  ): Promise<TablePayload> => {
    const {
      tableName,
      capability,
      isReserved,
      position,
      isRounded,
      isUnReserved,
    } = table;

    let payloadToUpdate = {
      tableName,
      capability,
      isReserved,
      position,
      isRounded,
      isUnReserved,
    };

    if (!tableName) delete payloadToUpdate.tableName;
    if (!capability) delete payloadToUpdate.capability;
    if (!position) delete payloadToUpdate.position;
    if (typeof isReserved === "undefined") delete payloadToUpdate.isReserved;
    if (typeof isRounded === "undefined") delete payloadToUpdate.isRounded;
    if (typeof isUnReserved === "undefined")
      delete payloadToUpdate.isUnReserved;

    console.log(payloadToUpdate.isRounded);

    if (
      !payloadToUpdate.tableName &&
      !payloadToUpdate.capability &&
      !payloadToUpdate.position &&
      !payloadToUpdate.isReserved &&
      !payloadToUpdate.isRounded &&
      !payloadToUpdate.isUnReserved
    ) {
      return {
        userErrors: [
          {
            message: "Need to have at least one field",
          },
        ],
        table: null,
      };
    }

    const foundTable = await prisma.table.findUnique({
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

    const updatedTable = await prisma.table.update({
      data: { ...payloadToUpdate },
      where: { id: Number(id) },
    });

    if (id) {
      const foundReservation = await prisma.reservation.findMany({
        where: { tableId: foundTable.id },
      });

      if (foundReservation) {
        await prisma.reservation.updateMany({
          data: { tableId: foundTable.id },
          where: { tableId: foundTable.id },
        });
      }
    }

    return {
      userErrors: [],
      table: updatedTable,
    };
  },

  tableDelete: async (
    _: any,
    { id }: TableArgs,
    { prisma }: Context
  ): Promise<TablePayload> => {
    const foundTable = await prisma.table.findUnique({
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

    const foundReservations = await prisma.reservation.findMany({
      where: { tableId: foundTable.id },
    });

    const dummyTable = await prisma.table.findMany({
      where: { tableName: "Dummy" },
    });

    if (!dummyTable) {
      await prisma.table.create({
        data: {
          tableName: "Dummy",
          capability: "0",
          position: "none",
        },
      });
    }

    if (dummyTable.length === 1) {
      if (foundReservations) {
        await prisma.reservation.updateMany({
          data: { tableId: dummyTable[0].id },
          where: { tableId: foundTable.id },
        });
      } else
        return {
          userErrors: [
            {
              message: "Too many Dummy tables, please delete them",
            },
          ],
          table: null,
        };
    }
    await prisma.table.delete({
      where: { id: Number(id) },
    });

    return {
      userErrors: [],
      table: foundTable,
    };
  },
};
