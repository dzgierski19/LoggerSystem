export const USERS = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  BASIC: "BASIC",
} as const;

export type Users = (typeof USERS)[keyof typeof USERS];

class User {
  // implementacja dla uzytkownika
}
