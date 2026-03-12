import { Request, Response, Router, NextFunction } from "express"; // הוספנו NextFunction
import DocumentsService from "./documents-service";
import { DOCUMENT_NOT_FOUND_ERROR } from "./documents-dal";
import DocumentsMiddlewares from "./documents-middelwares";
import HistoryMiddlewares from "../history/history-middlewares";
import AuthMiddleware from "../utils/auth-middleware";

export default class DocumentsApi {
    public router: Router;

    constructor(private documentsService: DocumentsService, private historyService: any) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        const historyLog = HistoryMiddlewares.createLog(this.historyService);

        this.router.use(AuthMiddleware.validateUserId);

        this.router.post("/",
            DocumentsMiddlewares.validateCreateDocument,
            historyLog,
            this.createDocument.bind(this)
        );

        this.router.get("/", this.getAllDocuments.bind(this));

        this.router.get("/:id",
            DocumentsMiddlewares.validateDocumentId,
            this.getById.bind(this)
        );

        this.router.put("/:id",
            DocumentsMiddlewares.validateDocumentId,
            DocumentsMiddlewares.validateUpdateDocument,
            historyLog,
            this.update.bind(this)
        );

        this.router.delete("/:id",
            DocumentsMiddlewares.validateDocumentId,
            historyLog,
            this.deleteDocument.bind(this)
        );

        this.router.get("/:id/download",
            DocumentsMiddlewares.validateDocumentId,
            this.downloadPdf.bind(this)
        );
    }

    // 1
    async createDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { path, title, content } = req.body;
            const userId = req.userId as string;
            const newDocument = await this.documentsService.createDocument(path, title, content, userId);

            req.document = newDocument;
            res.status(201).json(newDocument);
        } catch (error: any) {
            next(error);
        }
    }

    // 2
    private async getAllDocuments(req: Request, res: Response, next: NextFunction) {
        try {
            const { pathPrefix, author, sortBy } = req.query;
            const documents = await this.documentsService.getAllDocuments(
                pathPrefix as string,
                author as string,
                sortBy as string
            );
            res.status(200).json(documents);
        } catch (error: any) {
            next(error);
        }
    }

    // 3
    private async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const document = await this.documentsService.getDocumentById(id);
            if (!document) {
                const err: any = new Error(DOCUMENT_NOT_FOUND_ERROR);
                err.status = 404;
                return next(err);
            }
            res.json(document);
        } catch (error: any) {
            next(error);
        }
    }

    // 4
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const userId = req.userId as string;

            const updatedDoc = await this.documentsService.updateDocument(id, updateData, userId);
           if (!updatedDoc) {
    const err: any = new Error("Document not found");
    err.status = 404;
    return next(err);
}

            req.document = updatedDoc;
            res.status(200).json(updatedDoc);
        } catch (error: any) {
            next(error);
        }
    }

    // 5
    private async deleteDocument(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const deletedDocument = await this.documentsService.deleteDocument(id);
            if (!deletedDocument) {
                const err: any = new Error("Document not found, nothing to delete");
                err.status = 404;
                return next(err);
            }

            req.document = deletedDocument;
            res.status(200).json(deletedDocument);
        } catch (error: any) {
            next(error);
        }
    }

    // 6
    private async downloadPdf(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const document = await this.documentsService.getDocumentById(id);

            if (!document) {
                const err: any = new Error("Document not found");
                err.status = 404;
                return next(err);
            }

            const pdfDoc = await this.documentsService.downloadPdf(id);
            if (!pdfDoc) {
                const err: any = new Error("Failed to generate PDF");
                err.status = 500;
                return next(err);
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${document.title}.pdf"`);

            pdfDoc.pipe(res as any);
        } catch (error: any) {
            next(error);
        }
    }
}