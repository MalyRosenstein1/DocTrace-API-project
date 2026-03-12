import DocumentDal, { DOCUMENT_ALREADY_EXISTS, DOCUMENT_NOT_FOUND_ERROR } from "./documents-dal";
import { DocumentDetails, Documents } from "./models";
import PDFDocument from 'pdfkit';
export default class DocumentsService {

    constructor(private documentsDal: DocumentDal) {
        this.documentsDal = documentsDal;

    }
    //1
    async createDocument(path: string, title: string, content: string, userId: string): Promise<DocumentDetails> {
        const newDocument: any = {
            author: userId,
            path: path,
            title: title,
            content: content,
            createdAt: new Date(),
            lastUpdatedAt: new Date().toISOString(),
            lastUpdatedBy: userId
        }

        const createdDoc = await this.documentsDal.createDocument(newDocument as Documents);
        return {
            id: createdDoc.id,
            author: createdDoc.author,
            path: createdDoc.path,
            title: createdDoc.title
        };
    }
    //2
    async getAllDocuments(pathPrefix?: string, author?: string, sortBy?: string): Promise<DocumentDetails[]> {
        const filter: any = {};
        const sort: any = {};
        if (pathPrefix) {
            filter.path = { $regex: `^${pathPrefix}` };
        }
        if (author) {
            filter.author = author;
        }
        if (sortBy) {
            const isDescending = sortBy.startsWith('-');
            const fieldName = isDescending ? sortBy.substring(1) : sortBy;
            sort[fieldName] = isDescending ? -1 : 1;
        }
        const allDocs = await this.documentsDal.getAllDocuments(filter, sort);

        return allDocs.map(document => ({
            id: document.id,
            author: document.author,
            path: document.path,
            title: document.title
        }));
    }

    //3
    async getDocumentById(id: string): Promise<Documents | null> {
        let document: Documents | null;
        try {
            document = await this.documentsDal.getById(id);
        } catch (err: any) {
            if (err.message == DOCUMENT_NOT_FOUND_ERROR) {
                return null;
            }
            throw err;
        }
        return document;
    }
    //4

    async updateDocument(id: string, updateData: Partial<Documents>, userId: string): Promise<Documents | null> {
    try {
        updateData.lastUpdatedAt = new Date().toISOString();
        updateData.lastUpdatedBy = userId;

        const updatedDoc = await this.documentsDal.updateDocument(id, updateData);
        
        return updatedDoc; 
        
    } catch (err: any) {
        if (err.message == DOCUMENT_NOT_FOUND_ERROR) {
            return null;
        }
        throw err;
    }
}
    //5
    async deleteDocument(id: string): Promise<Documents | null> {
        const deletedDoc = await this.documentsDal.deleteDocument(id);
        return deletedDoc;
    }
    //6
async downloadPdf(id: string): Promise<PDFKit.PDFDocument | null> {
   try {
        const document = await this.documentsDal.getById(id);
        if (!document) {
            return null;
        }
        const doc = new PDFDocument();
        
        doc.fontSize(25).text(document.title);
        doc.moveDown(); 
        doc.fontSize(14).text(document.content);
        
        doc.end();
        return doc;

    } catch (err: any) {
        console.error("Error generating PDF:", err.message);
        throw err; 
    }
}

}