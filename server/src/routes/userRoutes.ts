import { Router, Request, Response } from "express";
import { User } from "../entity/Users"


const router = Router();

router.get("/users", async (_req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/users/:id", async (req: Request, res: Response) => {
    try {
    const user = await User.findOne({where: {id: parseInt(req.params.id)}})
    res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(404).json({message: "no user found"});
    }
})

router.delete("/users/:id", async (req: Request, res: Response) => {
    try {
        const userToDelete = await User.delete(req.params.id)
        res.status(204).json({message: `${userToDelete} deleted`});
    }
        catch (error) {
            res.status(404).json({message: "no user found"});
        }
})

// router.post("/users", (req: Request, res: Response) => {
//     const newUser: User = {
//         id: users.length + 1,
//         username: req.body.username,
//         password: req.body.password,
//     }
//     users.push(newUser)
//     res.status(204).json({message: "user created"})
// })

// router.put("/users/:id", (req: Request, res: Response) => {
//     const userId = parseInt(req.params.id);
//     const userIndex: any = users.findIndex((el) => el.id === userId)
//     if (userIndex !== -1) {
//         users[userIndex] = { 
//             ...users[userIndex],           
//             ...req.body,                   
//             id: userId                     
//         };
//         res.json(users[userIndex]);
//   } else {
//     res.status(404).json({ message: "user not found" });
//   }
// })


export default router