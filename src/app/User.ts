import { randomUUID } from "crypto";

export const USERS = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  BASIC: "BASIC",
} as const;

export type Users = (typeof USERS)[keyof typeof USERS];

class User {
  constructor() {}
  readonly id = randomUUID();
  readonly createdAt = new Date();
  readonly role: Users = USERS.ADMIN;
}
