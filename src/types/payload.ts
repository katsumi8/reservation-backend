import {
  Prisma,
  Reservation,
  PrismaPromise,
  Table,
  User,
} from "@prisma/client";

type UserError = {
  message: string;
};

export type ReservationPayload = {
  userErrors: UserError[];
  reservation:
    | Reservation
    | Prisma.Prisma__ReservationClient<Reservation>
    | null;
};

export type TablePayload = {
  userErrors: UserError[];
  table: Table | Prisma.Prisma__TableClient<Table> | null;
};

export type TableRsvrvtnStatusPayload = {
  userErrors: UserError[];
  table: Table[] | PrismaPromise<Table[]> | null;
};

export type UserPayload = {
  userErrors: UserError[];
  user: User | Prisma.Prisma__UserClient<User> | null;
};
