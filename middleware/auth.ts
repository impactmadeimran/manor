import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

require('dotenv').config();

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ "info": "A token is required for authentication" });
    }
    try {
        const bearer = token.split(' ');
        const bearerToken = bearer[1]
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string);
        // req.user = decoded;
        console.log(decoded)
    } catch (err) {
        return res.status(401).json({ "info": "Invalid Token", "success": false });
    }
    return next();
};