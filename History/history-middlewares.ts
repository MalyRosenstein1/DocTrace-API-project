import { NextFunction, Request, Response } from "express";
import { HistoryService } from "./history-service";

export default class HistoryMiddlewares {
    
    static createLog(historyService: HistoryService) {
        return (req: Request, res: Response, next: NextFunction) => {
            
            res.on('finish', async () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    
                    const userId = req.userId as string; 
                    const opType = HistoryMiddlewares.getOpType(req.method);
                    
                    const doc = req.document as any; 

                    if (userId && opType) {
                        try {
                            await historyService.createLog({
                                user: userId,
                                operationType: opType,
                                documentId: doc?.id || req.params.id || "new-doc",
                                documentAuthor: doc?.author || userId,
                                documentPath: doc?.path || req.body.path || "N/A"
                            });
                        } catch (err) {
                            console.error("History logging failed:", err);
                        }
                    }
                }
            });

            next(); 
        };
    }

    private static getOpType(method: string): "CREATE" | "UPDATE" | "DELETE" | null {
        if (method === 'POST') return 'CREATE';
        if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
        if (method === 'DELETE') return 'DELETE';
        return null;
    }
}