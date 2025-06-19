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
        res.status(200).json({message: `${userToDelete} deleted`});
    }
        catch (error) {
            res.status(404).json({message: "no user found"});
        }
})

router.post("/users", async (req: Request, res: Response) => {
    try {
    console.log("request body", req.body);
    const newUser =  new User;
    newUser.username = req.body.username,
    newUser.email = req.body.email,
    newUser.password = req.body.password,
    newUser.save()
    res.status(200).json({message: `User ${newUser.username} created`});
    } catch (error) {
        res.status(404).json({message: "no user created"});
    }
})

router.put("/users/:id", async (req: Request, res: Response) => {
    try {
        const user = await User.findOneByOrFail({id: parseInt(req.params.id)})
        const userToUpdate = Object.assign(
            user,
            req.body
        )
        userToUpdate.save()
        res.status(200).json({message: `User updated`});
    } catch (error) {
       res.status(404).json({message: "no user updated"}); 
    }
})

export default router