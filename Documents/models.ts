import { ObjectId } from "mongodb";
import { Operation } from "../History/models";


export interface Documents {
    id   : string,
    author :string ,
    path : string,
    title : string,
    content : string,
    createdAt : Date,
    lastUpdatedAt : string,
    lastUpdatedBy : string 
}

export interface DocumentDetails {
    id: string;
    author: string;
    path: string;
    title: string;
}

export interface OperationWithId extends Documents {
    _id?: any;
}