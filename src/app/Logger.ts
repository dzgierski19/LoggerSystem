import { Log } from "./Log";
import { LOGTYPE } from "./LogType";
import { USERS, User } from "./User";

class Logger {
  logList: Map<string, Log> = new Map();
  deletedLogList: Map<string, Log> = new Map();

  addLog(id: string, log: Log) {
    this.isLogAlreadyInBase(id);
    this.logList.set(id, log);
  }

  deleteLog(user: User, id: string) {
    this.isLogAvailable(id);
    this.isPermissionMet(user, id);
    const log = this.logList.get(id);
    this.deletedLogList.set(id, log);
    this.logList.delete(id);
  }

  showLog(user: User, id: string): Log {
    this.isLogAvailable(id);
    this.isPermissionMet(user, id);
    return this.logList.get(id);
  }

  showAllLogs(user: User) {
    let arr = [];
    let counter = 0;
    this.logList.forEach((element) => {
      if (this.isPermissionMet(user, element.id)) {
        arr.push(element);
        counter += 1;
      }
    });
    if (counter === 0) {
      throw new Error("There are no logs at your permission level");
    }
    return arr;
  }

  deleteAllLogs(user: User) {
    let counter = 0;
    this.logList.forEach((element) => {
      if (user.permissionLevel.includes(element.createdBy)) {
        const log = this.logList.get(element.id);
        this.deletedLogList.set(element.id, log);
        this.logList.delete(element.id);
        counter += 1;
      }
    });
    if (counter === 0) {
      throw new Error("There are no logs at your permission level");
    }
    return this.logList;
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
const newLog2 = new Log(USERS.ADMIN, LOGTYPE.DEBUG);

const newLogger = new Logger();
newLogger.addLog(newLog.id, newLog);
newLogger.addLog(newLog2.id, newLog2);
console.log(newLogger.deleteAllLogs(newUser));
console.log(newLogger.deletedLogList);
