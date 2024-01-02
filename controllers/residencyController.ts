import { Request, Response } from "express"
import { db } from "../db/db"
import { residencies } from "../db/schema/user"

type NewResidency = typeof residencies.$inferInsert

export const createResidency = async (req: Request, res: Response) => {
    const data: NewResidency = req.body

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