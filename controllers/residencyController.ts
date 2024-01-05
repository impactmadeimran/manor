import { Request, Response } from "express"
import { db } from "../db/db"
import { residencies } from "../db/schema/user"
import { eq } from "drizzle-orm"
import { createToken, generateRandomAlphanumeric, resend } from "../utils"
import _ from "lodash"

type NewResidency = typeof residencies.$inferInsert

export const createResidency = async (req: Request, res: Response) => {
    const data: NewResidency = req.body

    if (!data.email) {
        return res.json({
            success: false,
            message: "Email is required"
        })
    }

    const existingResidence = await db.query.residencies.findFirst({
        where: ((residencies, { eq }) => eq(residencies.name, data.name))
    })

    if (existingResidence) {
        return res.status(400).json({
            success: false,
            message: "Residence with this name already exists."
        })
    }

    if (data) {
        const addedResidence = await db.insert(residencies).values(data)
        if (addedResidence) {
            return res.status(200).json({
                success: true,
                message: "Residency added successfully"
            })
        } else {
            return res.status(400).json({
                success: false
            })
        }
    }
}

export const residencyLogin = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        const exists = await db.query.residencies.findFirst({
            where: eq(residencies.email, email)
        })
        if (exists) {
            const code = generateRandomAlphanumeric(6)
            if (code) {
                await db.update(residencies).set({ verifycode: code }).where(eq(residencies.email, email))
                const { error } = await resend.emails.send({
                    from: "Manor <admin@ningendo.xyz>",
                    to: [email],
                    subject: 'Verification code',
                    html: `<strong>${code}</strong>`
                })
                if (error) {
                    return res.status(400).json({ error });
                }

                res.status(200).json({
                    success: true,
                    message: "Check your email for a verification code."
                });
            }
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "Email does not exist"
        })
    }


}

export const verifyResidencyCode = async (req: Request, res: Response) => {
    const { email, code } = req.body;
    try {
        const exists = await db.query.residencies.findFirst({
            where: eq(residencies.email, email)
        })

        if (exists) {
            const codeValid = exists.verifycode === code;
            if (codeValid) {
                const refreshedUser = _.omit(exists, ['verifycode'])
                const token = await createToken(refreshedUser)
                await db.update(residencies).set({ verifycode: "" }).where(eq(residencies.email, email))
                return res.status(200).json({
                    success: true,
                    message: "You have successfully logged in",
                    token: token
                })
            } else {
                res.status(400).json({
                    success: false,
                    message: "Invalid code entered"
                })
            }
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: "User does not exist"
        })
    }
}