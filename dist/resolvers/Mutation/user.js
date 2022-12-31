"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userResolvers = void 0;
exports.userResolvers = {
    userCreate: (_, { user }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
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
        const findCustomer = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!findCustomer) {
            return {
                userErrors: [],
                user: yield prisma.user.create({
                    data: {
                        name,
                        email,
                        phoneNo,
                    },
                }),
            };
        }
        else {
            return {
                userErrors: [{ message: " User already exists" }],
                user: null,
            };
        }
    }),
    userUpdate: (_, { id, user }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
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
        const foundUser = yield prisma.user.findUnique({
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
        if (!name)
            delete payloadToUpdate.name;
        if (!email)
            delete payloadToUpdate.email;
        if (!phoneNo)
            delete payloadToUpdate.phoneNo;
        return {
            userErrors: [],
            user: prisma.user.update({
                data: Object.assign({}, payloadToUpdate),
                where: { id: Number(id) },
            }),
        };
    }),
    userDelete: (_, { id }, { prisma }) => __awaiter(void 0, void 0, void 0, function* () {
        const foundUser = yield prisma.user.findUnique({
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
        yield prisma.reservation.deleteMany({
            where: {
                reservedById: Number(id),
            },
        });
        yield prisma.user.delete({
            where: {
                id: Number(id),
            },
        });
        return {
            userErrors: [],
            user: foundUser,
        };
    }),
};
