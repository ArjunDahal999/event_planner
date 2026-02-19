import { cleanEnv, str, port } from "envalid";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFilePath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envFilePath });

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  SMTP_HOST: str({ default: "smtp.example.com" }),
  SMTP_PORT: str({ default: "587" }),
  SMTP_MAIL: str({ default: "user@example.com" }),
  SMTP_PASSWORD: str({ default: "password" }),
  JWT_ACCESS_TOKEN_EXPIRY: str({ default: "15m" }),
  JWT_REFRESH_TOKEN_EXPIRY: str({ default: "7d" }),
  JWT_REFRESH_TOKEN_SECRET: str({
    default: "4f6e8d0c2b1a3957c6d8e0f1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d",
  }),
  JWT_ACCESS_TOKEN_SECRET: str({
    default: "a3b1c5d7e9f0123456789abcdef0123456789abcdef0123456789abcdef0123",
  }),
  MYSQL_HOST: str({ default: "127.0.0.1" }),
  MYSQL_PORT: port({ default: 3307 }),
  MYSQL_USER: str({ default: "app_user" }),
  MYSQL_PASSWORD: str({ default: "userPassword" }),
  MYSQL_DATABASE: str({ default: "app_db" }),
});
