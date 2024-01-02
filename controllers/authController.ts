import { Request, Response } from "express";
import { properties, residents } from "../db/schema/user";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import _ from "lodash";
import { createToken } from "../utils";

type NewUser = typeof residents.$inferInsert

export const signup = async (req: Request, res: Response) => {
    const body: NewUser = req.body

    // const property = await db.select().from(properties).where(eq(properties.id, body.propertyId))
    const property = await db.query.properties.findFirst({
        where: eq(properties.id, body.propertyId)
    })
    if (!property) {
        return res.status(400).json({
            success: false,
            message: "Property ID is invalid"
        })
    }

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

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (email && password) {
        try {

            const user = await db.select().from(residents).where(eq(residents.email, email))
            const foundUser = _.first(user)
            if (foundUser) {
                // const hashP = await Bun.password.hash(password)
                const verifyHash = await Bun.password.verify(password, foundUser?.password)
                console.log(verifyHash)

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
