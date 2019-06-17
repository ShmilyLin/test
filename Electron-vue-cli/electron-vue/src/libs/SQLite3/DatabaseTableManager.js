const { GetObjectColumnSQLString } = require('./util');

class DatabaseTableQueryWhereManager {
    constructor(columnName, columsType, SQLManager) {
        this.columnName = columnName;
        this.columsType = columsType;

        this.SQLManager = SQLManager;
    }

    like(queryString) {
        this.SQLManager(`${this.columnName} LIKE '${queryString}'`);
    }

    glob(queryString) {
        this.SQLManager(`${this.columnName} GLOB '${queryString}'`);
    }

    in(queryArray) {
        if (queryArray.length > 0) {
            var tempSQLString = "";
            var tempSQLParams = [];
            for (var i = 0; i < queryArray.length; i++) {
                if (i > 0) {
                    tempSQLString += ",";
                }

                tempSQLString += "?";
                tempSQLParams.push(queryArray[i]);
            }

            this.SQLManager(`${this.columnName} IN (${tempSQLString})`, tempSQLParams);
        }
    }

    notIn(queryArray) {
        if (queryArray.length > 0) {
            var tempSQLString = "";
            var tempSQLParams = [];
            for (var i = 0; i < queryArray.length; i++) {
                if (i > 0) {
                    tempSQLString += ",";
                }

                tempSQLString += "?";
                tempSQLParams.push(queryArray[i]);
            }

            this.SQLManager(`${this.columnName} NOT IN (${tempSQLString})`, tempSQLParams);
        }
    }

    between() {
        if (arguments.length === 2) {
            this.SQLManager(`${this.columnName} BETWEEN ${arguments[0]} AND ${arguments[1]}`);
        }
    }

    notBetween() {
        if (arguments.length === 2) {
            this.SQLManager(`${this.columnName} NOT BETWEEN ${arguments[0]} AND ${arguments[1]}`);
        }
    }

    isNull() {
        this.SQLManager(`${this.columnName} IS NULL`);
        
    }

    isNotNull() {
        this.SQLManager(`${this.columnName} IS NOT NULL`);
    }

    // 大于
    greater(value) {
        this.SQLManager(`${this.columnName} > ?`, [value]);
    }

    // 大于等于
    greaterOrEqual(value) {
        this.SQLManager(`${this.columnName} >= ?`, [value]);
    }

    // 小于
    less(value) {
        this.SQLManager(`${this.columnName} < ?`, [value]);
    }

    // 小于等于
    lessOrEqual(value) {
        this.SQLManager(`${this.columnName} <= ?`, [value]);
    }

    // 等于
    equal(value) {
        this.SQLManager(`${this.columnName} == ?`, [value]);
    }

    // 不等于
    notEqual(value) {
        this.SQLManager(`${this.columnName} != ?`, [value]);
    }
}

class DatabaseTableManager {
    constructor(filename, tablename, columns) {
        this.filename = filename;

        this.tablename = tablename; // 表名
        this.columns = columns; // 列信息

        this.createTableSQL = null;

        this.database = null;
    }

