import { Log, LogId } from "./Log";
import { LogType } from "./LogType";
import { NUMBER_LEVEL_TO_ROLE_MAPPER, USERS_TYPE, User, UserId } from "./User";
import { clock } from "./Clock";
import { IUserList, UserList } from "./UserList";
import { ILogList, LogList } from "./LogList";

interface ILogger {
  createLog(log: LogType, userId: UserId, message: string): Log;
  deleteLog(userId: UserId, logId: LogId): void;
  showLog(userId: UserId, logId: LogId): Log;
  showAllLogsWithUserLevel(userId: UserId): Log[];
  deleteAllLogsWithUserLevel(userId: UserId): void;
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
    this.isUserBasic(userId);
    this.isPermissionMet(userId, logId);
    this.logList.deleteOne(logId, userId);
  }

  showLog(userId: UserId, logId: LogId): Log {
    this.isUserInBase(userId);
    this.isPermissionMet(userId, logId);
    return this.logList.getOne(logId);
  }

  showAllLogsWithUserLevel(userId: UserId): Log[] {
    this.isUserInBase(userId);
    const logs: Log[] = [];
    const user = this.userList.list.get(userId);
    this.logList.list.forEach((element) => {
      const logCreator = this.userList.list.get(element.createdBy);
      if (logCreator.roleLevel <= user.roleLevel) {
        logs.push(element);
      }
    });
    return logs;
  }

  deleteAllLogsWithUserLevel(userId: UserId): void {
    this.isUserInBase(userId);
    const user = this.userList.list.get(userId);
    this.logList.list.forEach((element) => {
      const logCreator = this.userList.list.get(element.createdBy);
      if (logCreator.roleLevel <= user.roleLevel) {
        this.deleteLog(userId, element.id);
      }
    });
  }

  private isUserBasic(userId: UserId): void {
    const user = this.userList.list.get(userId);
    if (user.roleLevel === USERS_TYPE.BASIC) {
      throw new Error("You can't delete a log with BASIC level");
    }
  }

  private isUserInBase(userId: UserId): void {
    this.userList.getOne(userId);
  }

  private isPermissionMet(userId: UserId, logId: LogId): string {
    const user = this.userList.getOne(userId);
    const createdLog = this.logList.getOne(logId);
    const logCreator = this.userList.getOne(createdLog.createdBy);
    if (user.roleLevel >= logCreator.roleLevel) {
      return "Permission granted";
    }
    throw new Error(
      `Permission denied for ${
        user.role
      }, please contact someone with at least ${
        NUMBER_LEVEL_TO_ROLE_MAPPER[logCreator.roleLevel]
      } level.`
    );
  }
}
