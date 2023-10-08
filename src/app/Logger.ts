import { Log, LogId } from "./Log";
import { LOGTYPE, LogType } from "./LogType";
import { NUMBER_LEVEL_TO_ROLE_MAPPER, USERS_TYPE, User, UserId } from "./User";
import { clock } from "./Clock";
import { UserList } from "./UserList";
import { LogList } from "./LogList";

interface ILogger {
  userList: UserList;
  logList: LogList;
  createLog(log: LogType, userId: UserId, message: string): void;
  deleteLog(userId: UserId, logId: LogId): void;
  showLog(userId: UserId, logId: LogId): Log;
  showAllLogsWithUserLevel(userId: UserId): Log[];
  deleteAllLogsWithUserLevel(userId: UserId): LogList;
}

export class Logger implements ILogger {
  userList: UserList;
  logList: LogList;
  constructor(userList: UserList, logList: LogList) {
    (this.userList = userList), (this.logList = logList);
  }

  createLog(log: LogType, userId: UserId, message: string): void {
    this.isUserInBase(userId);
    const newLog = new Log(userId, log, message, clock);
    this.logList.addItem(newLog.id, newLog);
  }

  deleteLog(userId: UserId, logId: LogId): void {
    this.isLogAvailable(logId);
    this.isUserInBase(userId);
    this.isUserDeleted(userId);
    this.isPermissionMet(userId, logId);
    this.isLogDeleted(logId);
    const log = this.logList.list.get(logId);
    log.deletedAt = clock();
    log.deletedBy = userId;
  }

  showLog(userId: UserId, logId: LogId): Log {
    this.isUserInBase(userId);
    this.isUserDeleted(userId);
    this.isPermissionMet(userId, logId);
    return this.logList.list.get(logId);
  }

  showAllLogsWithUserLevel(userId: UserId): Log[] {
    this.isUserInBase(userId);
    this.isUserDeleted(userId);
    const Logs: Log[] = [];
    const user = this.userList.list.get(userId);
    const userRoleLevel = user.roleLevel;
    this.logList.list.forEach((element) => {
      const logCreatorLevel = this.userList.list.get(
        element.createdBy
      ).roleLevel;
      if (logCreatorLevel <= userRoleLevel) {
        Logs.push(element);
      }
    });
    if (!Logs.length) {
      throw new Error("There are no logs at your permission level");
    }
    return Logs;
  }

  deleteAllLogsWithUserLevel(userId: UserId): LogList {
    let counter = 0;
    this.isUserInBase(userId);
    const user = this.userList.list.get(userId);
    this.logList.list.forEach((element) => {
      const userRoleLevel = user.roleLevel;
      const logCreatorLevel = this.userList.list.get(
        element.createdBy
      ).roleLevel;
      if (logCreatorLevel <= userRoleLevel && !element.deletedAt) {
        this.deleteLog(userId, element.id);
        counter += 1;
      }
    });
    if (counter === 0) {
      throw new Error("There are no logs at your permission level");
    }
    return this.logList;
  }

  private isLogDeleted(logId: LogId): void {
    if (this.logList.list.get(logId).deletedAt) {
      throw new Error(`Log: ${logId} is already deleted`);
    }
  }

  private isUserInBase(userId: UserId): void {
    if (!this.userList.list.has(userId)) {
      throw new Error("Please type user from our database");
    }
  }

  private isUserDeleted(userId: UserId): void {
    if (this.userList.list.get(userId).deletedAt) {
      throw new Error(`User: ${userId} is already deleted`);
    }
  }

  private isPermissionMet(userId: UserId, logId: LogId): string {
    const user = this.userList.list.get(userId);
    const logCreatorId = this.logList.list.get(logId).createdBy;
    const logCreatorLevel = this.userList.list.get(logCreatorId).roleLevel;
    if (user.roleLevel >= logCreatorLevel) {
      return "Permission granted";
    }
    throw new Error(
      `Permission denied for ${user.role}, please contact someone with at least ${NUMBER_LEVEL_TO_ROLE_MAPPER[logCreatorLevel]} level.`
    );
  }

  private isLogAvailable(logId: LogId): void {
    if (!this.logList.list.has(logId)) {
      throw new Error("This log is not available");
    }
  }
}

// const admin1 = new User(USERS_TYPE.ADMIN, clock);
// const owner1 = new User(USERS_TYPE.OWNER, clock);
// const basic1 = new User(USERS_TYPE.BASIC, clock);
// const newUserList = new UserList();
// newUserList.addItem(admin1.id, admin1);
// newUserList.addItem(basic1.id, basic1);
// newUserList.addItem(owner1.id, owner1);
// const newLogList = new LogList();
// const newLogger = new Logger(newUserList, newLogList);
// newLogger.createLog(LOGTYPE.DEBUG, admin1.id, "ADMIN");
// newLogger.createLog(LOGTYPE.DEBUG, basic1.id, "BASIC");
// newLogger.createLog(LOGTYPE.DEBUG, owner1.id, "OWNER2");

// console.log(newLogger.showAllLogsWithUserLevel(admin1.id));

// // console.dir(newLogger, { depth: null });
