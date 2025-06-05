import dotenv from "dotenv"
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/school-management',
  email: {
    from: process.env.EMAIL_FROM || 'noreply@school.edu',
    smtpHost: process.env.SMTP_HOST || 'smtp.example.com',
    smtpPort: process.env.SMTP_PORT || 587,
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER || 'user@example.com',
    smtpPass: process.env.SMTP_PASS || 'password'
  }
};