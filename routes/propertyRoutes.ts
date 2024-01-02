import { Router } from "express";
import { createProperties } from "../controllers/propertyController";

const router = Router()

router.post('/create', createProperties)

export default router