import { randomBytes } from "crypto";

// إنشاء مفتاح عشوائي بطول 32 بايت
const secretKey = randomBytes(32).toString("hex");

