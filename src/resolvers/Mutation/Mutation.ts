import { tableResolvers } from "./table";
import { reservationResolvers } from "./reservation";
import { userResolvers } from "./user";

export const Mutation = {
  ...tableResolvers,
  ...reservationResolvers,
  ...userResolvers,
};
