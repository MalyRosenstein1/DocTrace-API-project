import { NextFunction, Request, Response } from "express";

export default class ErrorMiddleware {
    static errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
        console.error("--- Error Investigation Report ---");
        console.error(`Time: ${new Date().toISOString()}`);
        console.error(`Method: ${req.method} | URL: ${req.originalUrl}`);
        console.error(`User ID: ${req.userId || "Unknown"}`);
        console.error(`Error Message: ${err.message}`);
        console.error(`Stack Trace: ${err.stack}`);

        const status = err.status || 500;
        const message = err.message || "Internal Server Error";

        res.status(status).json({ message });
    }
}