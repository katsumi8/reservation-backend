// 顧客テーブルを作成するリゾルバ
import { Context } from "../..";
import type { UserPayload } from "../../types/payload";

interface UserArgs {
  id: number;
  user: {
    name?: string;
    email?: string;
    phoneNo?: string;
  };
}

export const userResolvers = {
  userCreate: async (
    _: any,
    { user }: UserArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { name, email, phoneNo } = user;
    if (!name || !email || !phoneNo) {
      return {
        userErrors: [
          {
            message: "You must provide name, email and phoneNumber",
          },
        ],
        user: null,
      };
    }

    const findCustomer = await prisma.user.findUnique({
      where: {
        email,
      },
    });


    if (!findCustomer) {
      return {
        userErrors: [],
        user: await prisma.user.create({
          data: {
            name,
            email,
            phoneNo,
          },
        }),
      };
    } else {
      return {
        userErrors: [{ message: " User already exists" }],
        user: null,
      };
    }
  },

  userUpdate: async (
    _: any,
    { id, user }: UserArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const { name, email, phoneNo } = user;

    if (!name && !email && !phoneNo) {
      return {
        userErrors: [
          {
            message: "Need to have at least one field",
          },
        ],
        user: null,
      };
    }

    const foundUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundUser) {
      return {
        userErrors: [
          {
            message: "User does not exist",
          },
        ],
        user: null,
      };
    }

    let payloadToUpdate = {
      name,
      email,
      phoneNo,
    };

    if (!name) delete payloadToUpdate.name;
    if (!email) delete payloadToUpdate.email;
    if (!phoneNo) delete payloadToUpdate.phoneNo;

    return {
      userErrors: [],
      user: prisma.user.update({
        data: { ...payloadToUpdate },
        where: { id: Number(id) },
      }),
    };
  },

  userDelete: async (
    _: any,
    { id }: { id: string },
    { prisma }: Context
  ): Promise<UserPayload> => {
    const foundUser = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!foundUser) {
      return {
        userErrors: [
          {
            message: "User does not exist",
          },
        ],
        user: null,
      };
    }

    await prisma.reservation.deleteMany({
      where: {
        reservedById: Number(id),
      },
    });

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return {
      userErrors: [],
      user: foundUser,
    };
  },
};
