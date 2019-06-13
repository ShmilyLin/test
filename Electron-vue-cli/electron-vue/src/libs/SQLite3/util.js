function GetObjectColumnSQLString(name, theObject) {
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

export {
    GetObjectColumnSQLString
}