    _init(complete) {
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
                            tempColumnString += (" " + GetObjectColumnSQLString(tempKey, tempColumn));
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
                if (complete) {
                    complete(error);
                }
            }else {
                console.log(this.filename + "执行创建表" + this.tablename + "的SQL成功");
                if (complete) {
                    complete();
                }
            }
        });

        // this.Find({
        //     // distinct: false,
        //     where: [{

        //     }],
        //     // offset: 0,
        //     // limit: 1,
        //     // groupby: {
        //     //     key: "",
        //     //     having: 
        //     // },
        //     // orderby: {
        //     //     keys: [""],
        //     //     ASC: true,
        //     // },
        // }, () => {

        // })
    }

    _exec(params) {
        return new Promise((resolve, reject) => {
            var tempSQLString = "SELECT ";
            var tempSQLParams = [];
            if (params._distinct) {
                tempSQLString += "DISTINCT";
            }

            if (params._columns && params._columns.length > 0) {
                var tempColumnsString = "";
                for (var tempColumItem in params._columns) {
                    if (tempColumnsString.length > 0) {
                        tempColumnsString += ",";
                    }

                    tempColumnsString += tempColumItem;
                }

                tempSQLString += tempColumnsString;
            }else {
                tempSQLString += "*";
            }

            tempSQLString += (" " + params._SQLList);
            if (params._where && params._where.length > 0) {
                tempSQLString += params._where;

                if (params._where_params && params._where_params.length > 0) {
                    tempSQLParams = tempSQLParams.concat(params._where_params);
                }
            }

            if (params._limit >= 0) {
                tempSQLString += ` LIMIT ${params._limit}`;
            }

            if (params._offset >= 0) {
                tempSQLString += ` OFFSET ${params._offset}`;
            }

            if (params._groupby && params._groupby.length > 0) {
                var tempGroupString = "";
                for (var gruopbyItem in params._groupby) {
                    if (tempGroupString.length > 0) {
                        tempGroupString += ","
                    }

                    tempGroupString += gruopbyItem;
                }


                tempSQLString += ` GROUP BY ${tempGroupString}`;

                if (params._having && params._having.length > 0) {
                    tempSQLString += ` HAVING ${params._having}`;
                }
            }

            if (params._orderby && params._orderby.length > 0) {
                var tempOrderString = "";
                for (var orderbyItem in params._orderby) {
                    if (tempOrderString.length > 0) {
                        tempOrderString += ","
                    }

                    tempOrderString += orderbyItem;
                }

                tempSQLString += ` ORDER BY ${tempOrderString}`;
                if (params._orderbyasc) {
                    tempSQLString += " ASC";
                }else {
                    tempSQLString += " DESC";
                }
            }

            console.log(this.filename + " " + this.tablename + " Find tempSQLString", tempSQLString);
            this.database.all(tempSQLString, tempSQLParams, (error, rows) => {
                if (error) {
                    console.log(this.filename + " " + this.tablename + " Find fail", error);
                    reject();
                }else {
                    console.log(this.filename + " " + this.tablename + " Find success", rows);
                    var tempList = [];
                    var tempColumnsInfo = this.columns;
                    for (var i = 0; i < rows.length; i++) {
                        var tempResultItem = rows[i];
                        var tempItem = {}
                        for (var tempKey in tempColumnsInfo) {
                            switch (tempColumnsInfo[tempKey].Type) {
                                case Number:
                                case String:
                                    tempItem[tempKey] = tempResultItem[tempKey];
                                    break;
                                case Object:
                                    tempItem[tempKey] = {};
                                    var tempSubColumnsInfo = tempColumnsInfo[tempKey];
                                    for (var tempSubKey in tempSubColumnsInfo) {
                                        switch (tempSubColumnsInfo[tempSubKey].Type) {
                                            case Number:
                                            case String:
                                                tempItem[tempKey].tempSubKey = tempResultItem[`_${tempKey}_${tempSubKey}`];
                                                break;
                                            case Object:
                                                tempItem[tempKey].tempSubKey = JSON.parse(tempResultItem[`_${tempKey}_${tempSubKey}`]);
                                                break;
                                            case Array:
                                                tempItem[tempKey].tempSubKey = JSON.parse(tempResultItem[`_${tempKey}_${tempSubKey}`]).array;
                                                break;
                                            default:
                                                tempItem[tempKey].tempSubKey = tempResultItem[`_${tempKey}_${tempSubKey}`];
                                                break;
                                        }
                                    }
                                    break;
                                case Array:
                                    var tempArray = JSON.parse(tempResultItem[tempKey]);
                                    tempItem[tempKey] = tempArray.array;
                                    break;
                                default:
                                    tempItem[tempKey] = tempResultItem[tempKey];
                                    break;
                            }
                        }
                        

                        tempList.push(tempItem);
                    }

                    resolve(tempList);
                }
            });
        })
    }

    Find() {
        var that = this;
        return {
            _SQLList: `FROM ${that.tablename}`,
            _columns: "",
            _distinct: false,
            _where: "",
            _where_params: [],
            _limit: -1,
            _offset: -1,
            _groupby: [],
            _having: "",
            _orderby: [],
            _orderbyasc: true,
            select: function (column) {
                if (column && column.length > 0) {
                    if (this._colums.length > 0) {
                        this._colums += (", " + column);
                    }else {
                        this._colums += column;
                    }
                }
            },
            distinct: function (status) {
                if (status) {
                    this._distinct = status;
                }
            },
            where: function (callback) {
                if (callback) {
                    var tempSQLs = [];
                    var tempSQLParams = [];
                    var tempSQLManager = function (sqlstring, sqlparams) {
                        if (sqlstring && sqlstring.length > 0) {
                            tempSQLs.push(sqlstring);
                            if (sqlparams && sqlparams.length > 0) {
                                tempSQLParams = tempSQLParams.concat(sqlparams)
                            }
                        }
                    }
                    var tempActions = {};
                    var tempColumns = that.columns;
                    for (var tempKey in tempColumns) {
                        if (tempColumns[tempKey].Type === Object) {
                            tempActions[tempKey] = {};
                            for (var tempSubKey in tempColumns[tempKey].Sub) {
                                tempActions[tempKey][tempSubKey] = new DatabaseTableQueryWhereManager('_' + tempKey + '_' + tempSubKey, tempColumns[tempKey].Sub[tempSubKey].Type, tempSQLManager);
                            }
                        }else if (tempColumns[tempKey].Type !== Array) {
                            tempActions[tempKey] = new DatabaseTableQueryWhereManager(tempKey, tempColumns[tempKey].Type, tempSQLManager);
                        }
                    }

                    tempActions.exec = function () {

                    }

                    tempActions.and = function () {
                        tempSQLs.push("AND");
                    }

                    tempActions.or = function () {
                        tempSQLs.push("OR");
                    }

                    callback(tempActions);
                    console.log("where", tempSQLs, tempSQLParams);

                    var tempSQLQuery = "";
                    var isAnd = true;
                    for (var i = 0; i < tempSQLs.length; i++) {
                        var tempSQLQueryItem = tempSQLs[i];
                        if (tempSQLQueryItem === "AND") {
                            isAnd = true;
                        }else if (tempSQLQueryItem === "OR") {
                            isAnd = false;
                        }else {
                            if (tempSQLQuery.length > 0) {
                                if (isAnd) {
                                    tempSQLQuery += " AND ";
                                }else {
                                    tempSQLQuery += " OR ";
                                    isAnd = true;
                                }
                            }

                            tempSQLQuery += tempSQLQueryItem;
                        }
                    }

                    console.log("tempSQLQuery", tempSQLQuery);
                    this._where = tempSQLQuery;
                    this._where_params = tempSQLParams;
                }
            },
            offset: function (theOffset) {
                this._offset = parseInt(theOffset);
            },
            limit: function (theLimit) {
                this._limit = parseInt(theLimit);
            },
            groupby: function (columns, having) {
                if (having && having.length > 0) {
                    this._having = having;
                }

                if (columns) {
                    if (columns.constructor == Array) {
                        for (var tempColumn in columns) {
                            if (this._groupby.indexOf(tempColumn) < 0) {
                                this._groupby.push(tempColumn);
                            }
                        }
                    }else if (columns.length > 0 && this._groupby.indexOf(columns) < 0) {
                        this._groupby.push(columns);
                    }
                }
            },
            orderby: function (column) {
                if (column && column.length > 0 && this._orderby.indexOf(column) < 0) {
                    this._orderby.push(column);
                }
            },
            done: function () {
                return that._exec(this);
            }
        }
    }
}

export default DatabaseTableManager;