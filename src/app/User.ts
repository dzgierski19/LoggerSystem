import { randomUUID } from "crypto";

export const USERS = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  BASIC: "BASIC",
} as const;

export type Users = (typeof USERS)[keyof typeof USERS];

export class User {
  readonly id = randomUUID();
  readonly createdAt = new Date();
  readonly role: Users;
  readonly permissionLevel: Users[];
  constructor(role: Users) {
    this.role = role;
    this.permissionLevel = this.userPermission();
  }
  private userPermission() {
    if (this.role === USERS.BASIC) {
      return [USERS.BASIC];
    }
    if (this.role === USERS.ADMIN) {
      return [USERS.BASIC, USERS.ADMIN];
    }
    return [USERS.BASIC, USERS.ADMIN, USERS.OWNER];
  }
}

///czy musze wstawiac constructor gdy jest pusty?
