/**
 * Centralized error handling middleware.
 */

/**
 * 404 — Route not found handler.
 * Catches requests that don't match any defined route.
 */
function notFound(req, res, next) {
    const error = new Error(`Not Found — ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
}

/**
 * Global error handler.
 * Catches all errors and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error in development
    if (process.env.NODE_ENV !== 'production') {
        console.error(`[ERROR] ${statusCode} — ${message}`);
        if (err.stack) console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    });
}

module.exports = { notFound, errorHandler };
