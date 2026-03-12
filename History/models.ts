export interface Operation {
   user: string;
   documentId: string;
   documentPath: string;
   documentAuthor: string;
   timestamp: Date;
   operationType: "CREATE" | "UPDATE" | "DELETE";
}


export interface OperationWithId extends Operation {
    _id?: any;
}
export interface PaginatedHistory {
   data: Operation[];
   total: number;
   page: number;
   limit: number;
}