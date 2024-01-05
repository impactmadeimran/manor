import { Router } from "express";
import { createResidency, residencyLogin, verifyResidencyCode } from "../controllers/residencyController";

const router = Router()

router.post('/create', createResidency)
router.post('/login', residencyLogin)
router.post('/verify', verifyResidencyCode)
export default router