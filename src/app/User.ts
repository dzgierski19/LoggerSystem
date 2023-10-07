import { randomUUID } from "crypto";
import { Clock, clock } from "./clock";

export type UserId = string;

export enum USERS_TYPE {
  BASIC,
  ADMIN,
  OWNER,
}

export type UserType = (typeof USERS_TYPE)[keyof typeof USERS_TYPE];

const NUMBER_LEVEL_TO_ROLE_MAPPER: Record<UserType, string> = {
  [USERS_TYPE.OWNER]: "OWNER",
  [USERS_TYPE.ADMIN]: "ADMIN",
  [USERS_TYPE.BASIC]: "BASIC",
};

export class User {
  readonly id = randomUUID();
  readonly createdAt: Date;
  readonly role: string;
  readonly roleLevel: USERS_TYPE;
  deletedAt?: Date;

  constructor(roleLevel: USERS_TYPE, clock: Clock) {
    this.role = NUMBER_LEVEL_TO_ROLE_MAPPER[roleLevel];
    this.roleLevel = roleLevel;
    this.createdAt = clock();
  }
}
