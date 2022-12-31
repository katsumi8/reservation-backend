"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
// """
// // Graph schemaの定義 = データ構造を理解する
// """
const apollo_server_1 = require("apollo-server");
exports.typeDefs = (0, apollo_server_1.gql) `
  type Query {
    seatmap: [Table]!
    reservTable: [Reservation]
    userRead: [User]
    reservationReadWithDate(reservedDate: String!): [Reservation]
  }

  type Mutation {
    tableCreate(table: TableInput!): TablePayload!
    tableUpdate(id: ID!, table: TableInput): TablePayload!
    tableReservationStatusUpdate(time: TimeInput): TableRsvrvtnStatusPayload!
    tableDelete(id: ID!): TablePayload!
    rsrvtnCreate(reservation: ReservationInput!): ReservationPayload!
    userCreate(user: UserInput!): UserPayload!
    userUpdate(id: ID!, user: UserInput!): UserPayload!
    userDelete(id: ID!): UserPayload!
  }

  type Table {
    id: ID!
    tableName: String!
    capability: String!
    isReserved: Boolean
    position: String!
    isRounded: Boolean
    isUnReservable: Boolean
    reservations: [Reservation]
  }

  type Reservation {
    id: ID!
    PplNo: Int!
    date: String!
    timeSlot: String!
    description: String
    table: Table
    reservedBy: User
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phoneNo: String
    reservations: [Reservation]
    # favDrink: [Drink]
    # favFood: [Food]
    # show: Int
    # timesofreservation: Int
  }

  input TableInput {
    tableName: String
    capability: String
    isReserved: Boolean
    position: String
    isRounded: Boolean
    isUnReservable: Boolean
  }

  input ReservationInput {
    tableId: Int
    PplNo: Int!
    time: TimeInput!
    description: String!
    userInput: UserInput!
  }

  input TimeInput {
    date: String
    timeSlot: String
  }

  input UserInput {
    name: String
    email: String
    phoneNo: String
  }

  type UserError {
    message: String!
  }

  type TablePayload {
    userErrors: [UserError!]!
    table: Table
  }

  type TableRsvrvtnStatusPayload {
    userErrors: [UserError!]!
    table: [Table]
  }

  type ReservationPayload {
    userErrors: [UserError!]!
    reservation: Reservation
  }

  type ReservationManyPayload {
    userErrors: [UserError!]!
    reservations: [Reservation]
  }

  type UserPayload {
    userErrors: [UserError!]!
    user: User
  }
`;
