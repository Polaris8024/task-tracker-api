export function logger(req, res, next) {
    const timestamp = new Date().toISOString();

    console.log(
        `[${timestamp}] ${req.method} ${req.originalUrl}`
    );

    next();
}

//req represents the incoming request object, res represents the response object, and next is a function that passes control to the next middleware in the stack.
//req.method is the HTTP method of the request (e.g., GET, POST), and req.originalUrl is the original URL of the request. The logger function logs this information to the console with a timestamp, and then calls next() to pass control to the next middleware or route handler.