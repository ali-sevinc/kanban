import crypto from "node:crypto";

export function hashPassword(password: string) {
  const salted = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto.scryptSync(password, salted, 64);
  return hashedPassword.toString("hex") + ":" + salted;
}
export function verifyPassword(userPassword: string, enteredPassword: string) {
  const [hashedPassword, salt] = userPassword.split(":");
  const hashedPasswordBuffer = Buffer.from(hashedPassword, "hex");
  const suppliedBuffer = crypto.scryptSync(enteredPassword, salt, 64);
  return crypto.timingSafeEqual(hashedPasswordBuffer, suppliedBuffer);
}
