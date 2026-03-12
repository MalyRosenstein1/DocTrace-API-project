import { HistoryDAL } from "./history-dal";
import { Operation, PaginatedHistory } from "./models";
export class HistoryService {
    private historyDAL: HistoryDAL;

    constructor(historyDAL: HistoryDAL) {
        this.historyDAL = historyDAL;
    }
//1
   async createLog(operationData: Omit<Operation, 'timestamp'>): Promise<void> {
    const fullOperation: Operation = {
        user: operationData.user,
        documentId: operationData.documentId,
        documentPath: operationData.documentPath,
        documentAuthor: operationData.documentAuthor,
        operationType: operationData.operationType,
        timestamp: new Date() 
    };

    await this.historyDAL.createLog(fullOperation);
}
//2
//2
async getHistory(
    page: number = 1, 
    limit: number = 10,
    user?: string,
    operationType?: string,
    documentId?: string,
    documentAuthor?: string,
    pathPrefix?: string
): Promise<PaginatedHistory> {
    
    const filter: any = {};

    if (user) {
        filter.user = user;
    }
    if (operationType) {
        filter.operationType = operationType;
    }
    if (documentId) {
        filter.documentId = documentId
    }
    if (documentAuthor) {
        filter.documentAuthor = documentAuthor;
    }

    if (pathPrefix) {
        filter.documentPath = { $regex: "^" + pathPrefix };
    }

    const result = await this.historyDAL.listOperations(filter, page, limit);


    return result;
}
//3
async clearHistory(): Promise<void> {
    await this.historyDAL.clearHistory();
}




}