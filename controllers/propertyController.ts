import { Request, Response } from "express";
import { properties, residencies } from "../db/schema/user";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { ZodError } from "zod";

const insertpropertiesSchema = createInsertSchema(properties, {
    name: (schema) => schema.name.min(3, { message: "Name should be 3 or more characters" }),
});

type NewProperty = typeof properties.$inferInsert

export const createProperties = async (req: Request, res: Response) => {
    const data: NewProperty = req.body;

    const residency = await db.query.residencies.findFirst({
        where: eq(residencies.id, data?.residencyId)
    })

    if (!residency) return res.status(400).json({
        success: false,
        message: "Residency ID is invalid"
    })

    // const exitstingProperty = await db.query.properties.findFirst({
    //     where:((properties,{or,eq}) => eq(properties.name,data.name)
    // })

    try {
        const check = insertpropertiesSchema.parse(data)
        if (check) {
            const insertedproperties = await db.insert(properties).values(data)
            if (insertedproperties) {
                return res.status(200).json({
                    success: true,
                    message: "properties created successfully"
                })
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Issue creating properties"
                })
            }
        }
    } catch (err) {
        // console.log("err", err)
        if (err instanceof ZodError) {
            return res.json({
                success: false,
                message: err.issues[0].message
            })
        }
    }
}

