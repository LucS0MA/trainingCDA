import { Router, Request, Response } from "express";

const router = Router();

interface User {
  id: number;
  username: string;
  password: string;
}

const users: User[] = [
    {
        id: 1, username: "Paul", password: 'paul52'
    },
    {
        id: 2, username: "Prune", password: 'prune21'
    }
] 

router.get("/users", (_req: Request, res: Response) => {
    res.json(users)
})

router.get("/users/:id", (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const user: any = users.find((el) => el.id === userId)
    if (user) {
        res.json(user)
    } else {
        res.status(404).json({message: "no user found"});
    }
})

router.delete("/users/:id", (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const userIndex: any = users.findIndex((el) => el.id === userId)
    if (userIndex !== -1) {
        users.splice(userIndex, 1)
        res.status(204).json({message: "user deleted"});
    } else {
        res.status(404).json({message: "no user found"});
    }
})

router.post("/users", (req: Request, res: Response) => {
    const newUser: User = {
        id: users.length + 1,
        username: req.body.username,
        password: req.body.password,
    }
    users.push(newUser)
    res.status(204).json({message: "user created"})
})

router.put("/users/:id", (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const userIndex: any = users.findIndex((el) => el.id === userId)
    if (userIndex !== -1) {
        users[userIndex] = { 
            ...users[userIndex],           
            ...req.body,                   
            id: userId                     
        };
        res.json(users[userIndex]);
  } else {
    res.status(404).json({ message: "user not found" });
  }
})


export default router