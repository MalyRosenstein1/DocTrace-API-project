import { NextFunction, Request, Response } from "express";



export default class DocumentsMiddlewares    {
    static errorHandler: any;
 
//1
static validateCreateDocument(req: Request, res: Response, next: NextFunction) {
        const { path, title, content } = req.body;

        if (!path || typeof path !== 'string' || path.trim() === '') {
            return res.status(400).send("Invalid or missing path");
        }

        if (!title || typeof title !== 'string' || title.length < 2) {
            return res.status(400).send("Invalid or missing title (min 2 characters)");
        }

        if (!content || typeof content !== 'string') {
            return res.status(400).send("Invalid or missing content");
        }

        next(); 
    }

//2
static validateUpdateDocument(req: Request, res: Response, next: NextFunction) {
        const { content } = req.body;

        if (!content || typeof content !== 'string') {
            return res.status(400).send("Invalid or missing content for update");
        }

        next();
    }
    //3
    static validateDocumentId(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        
        if (!id || id.trim() === '') {
            return res.status(400).send("Document ID is required");
        }
        
        next();}




    
}