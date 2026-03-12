import { Collection, Db } from "mongodb";
import DbConn from "../utils/db-conn";
import { Operation, PaginatedHistory } from "./models";

export class HistoryDAL {
    private dbConn: DbConn;
    private collectionName = "histories";

    constructor(dbConn: DbConn) {
        this.dbConn = dbConn;
    }

    private getCollection(): Collection<Operation> {
        const db: Db = this.dbConn.getCompanyDB();
        return db.collection<Operation>(this.collectionName);
    }

    async createLog(operationData: Operation): Promise<void> {
        try {
            const collection = this.getCollection();
            await collection.insertOne(operationData);
            console.log("Saved to MongoDB (MongoClient) successfully!");
        } catch (error) {
            console.error("Error saving to DB:", error);
            throw new Error("Failed to save history operation");
        }
    }

    async listOperations(filter: any, page: number, limit: number): Promise<PaginatedHistory> {
        try {
            const collection = this.getCollection();
            const skipAmount = (page - 1) * limit;

            const data = await collection.find(filter)
                .sort({ timestamp: -1 })
                .skip(skipAmount)
                .limit(limit)
                .toArray();

            const total = await collection.countDocuments(filter);

            return {
                data: data as Operation[],
                total: total,
                page: page,
                limit: limit
            };
        } catch (error) {
            console.error("Error fetching history:", error);
            throw error;
        }
    }

    async clearHistory(): Promise<void> {
        const collection = this.getCollection();
        await collection.deleteMany({});
        console.log("History collection cleared");
    }
}