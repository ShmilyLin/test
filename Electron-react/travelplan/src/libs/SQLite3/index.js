var sqlite3 = window.require('sqlite3').verbose();
import TransactionTableManager from './TransactionTableManager';
import TransactionManager from './TransactionManager';
import DatabaseTableManager from './DatabaseTableManager';


class DatabaseManager {
    constructor(filename) {
        this._filename = filename; // 文件名

        this._tables = {};
        
        this._database = null;

        this._Events = {};
    }

    On(eventname, callback) {
        if (!this._Events[eventname]) {
            this._Events[eventname] = [callback];
        }else {
            if (this._Events[eventname].indexOf(callback) < 0) {
                this._Events[eventname].push(callback);
            }
        }
    }

    Once(eventname, callback) {
        var tempEventName = eventname + '_once';
        console.log("【Database Manager】 Once", tempEventName);
        if (!this._Events[tempEventName]) {
            this._Events[tempEventName] = [callback];
        }else {
            if (this._Events[tempEventName].indexOf(callback) < 0) {
                this._Events[tempEventName].push(callback);
            }
        }

        console.log("【Database Manager】 Once", this._Events);
    }

    Off(eventname, callback) {
        if (this._Events[eventname]) {
            if (callback) {
                var tempIndex = this._Events[eventname].indexOf(callback);
                if (tempIndex >= 0) {
                    this._Events[eventname].splice(tempIndex, 1);
                }
            }else {
                this._Events[eventname] = [];
            }
        }

        var tempOnceEventName = eventname + '_once';
        if (this._Events[tempOnceEventName]) {
            if (callback) {
                var tempOnceIndex = this._Events[tempOnceEventName].indexOf(callback);
                if (tempOnceIndex >= 0) {
                    this._Events[tempOnceEventName].splice(tempOnceIndex, 1);
                }
            }else {
                this._Events[tempOnceEventName] = [];
            }
        }
    }

    _done(eventname, params) {
        console.log("【Database Manager】 _done", this._Events);
        if (this._Events[eventname]) {
            console.log("【Database Manager】 _done", eventname, this._Events[eventname]);
            var tempEvents = this._Events[eventname];
            for (var i = 0; i < tempEvents.length; i++) {
                tempEvents[i](params);
            }
        }

        var tempOnceEventName = eventname + '_once';
        if (this._Events[tempOnceEventName]) {
            console.log("【Database Manager】 _done", tempOnceEventName, this._Events[tempOnceEventName]);
            var tempOnceEvents = this._Events[tempOnceEventName];
            for (var j = 0; j < tempOnceEvents.length; j++) {
                tempOnceEvents[j](params);
            }

            this._Events[tempOnceEventName] = [];
        }
    }

    CreateTable(tablename, columns, complete) {
        tablename = tablename.toUpperCase();
        this._tables[tablename] = new DatabaseTableManager(this._filename, tablename, columns);
        this[tablename] = this._tables[tablename];
        this.CreateDatabase(null, (error) => {
            if (error) {
                if (complete) {
                    complete(error);
                }
            }else {
                this[tablename].database = this._database;
                this[tablename]._init((error) => {
                    complete(error);
                    if (!error) {
                        this._done(tablename + "_ready");
                    }
                });
            }
        });
    }

