import { Documents, DocumentDetails } from './models';
import { ObjectId } from 'mongodb';
import { Collection } from "mongodb";
import DbConn from '../utils/db-conn';



const DOCUMENTS_COLLECTION_NAME = "documents";
export const DOCUMENT_NOT_FOUND_ERROR = "document not found";
export const DOCUMENT_ALREADY_EXISTS = "documents already exists";

export default class DocumentDal {
    private documentsCollection: Collection<Documents>;
    constructor(dbConn: DbConn) {
        this.documentsCollection = dbConn.getCompanyDB().collection(DOCUMENTS_COLLECTION_NAME);
    }
    //1
    async createDocument(document: Documents): Promise<DocumentDetails> {
        const result = await this.documentsCollection.insertOne(document);
        return {
            id: result.insertedId.toString(),
            author: document.author,
            path: document.path,
            title: document.title
        };
    }
    //2
    async getAllDocuments(filter: any = {}, sort: any = {}): Promise<Documents[]> {
        const documents = await this.documentsCollection.find(filter).sort(sort).toArray();
        return documents.map(documents => ({
            id: documents._id.toString(),
            author: documents.author,
            path: documents.path,
            title: documents.title,
            content: documents.content,
            createdAt: documents.createdAt,
            lastUpdatedAt: documents.lastUpdatedAt,
            lastUpdatedBy: documents.lastUpdatedBy
        }));

    }

    //3
    async getById(id: string): Promise<Documents> {
        const document = await this.documentsCollection.findOne({ _id: new ObjectId(id) });

        if (!document) {
            throw new Error(DOCUMENT_NOT_FOUND_ERROR);
        }
        (document as any).id = document._id!.toString();

        delete (document as any)._id;

        return document as unknown as Documents;
    }
    //4
    async updateDocument(id: string, updateData: Partial<Documents>): Promise<Documents | null> {
    const res = await this.documentsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) }, 
        { $set: updateData },      
        { returnDocument: 'after' } 
    );
    
    const doc = res as unknown as Documents;

    if (doc) {
        (doc as any).id = (doc as any)._id.toString();
        delete (doc as any)._id;
    }

    return doc; 
}
    //5

    async deleteDocument(id: string): Promise<Documents | null> {
        const result = await this.documentsCollection.findOneAndDelete(
            { _id: new ObjectId(id) }
        );
        const document = result as unknown as Documents;

        if (document) {
            (document as any).id = (document as any)._id.toString();
            delete (document as any)._id;
        }

        return document;
    }

}


