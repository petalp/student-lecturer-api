"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const config_1 = require("./config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const client_1 = require("../generated/prisma/client");
const pool = new pg_1.Pool({
    connectionString: config_1.config.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
exports.prisma = new client_1.PrismaClient({
    adapter,
    log: config_1.config.nodeEnv === "development" ? ["info", "query", "warn"] : ["error"],
}).$extends({
    result: {
        user: {
            fullName: {
                needs: { firstName: true, lastName: true },
                compute(user) {
                    return `${user.firstName} ${user.lastName}`;
                },
            },
        },
    },
});
