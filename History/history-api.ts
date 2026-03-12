import { Router, Request, Response } from "express";
import { HistoryService } from "./history-service";

export class HistoryApi {
    private router: Router;
    private historyService: HistoryService;

    constructor(historyService: HistoryService) {
        this.router = Router();
        this.historyService = historyService;
        this.initRoutes();
    }

    private initRoutes() {
        
        this.router.get("/", this.getHistory.bind(this));
        this.router.delete("/", this.clearHistory.bind(this));
    }

    //1
    //לא כתבנו כאן את הפונקציה של יצירת ההסטוריה 
    //ה  כי לפי ההוראות המשתמש יגש רק כדי למחוק או  לראות ל
    //2
    private async getHistory(req: Request, res: Response) {
        const { page, limit, user, operationType, documentId, documentAuthor, pathPrefix } = req.query;

        const p = page ? parseInt(page as string) : 1;
        const l = limit ? parseInt(limit as string) : 10;

        const history = await this.historyService.getHistory(
            p, l, 
            user as string, 
            operationType as string, 
            documentId as string, 
            documentAuthor as string, 
            pathPrefix as string
        );

        res.json(history); 
    }
//3
    private async clearHistory(req: Request, res: Response) {
        await this.historyService.clearHistory();
        res.status(204).send(); 
    }

    public getRouter() {
        return this.router;
    }
}