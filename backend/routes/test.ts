import { Request, Response, Router } from "express";

const router = Router();

router.get("/test", (req: Request, res: Response) => {
  res.json({ message: "This is a test endpoint!" });
});
