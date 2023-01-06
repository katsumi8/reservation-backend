import { ApolloServer } from "apollo-server";
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { typeDefs } from "./schema";
import { PrismaClient, Prisma } from "@prisma/client";
import { Query, Mutation, Table, Reservation, User } from "./resolvers"; // リゾルバ関係のファイル

// DBにアクセスするためのライブラリ
export const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
}

const resolvers = { Query, Table, Reservation, User, Mutation };

const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  plugins: [
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
  // cache: "bounded",
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      // userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen()
