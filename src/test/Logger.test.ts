import { clock } from "../app/Clock";
import { Log } from "../app/Log";
import { LogList } from "../app/LogList";
import { LOGTYPE } from "../app/LogType";
import { Logger } from "../app/Logger";
import { USERS_TYPE, User } from "../app/User";
import { UserList } from "../app/UserList";

describe("Logger test suite", () => {
  let newAdmin: User;
  let newLogList: LogList;
  let newUserList: UserList;
  let newLogger: Logger;
  let createdLog: Log;

  beforeEach(() => {
    newAdmin = new User(USERS_TYPE.ADMIN, clock);
    newLogList = new LogList();
    newUserList = new UserList();
    newLogger = new Logger(newUserList, newLogList);
    newUserList.addOne(newAdmin.id, newAdmin);
    createdLog = newLogger.createLog(LOGTYPE.DEBUG, newAdmin.id, "DEBUG");
  });
  it("Should create a log", () => {
    expect(newLogList.list.has(createdLog.id)).toBeTruthy();
  });
  it("Should delete a log", () => {
    newLogger.deleteLog(newAdmin.id, createdLog.id);
    expect(newLogList.list.get(createdLog.id).deletedAt).toBeTruthy();
    expect(newLogList.list.get(createdLog.id).deletedBy).toBe(newAdmin.id);
  });
  it("Should return a log", () => {
    const showLog = newLogger.showLog(newAdmin.id, createdLog.id);
    expect(showLog).toEqual(createdLog);
  });
  it("Should delete all logs with proper user role", () => {
    const newBasicUser = new User(USERS_TYPE.BASIC, clock);
    newUserList.addOne(newBasicUser.id, newBasicUser);
    const newOwnerUser = new User(USERS_TYPE.OWNER, clock);
    newUserList.addOne(newOwnerUser.id, newOwnerUser);
    const ownerLog = newLogger.createLog(
      LOGTYPE.VERBOSE,
      newOwnerUser.id,
      "VERBOSE"
    );
    newLogger.createLog(LOGTYPE.ERROR, newBasicUser.id, "ERROR");
    newLogger.deleteAllLogsWithUserLevel(newAdmin.id);
    let deletedByAdminCounter = 0;
    newLogList.list.forEach((element) => {
      if (element.deletedBy === newAdmin.id) {
        deletedByAdminCounter++;
      }
    });
    expect(deletedByAdminCounter).toBe(2);
    expect(ownerLog.deletedBy).toBeUndefined();
  });

  it("Should show all logs with proper user role", () => {
    const newOwnerUser = new User(USERS_TYPE.OWNER, clock);
    newUserList.addOne(newOwnerUser.id, newOwnerUser);
    newLogger.createLog(LOGTYPE.DEBUG, newOwnerUser.id, "DEBUG");
    const showLogs = newLogger.showAllLogsWithUserLevel(newAdmin.id);
    expect(showLogs).toHaveLength(1);
  });
  it("Should show no logs when all logs were created by higher user level", () => {
    const newBasicUser = new User(USERS_TYPE.BASIC, clock);
    newUserList.addOne(newBasicUser.id, newBasicUser);
    const logs = newLogger.showAllLogsWithUserLevel(newBasicUser.id);
    expect(logs).toEqual([]);
  });
  describe("should throw an error when: ", () => {
    let newBasicUser: User;
    beforeEach(() => {
      newBasicUser = new User(USERS_TYPE.BASIC, clock);
    });
    it("creating a log with user not available in userList", () => {
      function error() {
        newLogger.createLog(LOGTYPE.ERROR, newBasicUser.id, "ERROR");
      }
      expect(error).toThrow();
    });
    it("deleting a log with user not available in userList", () => {
      function error() {
        newLogger.deleteLog(newBasicUser.id, createdLog.id);
      }
      expect(error).toThrow();
    });
    it("deleting a log with user deleted from userList", () => {
      const adminUser = new User(USERS_TYPE.ADMIN, clock);
      newUserList.addOne(adminUser.id, adminUser);
      newUserList.deleteOne(adminUser.id);
      function error() {
        newLogger.deleteLog(adminUser.id, createdLog.id);
      }
      expect(error).toThrow();
    });
    it("deleting a log with user with lower role than user who created log", () => {
      const newOwnerUser = new User(USERS_TYPE.OWNER, clock);
      newUserList.addOne(newOwnerUser.id, newOwnerUser);
      const ownerLog = newLogger.createLog(
        LOGTYPE.ERROR,
        newOwnerUser.id,
        "OWNER"
      );
      function error() {
        newLogger.deleteLog(newAdmin.id, ownerLog.id);
      }
      expect(error).toThrow();
    });
    it("deleting a log by BASIC level user", () => {
      newUserList.addOne(newBasicUser.id, newBasicUser);
      function error() {
        newLogger.deleteLog(newBasicUser.id, createdLog.id);
      }
      expect(error).toThrow();
    });
  });
});
