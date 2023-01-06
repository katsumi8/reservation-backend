"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const apollo_server_1 = require("apollo-server");
const apollo_server_core_1 = require("apollo-server-core");
const schema_1 = require("./schema");
const client_1 = require("@prisma/client");
const resolvers_1 = require("./resolvers"); // リゾルバ関係のファイル
// DBにアクセスするためのライブラリ
exports.prisma = new client_1.PrismaClient();
const resolvers = { Query: resolvers_1.Query, Table: resolvers_1.Table, Reservation: resolvers_1.Reservation, User: resolvers_1.User, Mutation: resolvers_1.Mutation };
const server = new apollo_server_1.ApolloServer({
    typeDefs: schema_1.typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    plugins: [
        process.env.NODE_ENV === "production"
            ? (0, apollo_server_core_1.ApolloServerPluginLandingPageProductionDefault)({ footer: false })
            : (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ footer: false }),
    ],
    // cache: "bounded",
    context: ({ req }) => {
        return Object.assign(Object.assign({}, req), { prisma: exports.prisma });
    },
});
server.listen().then(({ url }) => {
    console.log(`${url}でサーバーを起動中・・・`);
});
