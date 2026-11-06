 Task Tracker REST API — Testing Summary

 Project Overview

For this assignment, I created a RESTful API using Node.js and Express. The API manages a collection of tasks stored in an in-memory JavaScript array. I organized the API endpoints using Express Router and implemented custom logging middleware.

Testing with Postman

I tested the API locally using Postman at http://localhost:3000

| HTTP Method | Endpoint | Status Code | Result |
|---|---|---|---|
| GET | `/api/resources` | 200 OK | Passed |
| GET | `/api/resources/1` | 200 OK | Passed |
| POST | `/api/resources` | 201 Created | Passed |
| PUT | `/api/resources/:id` | 200 OK | Passed |
| DELETE | `/api/resources/:id` | 200 OK | Passed |
| GET | Deleted resource ID | 404 Not Found | Passed |
| POST (empty title) | `/api/resources` | 400 Bad Request | Passed |

Testing Process

I started by using GET requests to retrieve all tasks and an individual task. Both requests returned a 200 OK response.

Next, I used POST to create a new task with a title and completion status. The server returned 201 Created, and I verified that the new task appeared in the resource collection.

I then used PUT to update the new task's title and change its completion status from false to true. The request returned 200 OK, and a subsequent GET request confirmed that the changes were saved.

After that, I used DELETE to remove the task. The server returned 200 OK. When I attempted to retrieve the deleted task again, the server returned 404 Not Found.

Finally, I tested input validation by sending a POST request with an empty title. The server correctly returned 400 Bad Request.

 Middleware

I implemented custom logging middleware that records the timestamp, HTTP method, and requested URL in the VS Code terminal.

Conclusion

All five required REST API endpoints worked successfully during testing. I also verified that the API handles invalid input and missing resources using appropriate HTTP status codes.

The application stores data in memory, so changes are not retained when the server restarts.
______________________
PosgreSQL REST API 

This project extends my previous Express REST API by replacing the in-memory JavaScript array with a PostgreSQL database. The API now stores and retrieves task information using SQL queries.

Testing Environment

Node.js and Express

PostgreSQL

pgAdmin 4

Postman

Visual Studio Code

API Endpoint Tests

HTTP Method

Endpoint

Expected Status

GET

/api/items

200 OK

GET

/api/items/:id

200 OK

POST

/api/items

201 Created

PUT

/api/items/:id

200 OK

DELETE

/api/items/:id

200 OK

GET (missing ID)

/api/items/999999

404 Not Found

GET (invalid ID)

/api/items/abc

400 Bad Request

POST (invalid title)

/api/items

400 Bad Request

Database Persistence Test

I created a new task through Postman and updated it using the PUT endpoint. After restarting my Express server, I sent another GET request and confirmed the task was still stored in PostgreSQL.

This demonstrates that the application uses persistent database storage rather than temporary in-memory storage.

Conclusion

The API uses parameterized SQL queries to interact with PostgreSQL. The implementation supports creating, retrieving, updating, and deleting tasks, along with input validation and error handling.