    CreateDatabase(updateCallBack, completeCallBack) {
        if (!this._database) {
            this._database = new sqlite3.Database(this._filename, (error) => {
                if (error) {
                    console.log("初始化" + this._filename + "数据库失败", error);
                    if (completeCallBack) {
                        completeCallBack(error);
                    }
                }else {
                    console.log("初始化" + this._filename + "数据库成功");
                    if (this._tables) {
                        for (var tempKey in this._tables) {
                            this._tables[tempKey].database = this._database;
                        }
                    }
                    if (updateCallBack) {
                        this._database.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], (sqlerror, rows) => {
                            if (sqlerror) {
                                console.log("查询" + this._filename + "的表失败", sqlerror);
                                if (completeCallBack) {
                                    completeCallBack(sqlerror);
                                }
                            }else {
                                console.log("查询" + this._filename + "的表成功", rows);
                                if (rows && rows.length > 0) {
                                    updateCallBack(() => {
                                        if (completeCallBack) {
                                            completeCallBack();
                                        }
                                    });
                                }else {
                                    if (completeCallBack) {
                                        completeCallBack();
                                    }
                                }
                            }
                        })
                    }else {
                        if (completeCallBack) {
                            completeCallBack();
                        }
                    }
                }
            });
        }else {
            if (completeCallBack) {
                completeCallBack();
            }
        }
    }

    _createASubtable() {

    }

    Transaction(sqlCallback, complete) {
        if (sqlCallback) {
            var tempStatementDealManager = new TransactionManager();
            for (var tempKey in this._tables) {
                tempStatementDealManager[tempKey] = new TransactionTableManager(tempKey);
                tempStatementDealManager[tempKey]._parent = tempStatementDealManager;
            }

            try {
                sqlCallback(tempStatementDealManager);
                console.log(this._filename + " Transaction get over", tempStatementDealManager);
                var tempSQLString = "";
                var tempSQLParams = [];
                console.log(tempStatementDealManager._sqlList.length);
                for (var i = 0; i < tempStatementDealManager._sqlList.length; i++) {
                    var tempSQLItem = tempStatementDealManager._sqlList[i];
                    var tempSQLItemString = "";
                    if (this._tables[tempSQLItem.name]) {
                        var tempColumnsInfo = this._tables[tempSQLItem.name].columns;
                        console.log("tempColumnsInfo", tempColumnsInfo);
                        if (tempSQLItem.type === 0) {

                        }else if (tempSQLItem.type === 1) { // Insert
                            tempSQLItemString += `INSERT INTO ${tempSQLItem.name}`

                            var tempKeyString = "";
                            var tempValueString = "";
                            for (var tempColumKey in tempColumnsInfo) {
                                if (tempSQLItem.content[tempColumKey]) {
                                    
                                    if (tempColumnsInfo[tempColumKey].Type === String) {
                                        tempKeyString += `${tempColumKey},`;
                                        tempValueString += `?,`;
                                        tempSQLParams.push(tempSQLItem.content[tempColumKey]);
                                    }else if (tempColumnsInfo[tempColumKey].Type === Object) {
                                        console.log(tempColumKey, "Object");
                                        for (var tempSaveSubObjectKey in tempColumnsInfo[tempColumKey].Sub) {
                                            if (tempSQLItem.content[tempColumKey][tempSaveSubObjectKey]) {
                                                var tempSaveSubObject = tempColumnsInfo[tempColumKey].Sub[tempSaveSubObjectKey];
                                                console.log("tempSaveSubObject", tempSaveSubObject);
                                                tempKeyString += `_${tempColumKey}_${tempSaveSubObjectKey},`;
                                                tempValueString += `?,`;
                                                if (tempSaveSubObject.Type === String) {
                                                    tempSQLParams.push(tempSQLItem.content[tempColumKey][tempSaveSubObjectKey]);
                                                }else if (tempSaveSubObject.Type === Object) {
                                                    tempSQLParams.push(JSON.stringify(tempSQLItem.content[tempColumKey][tempSaveSubObjectKey]));
                                                }else if (tempSaveSubObject.Type === Array) {
                                                    tempSQLParams.push(JSON.stringify({
                                                        array: tempSQLItem.content[tempColumKey][tempSaveSubObjectKey]
                                                    }));
                                                }else {
                                                    tempSQLParams.push(tempSQLItem.content[tempColumKey][tempSaveSubObjectKey]);
                                                }
                                            }
                                        }
                                    }else if (tempColumnsInfo[tempColumKey].Type === Array) {
                                        tempKeyString += `${tempColumKey},`;
                                        tempValueString += `?,`;
                                        tempSQLParams.push(JSON.stringify({
                                            array: tempSQLItem.content[tempColumKey]
                                        }));
                                    }else {
                                        tempKeyString += `${tempColumKey},`;
                                        tempValueString += `?,`;
                                        tempSQLParams.push(tempSQLItem.content[tempColumKey]);
                                    }
                                }else {
                                    if (!tempColumnsInfo[tempColumKey].AutoIncrement) {
                                        tempKeyString += `${tempColumKey},`;
                                        tempValueString += `NULL,`;
                                    }
                                }
                            }

                            if (tempKeyString.length > 0) {
                                tempKeyString = tempKeyString.substring(0, tempKeyString.length - 1);
                            }

                            if (tempValueString.length > 0) {
                                tempValueString = tempValueString.substring(0, tempValueString.length - 1);
                            }

                            tempSQLItemString += ` (${tempKeyString}) VALUES (${tempValueString});`
                        }else if (tempSQLItem.type === 2) {

                        }else if (tempSQLItem.type === 3) {

                        }
                    }
                    
                    tempSQLString += tempSQLItemString;
                }

                console.log("SQL Transaction SQL tempSQLString", tempSQLString, tempSQLParams);
                this._database.exec("BEGIN TRANSACTION;", (transactionerror) => {
                    if (transactionerror) {
                        console.log("Transaction begin fail", transactionerror);
                        if (complete) {
                            complete(transactionerror);
                        }
                    }else {
                        console.log("Transaction begin success");
                        var that = this;
                        this._database.run(tempSQLString, tempSQLParams, function (runerror) {
                            if (runerror) {
                                console.log("Transaction run fail", runerror);
                                that._database.exec("ROLLBACK;", (rollbackerror) => {
                                    if (rollbackerror) {
                                        console.log("Transaction rollback fail", rollbackerror);
                                        if (complete) {
                                            complete(rollbackerror);
                                        }
                                    }else {
                                        console.log("Transaction rollback success");
                                        if (complete) {
                                            complete(runerror);
                                        }
                                    }
                                })
                            }else {
                                console.log("Transaction run success", this);
                                that._database.exec("END TRANSACTION;", (transactionenderror) => {
                                    if (transactionenderror) {
                                        console.log("Transaction end fail", transactionenderror);
                                        if (complete) {
                                            complete(transactionenderror);
                                        }
                                    }else {
                                        console.log("Transaction end success");
                                        if (complete) {
                                            complete();
                                        }
                                    }
                                })
                            }
                        })
                    }
                });
            }catch (sqlError) {
                console.log("SQL Transaction exec error", sqlError);
                return;
            }
        }
    }

    Find() {

    }
}



export default DatabaseManager;