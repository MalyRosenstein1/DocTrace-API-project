import { DocumentDetails, Documents} from "../Documents/models";


declare global {
  namespace Express {
    interface Request {
      userId?: string;     
      document?: Documents | DocumentDetails; 
    }
  }
}

