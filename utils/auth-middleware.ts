import { Request, Response, NextFunction } from "express";

export default class AuthMiddleware {
    static validateUserId(req: Request, res: Response, next: NextFunction) {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(401).send("Unauthorized: Missing X-User-Id header");
        }

        req.userId = userId as string;
        next();
    }
}