import { Request, Response } from "express";
import { properties, residents } from "../db/schema/user";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import _ from "lodash";
import { createToken } from "../utils";
import { createInsertSchema } from "drizzle-zod";
import { ZodError } from "zod";

type NewUser = typeof residents.$inferInsert

const insertUerSchema = createInsertSchema(residents, {
    username: (schema) => schema.username.min(3, { message: "Username must be more than 3 characters" }),
    email: (schema) => schema.email.email({ message: "Enter a valid email" }),
    password: (schema) => schema.password.min(6, { message: "Password should be more than 6 characters" })
})

export const signup = async (req: Request, res: Response) => {
    const body: NewUser = req.body

    const property = await db.query.properties.findFirst({
        where: eq(properties.id, body.propertyId as any)
    })
    if (!property) {
        return res.status(400).json({
            success: false,
            message: "Property ID is invalid"
        })
    }
    try {
        const check = insertUerSchema.parse(body)
        if (check) {
            const alreadyExists = await db.query.residents.findFirst({
                where: ((residents, { eq, or }) => or(eq(residents.username, body.username), eq(residents.email, body.email)))
            })

            if (alreadyExists) {
                return res.status(400).json({
                    success: false,
                    message: "Email or username already exists."
                })
            }

            if (body) {
                const hashP = await Bun.password.hash(body.password);
                if (hashP) {
                    try {
                        const signedup = await db.insert(residents).values({
                            ...body,
                            password: hashP
                        });
                        if (signedup) {
                            return res.json({
                                success: true,
                                message: "User created successfully"
                            })
                        }

                    } catch (err) {
                        console.log(err)
                        return res.json({
                            err
                        })
                    }
                }
            }
        }
    } catch (err) {
        if (err instanceof ZodError) {
            return res.json({
                success: false,
                message: err.issues[0].message
            })
        }
    }



}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (email && password) {
        try {

            // const user = await db.select().from(residents).where(eq(residents.email, email))
            // const foundUser = _.first(user)
            const foundUser = await db.query.residents.findFirst({
                where: eq(residents.email, email)
            })
            if (foundUser) {
                const verifyHash = await Bun.password.verify(password, foundUser?.password)
                if (verifyHash) {
                    const refreshedUser = _.omit(foundUser, ['password', 'createdAt'])
                    const token = await createToken(refreshedUser)
                    return res.status(200).json({
                        success: true,
                        message: "You have successfully logged in",
                        token: token
                    })
                } else {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid credentials"
                    })
                }
            } else {
                return res.status(401).json({
                    success: false,
                    message: "User does not exist"
                })
            }



        } catch (err) {

        }
    } else {
        return res.json({
            success: false,
            message: "You need to provide email and password"
        })
    }
}

export const deleteuser = async (req: Request, res: Response) => {
    const { username } = req.body
    if (username) {
        try {

            const deleted = await db.delete(residents).where(eq(residents.username, username))
            if (deleted) {
                return res.json({
                    success: true,
                    message: "user deleted"
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}
