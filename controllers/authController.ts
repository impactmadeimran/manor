import { Request, Response } from "express";
import { users } from "../db/schema/user";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import _ from "lodash";
import { createToken } from "../utils";

type NewUser = typeof users.$inferInsert

export const signup = async (req: Request, res: Response) => {
    const body: NewUser = req.body

    if (body) {
        const hashP = await Bun.password.hash(body.password);
        if (hashP) {
            try {
                const signedup = await db.insert(users).values({
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

            }
        }
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    if (email && password) {
        try {

            const user = await db.select().from(users).where(eq(users.email, email))
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

            const deleted = await db.delete(users).where(eq(users.username, username))
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
