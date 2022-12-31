import { ApolloServer } from "apollo-server";
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
  cache: "bounded",
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      // userId: req && req.headers.authorization ? getUserId(req) : null,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`${url}でサーバーを起動中・・・`);
});
