import { Log, LogId } from "./Log";
import { LOGTYPE, LogType } from "./LogType";
import { NUMBER_LEVEL_TO_ROLE_MAPPER, USERS_TYPE, User, UserId } from "./User";
import { clock } from "./Clock";
import { IUserList, UserList } from "./UserList";
import { ILogList, LogList } from "./LogList";

interface ILogger {
  createLog(log: LogType, userId: UserId, message: string): Log;
  deleteLog(userId: UserId, logId: LogId): void;
  showLog(userId: UserId, logId: LogId): Log;
  showAllLogsWithUserLevel(userId: UserId): Log[];
  deleteAllLogsWithUserLevel(userId: UserId): ILogList;
}

export class Logger implements ILogger {
  private readonly userList: IUserList;
  private readonly logList: ILogList;
  constructor(userList: UserList, logList: LogList) {
    (this.userList = userList), (this.logList = logList);
  }

  createLog(log: LogType, userId: UserId, message: string): Log {
    this.isUserInBase(userId);
    const newLog = new Log(userId, log, message, clock);
    this.logList.addOne(newLog.id, newLog);
    return newLog;
  }

  deleteLog(userId: UserId, logId: LogId): void {
    this.isUserInBase(userId);
    this.isUserDeleted(userId);
    this.isPermissionMet(userId, logId);
    this.logList.deleteOne(logId, userId);
  }

  showLog(userId: UserId, logId: LogId): Log {
    this.isUserInBase(userId);
    this.isUserDeleted(userId);
    this.isPermissionMet(userId, logId);
    return this.logList.getOne(logId);
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

  deleteAllLogsWithUserLevel(userId: UserId): ILogList {
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
}
