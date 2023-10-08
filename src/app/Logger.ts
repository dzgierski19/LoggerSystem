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
  showAllLogs(userId: UserId): Log[];
  deleteAllLogs(userId: UserId): LogList;
}

class Logger implements ILogger {
  userList: UserList;
  logList: LogList;
  constructor(userList: UserList, logList: LogList) {
    (this.userList = userList), (this.logList = logList);
  }

  createLog(log: LogType, userId: UserId, message: string): void {
    this.userList.isItemAvailable(userId);
    const newLog = new Log(userId, log, message, clock);
    this.logList.addItem(newLog.id, newLog);
  }

  deleteLog(userId: UserId, logId: LogId): void {
    this.isLogAvailable(logId);
    this.isUserInBase(userId);
    this.isPermissionMet(userId, logId);
    this.isLogDeleted(logId);
    const log = this.logList.list.get(logId);
    log.deletedAt = clock();
    log.deletedBy = userId;
  }

  showLog(userId: UserId, logId: LogId): Log {
    this.isUserInBase(userId);
    this.isPermissionMet(userId, logId);
    return this.logList.list.get(logId);
  }

  showAllLogs(userId: UserId): Log[] {
    this.isUserInBase(userId);
    const Logs: Log[] = [];
    this.logList.list.forEach((element) => {
      if (this.isPermissionMet(userId, element.id)) {
        Logs.push(element);
      }
    });
    if (!Logs.length) {
      throw new Error("There are no logs at your permission level");
    }
    return Logs;
  }

  deleteAllLogs(userId: UserId): LogList {
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

  private isPermissionMet(userId: UserId, logId: LogId): string {
    const user = this.userList.list.get(userId);
    const logCreatorId = this.logList.list.get(logId).createdBy;
    const logCreatorLevel = this.userList.list.get(logCreatorId).roleLevel;
    const logCreatorRole = this.userList.list.get(logCreatorId).role;
    if (user.roleLevel >= logCreatorLevel) {
      return "Permission granted";
    }
    throw new Error(
      `Permission denied for ${user.role}, please contact someone with ${NUMBER_LEVEL_TO_ROLE_MAPPER[logCreatorRole]} level.`
    );
  }

  private isLogAvailable(logId: LogId): void {
    if (!this.logList.list.has(logId)) {
      throw new Error("This log is not available");
    }
  }
}

const admin1 = new User(USERS_TYPE.ADMIN, clock);
const owner1 = new User(USERS_TYPE.OWNER, clock);
const basic1 = new User(USERS_TYPE.BASIC, clock);
const newUserList = new UserList();
newUserList.addItem(admin1.id, admin1);
newUserList.addItem(owner1.id, owner1);
const newLogList = new LogList();
const errorLog1 = new Log(admin1.id, LOGTYPE.ERROR, "test", clock);
newLogList.addItem(errorLog1.id, errorLog1);
const newLogger = new Logger(newUserList, newLogList);
newLogger.createLog(LOGTYPE.DEBUG, admin1.id, "DEBUG");
newLogger.createLog(LOGTYPE.DEBUG, owner1.id, "DEBUG");
newUserList.deleteItem(admin1.id);
newUserList.addItem(basic1.id, basic1);
newUserList.deleteItem(basic1.id);

console.dir(newLogger, { depth: null });
