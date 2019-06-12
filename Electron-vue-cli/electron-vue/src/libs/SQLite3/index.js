var sqlite3 = window.require('sqlite3').verbose();


class TransactionManager {
    constructor() {
        this.sqlList = [];
    }

    Exec(sql) {

    }

    Insert() {

    }

    Inserts() {

    }

    Delete() {

    }

    Update() {

    }
}

class DatabaseManager {
    constructor(filename, tablename, columns) {
        this.filename = filename; // 文件名
        this.tablename = tablename; // 表名
        this.columns = columns; // 列信息

        this.createTableSQL = null;
        
        this.database = null;
    }

    CreateDatabase(updateCallBack, completeCallBack) {
        if (!this.database) {
            this.database = new sqlite3.Database(this.filename, (error) => {
                if (error) {
                    console.log("初始化" + this.filename + "数据库失败", error);
                }else {
                    console.log("初始化" + this.filename + "数据库成功");
                    if (updateCallBack) {
                        this.database.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], (error, rows) => {
                            if (error) {
                                console.log("查询" + this.filename + "的表失败", error);
                            }else {
                                console.log("查询" + this.filename + "的表成功", rows);
                                var tempHave = false;
                                for (var i = 0 ; i < rows.length; i++) {
                                    if (rows[i].name === this.tablename) {
                                        tempHave = true;
                                        break;
                                    }
                                }

                                if (tempHave) {
                                    updateCallBack(() => {
                                        this._createTable(completeCallBack);
                                    });
                                }else {
                                    this._createTable(completeCallBack);
                                }
                            }
                        })
                    }else {
                        this._createTable(completeCallBack);
                    }
                }
            });
        }
    }

    _createTable(completeCallBack) {
        if (!this.createTableSQL) {
            var sqlString = `CREATE TABLE IF NOT EXISTS ${this.tablename}(`;
            console.log(this.filename + " CreateDatabase columns", this.columns);
            var tempKeys = Object.keys(this.columns);
            for (var i = 0; i < tempKeys.length; i++) {
                var tempKey = tempKeys[i]
                var tempColumnString = "";
                var tempColumn = this.columns[tempKey];
                console.log(this.filename + " CreateDatabase tempColumn", tempColumn);
                if ("Type" in tempColumn && tempColumn.Type) {
                    switch (tempColumn.Type) {
                        case Number:
                            tempColumnString += `${tempKey} INTEGER`;
                            break;
                        case String:
                            tempColumnString += `${tempKey} TEXT`;
                            break;
                        case Object:
                            tempColumnString += (" " + _getObjectColumnSQLString(tempKey, tempColumn));
                            break;
                        case Array:
                            tempColumnString += `${tempKey} TEXT`;
                            break;
                        default:
                            if (typeof tempColumn.Type === 'string' && tempColumn.Type.length > 0) {
                                tempColumnString += `${tempKey} ${tempColumn.Type.toUpperCase()}`;
                            }else {
                                // TODO: THROW ERROR
                                tempColumnString += `${tempKey} NULL`;
                            }
                            break;
                    }
                }else {
                    tempColumnString += `${tempKey} NULL`;
                }

                if (tempColumn.PrimaryKey) {
                    tempColumnString += " PRIMARY KEY";
                }

                if (tempColumn.AutoIncrement) {
                    tempColumnString += " AUTOINCREMENT";
                }

                if (tempColumn.NotNull) {
                    tempColumnString += " NOT NULL";
                }

                if (tempColumn.Unioue) {
                    tempColumnString += " UNIQUE";
                }

                if (tempColumn.Default) {
                    tempColumnString += " DEFAULT " + tempColumn.Default;
                }

                if (tempColumn.Check && typeof tempColumn.Check === 'string' && tempColumn.Check.length > 0) {
                    tempColumnString += ` CHECK(${tempColumn.Check})`;
                }

                // if (Index) {

                // }
                sqlString += tempColumnString;
                if (i < tempKeys.length - 1) {
                    sqlString += ",";
                }
            }

            sqlString += ");";

            this.createTableSQL = sqlString;
            console.log(this.filename + " CreateDatabase sqlString", sqlString);
        }


        this.database.exec(this.createTableSQL, (error) => {
            if (error) {
                console.log(this.filename + "执行创建表" + this.tablename + "的SQL失败", error);
            }else {
                console.log(this.filename + "执行创建表" + this.tablename + "的SQL成功");
                if (completeCallBack) {
                    completeCallBack();
                }
            }
        });
    }

    _createASubtable() {

    }

    Transaction(sqlCallback) {
        if (sqlCallback) {
            var tempStatementDealManager = new TransactionManager();
            try {
                sqlCallback(tempStatementDealManager);
            }catch (sqlError) {
                console.log("SQL Transaction exec error", sqlError);
                return;
            }

            // this.CreateDatabase();
            // this.database.exec("BEGIN TRANSACTION", (beginError) => {
            //     if (!beginError) {
                    
            //     }else {
            //         console.log("SQL Transaction begin error", beginError);
            //     }
            // });
        }
    }

    Find() {

    }
}

function _getObjectColumnSQLString(name, theObject) {
    var tempStr = "";
    if (theObject.Sub) {
        var tempKeys = Object.keys(theObject.Sub);
        for (var i = 0; i < tempKeys.length; i++) {
            var tempItemKey = tempKeys[i];
            var tempItem = theObject.Sub[tempItemKey];
            tempStr += `_${name}_${tempItemKey}`;

            if ("Type" in tempItem && tempItem.Type) {
                switch (tempItem.Type) {
                    case Number:
                        tempStr += " INTEGER";
                        if (tempItem.AutoIncrement) {
                            tempStr += " AUTOINCREMENT";
                        }
                        break;
                    case String:
                    case Object:
                    case Array:
                        tempStr += " TEXT";
                        break;
                    default:
                        if (typeof tempItem.Type === 'string' && tempItem.Type.length > 0) {
                            tempStr += ` ${tempItem.Type.toUpperCase()}`;

                            if (tempItem.AutoIncrement) {
                                tempStr += " AUTOINCREMENT";
                            }
                        }else {
                            // TODO: THROW ERROR
                            tempStr += " NULL";
                        }
                        break;
                }
            }else {
                tempStr += ` NULL`;
            }

            if (tempItem.PrimaryKey) {
                tempStr += " PRIMARY KEY";
            }

            if (tempItem.NotNull) {
                tempStr += " NOT NULL";
            }

            if (tempItem.Unioue) {
                tempStr += " UNIQUE";
            }

            if (tempItem.Default) {
                tempStr += " DEFAULT " + tempItem.Default;
            }

            if (tempItem.Check && typeof tempItem.Check === 'string' && tempItem.Check.length > 0) {
                tempStr += ` CHECK(${tempItem.Check})`;
            }

            // if (Index) {

            // }

            if (i < tempKeys.length - 1) {
                tempStr += ",";
            }
        }
    }

    return tempStr;
}

export default DatabaseManager;