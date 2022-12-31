"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutation = void 0;
const table_1 = require("./table");
const reservation_1 = require("./reservation");
const user_1 = require("./user");
exports.Mutation = Object.assign(Object.assign(Object.assign({}, table_1.tableResolvers), reservation_1.reservationResolvers), user_1.userResolvers);
