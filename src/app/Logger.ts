import { Log } from "./Log";
import { LOGTYPE } from "./LogType";
import { USERS, User } from "./User";

class Logger {
  logList: Map<string, Log> = new Map();
  //usersList: Map<string, Log> = new Map()

  addLog(id: string, log: Log) {
    this.isLogAlreadyInBase(id);
    this.logList.set(id, log);
  }

  deleteLog(user: User, id: string) {
    this.isLogAvailable(id);
    this.isPermissionMet(user, id);
    this.logList.delete(id);
  }

  showLog(user: User, id: string): Log {
    this.isLogAvailable(id);
    this.isPermissionMet(user, id);
    return this.logList.get(id);
  }

  private isPermissionMet(user: User, logID: string) {
    const logCreator = this.logList.get(logID).createdBy;
    if (user.permissionLevel.includes(logCreator)) {
      return "Permission granted";
    }
    throw new Error("Permission denied");
  }

  private isLogAvailable(id: string) {
    if (!this.logList.has(id)) {
      throw new Error("this log is not available in base");
    }
  }
  private isLogAlreadyInBase(id: string) {
    if (this.logList.has(id)) {
      throw new Error("this log is already in base");
    }
  }
}

const newUser = new User(USERS.ADMIN);

const newLog = new Log(USERS.OWNER, LOGTYPE.ERROR);

const newLogger = new Logger();
newLogger.addLog(newLog.id, newLog);
console.log(newLogger.showLog(newUser, newLog.id));
