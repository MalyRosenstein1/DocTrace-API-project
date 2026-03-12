import "./utils/express-request"; 
import express, { Express } from "express";
import DbConn from "./utils/db-conn";
import DocumentsDal from "./Documents/documents-dal";
import DocumentsService from "./Documents/documents-service";
import DocumentsApi from "./Documents/documents-api";
import {HistoryDAL} from "./History/history-dal";
import { HistoryService } from "./History/history-service"; 
import { HistoryApi } from "./History/history-api";
import ErrorMiddleware from "./utils/error-middleware"; 



const HOST = "127.0.0.1";
const PORT = 5000;

export default class App {
    private app: Express;
    private dbConn!: DbConn;

    constructor() {
        this.app = express();
    }

    async init() {
        this.dbConn = new DbConn();
        await this.dbConn.init();

        const historyDal = new HistoryDAL(this.dbConn);
        const historyService = new HistoryService(historyDal);
        const historyApi = new HistoryApi(historyService);

        const documentDal = new DocumentsDal(this.dbConn);
        const documentsService = new DocumentsService(documentDal);
        const documentsApi = new DocumentsApi(documentsService, historyService);

        this.setRoutes(documentsApi, historyApi); 
    }

    private setRoutes(documentsApi: DocumentsApi, historyApi: HistoryApi) {
        this.app.use(express.json());

        this.app.use("/api/documents", documentsApi.router);
        this.app.use("/api/history", historyApi.getRouter());

        this.app.use(ErrorMiddleware.errorHandler);
    }

    startServer() {
        this.app.listen(PORT, HOST, () => {
            console.log(`Listening on: http://${HOST}:${PORT}`);
        });
    }

    async terminate() {
        if (this.dbConn) {
            await this.dbConn.terminate();
        }
    }
}