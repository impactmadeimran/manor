import { Router } from "express"
import { deleteuser, login, signup } from "../controllers/authController";

const router = Router();

router.get('/', (req, res) => {
    return res.json({
        message: "hi"
    })
})

router.post('/signup', signup);
router.post('/login', login);
router.post('/deleteuser', deleteuser);

export default router