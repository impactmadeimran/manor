import { Router } from "express";
import { createResidency } from "../controllers/residencyController";

const router = Router()

router.post('/create', createResidency)

export default router