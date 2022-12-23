import { Context } from "../../index";
import type { ReservationPayload } from "../../types/payload";
import type { ReservationAndUserArgs } from "../../types/args";
import { Table } from "@prisma/client";

export const reservationResolvers = {
  rsrvtnCreate: async (
    _: any,
    { reservation }: ReservationAndUserArgs,
    { prisma }: Context
  ): Promise<ReservationPayload> => {
    const { tableId, description, PplNo, time, userInput } = reservation;
    const { date, timeSlot } = time;
    const { name, email, phoneNo } = userInput;
    console.log(tableId)
    const dummyTable: Table[] = [];
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!tableId) {
      const findDummyTable = await prisma.table.findMany({
        where: { tableName: "Dummy" },
      });
      if (!findDummyTable) {
        const createDummyTable = await prisma.table.create({
          data: {
            tableName: "Dummy",
            capability: "0",
            position: "none",
          },
        });
        dummyTable.push(createDummyTable);
      } else {
        dummyTable.push(findDummyTable[0]);
      }

      if (!findUser) {
        const createdUser = await prisma.user.create({
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
      } else {
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
    } else {
      // table id exists but find User doesn't
      if (!findUser) {
        const createdUser = await prisma.user.create({
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
      } else {
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
  },
};
