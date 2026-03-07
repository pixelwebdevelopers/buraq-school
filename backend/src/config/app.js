/**
 * Application-wide configuration constants.
 * Reads from environment variables with sensible defaults.
 */
module.exports = {
    // Server
    port: parseInt(process.env.PORT, 10) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

    // Client
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

    // Bcrypt
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,

    // SMTP Configuration (Laragon Mailcatcher defaults)
    smtpHost: process.env.SMTP_HOST || '127.0.0.1',
    smtpPort: parseInt(process.env.SMTP_PORT, 10) || 1025,
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
};
