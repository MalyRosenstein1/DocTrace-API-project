import { Db, MongoClient } from "mongodb";

const DB_URL = "mongodb://localhost:27017";
const COMPANY_DB_NAME = "ServerProjectDB";

export default class DbConn {
    private connection!: MongoClient;

    constructor() { }

    async init() {
        this.connection = await MongoClient.connect(DB_URL);
    }

    getCompanyDB(): Db {
        return this.connection.db(COMPANY_DB_NAME);
    }

    async terminate() {
        await this.connection.close();
    }
}










