// const EventEmitter = require('events');
// const bus = new EventEmitter();

// // Increase the maximum number of listeners to 20
// bus.setMaxListeners(20);

class ApiError extends Error {
  constructor(
    statusCode,
    message = "An error occurred",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.data = null;
    this.message = message;
    
    if(stack){
        this.stack = stack;
    }
    else {
        Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };