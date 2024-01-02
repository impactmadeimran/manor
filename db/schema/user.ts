import { relations } from 'drizzle-orm';
import { pgTable, uuid, timestamp, text, pgEnum, integer } from 'drizzle-orm/pg-core';

export const userType = pgEnum('userType', ["admin", "checkpoint", "resident"])

export const residencies = pgTable('residencies', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    location: text('location').notNull(),
    numberOfProperties: integer('numberOfProperties').notNull(),
})

export const residents = pgTable('residents', {
    id: uuid('id').defaultRandom().primaryKey(),
    username: text('username').unique().notNull(),
    password: text('password').notNull(),
    firstName: text('firstName').notNull(),
    lastName: text('lastName').notNull(),
    email: text('email').notNull().unique(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    userType: userType('userType').notNull(),
    propertyId: uuid('propertyId').notNull(),
}
);

export const userRelations = relations(residents, ({ one }) => ({
    property: one(properties, {
        fields: [residents.propertyId],
        references: [properties.id]
    }),

}))

export const properties = pgTable('properties', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name'),
    number: text('number').notNull().unique(),
    rooms: integer('rooms').notNull(),
    residencyId: uuid('residencyId').notNull()

})

export const residencyRelations = relations(residencies, ({ many }) => ({
    property: many(properties)
}))

export const propertiesRelations = relations(properties, ({ many, one }) => ({
    resident: many(residents),
    residency: one(residencies, {
        fields: [properties.residencyId],
        references: [residencies.id]
    })
}))