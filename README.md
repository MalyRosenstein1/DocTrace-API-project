**DocTrace API
**
A robust Node.js Backend System for document management with integrated history tracking. This system provides a RESTful API to manage hierarchical documents, track every modification, and export content as PDF.

** Key Features
**
Hierarchical Document Store: Manage documents using a path-based folder structure.

Automated History Tracking: Every Create, Update, and Delete operation is automatically logged via custom middleware.

Advanced Query Engine: Support for filtering by author, path-prefix, and dynamic sorting.

PDF Generation: Built-in functionality to download documents as PDF files.

Secure Middleware Layer: * User identification via custom headers (X-User-Id).

Request body validation.

Centralized error handling and logging.

** Architecture & Design
**
The project follows a Layered Architecture to ensure separation of concerns:

API Layer: Handles routing and HTTP logic.

Service Layer: Contains core business logic and history injection.

DAL (Data Access Layer): Direct interaction with MongoDB collections.

**Tech Stack
**
Runtime: Node.js

Framework: Express.js

Database: MongoDB 

Tools: PDFKit/Puppeteer (for PDF), Postman (for testing)
