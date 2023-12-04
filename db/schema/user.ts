import { pgTable, uuid, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';

export const userType = pgEnum('userType', ["admin", "checkpoint", "resident"])

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').unique().notNull(),
    password: text('password').notNull(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userType: userType('userType').notNull(),

}
);

// export const authOtps = mysqlTable('auth_otp', {
//   id: bigint('id', { mode: 'number' }).primaryKey().autoincrement(),
//   phone: varchar('phone', { length: 256 }),
//   userId: int('user_id').references(() => users.id),
// });