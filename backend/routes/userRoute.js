import { Router } from "express"
import { getMe, logoutUser, Signup, userLogin } from "../controller/userController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/signin", Signup)
router.post("/login", userLogin)
router.get("/logout", logoutUser);
router.get("/me", verifyUser, async (req, res) => {
    try {
        const user = req.user
         res.json({
            user
        })
    } catch (error) {
        res.status(500).json({message: "internal server error",error})
    }
})

export default router
