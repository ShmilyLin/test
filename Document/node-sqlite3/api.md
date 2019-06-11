# API

https://github.com/mapbox/node-sqlite3/wiki/API#databaseconfigureoption-value

* Main
    * new sqlite3.Database(filename, [mode], [callback])
    * sqlite3.verbose()
* Database
    * Database#close([callback])
    * Database#configure(option, value)
    * Database#run(sql, [param, ...], [callback])
    * Database#get(sql, [param, ...], [callback])
    * Database#all(sql, [param, ...], [callback])
    * Database#each(sql, [param, ...], [callback], [complete])
    * Database#exec(sql, [callback])
    * Database#prepare(sql, [param, ...], [callback])
* Statement
    * Statement#bind([param, ...], [callback])
    * Statement#reset([callback])
    * Statement#finalize([callback])
    * Statement#run([param, ...], [callback])
    * Statement#get([param, ...], [callback])
    * Statement#all([param, ...], [callback])
    * Statement#each([param, ...], [callback], [complete])

# Main
## new sqlite3.Database(filename, [mode], [callback])

返回一个新的数据库对象，并自动打开这个数据库。没有单独打开数据库的方法。

* `filename`：有效值是文件名，":memory:"表示匿名存在内存中的数据库，空字符串表示匿名于磁盘的数据库。匿名数据库不会被持久化，关闭数据库句柄时，其内容将会丢失。

* `mode`（可选参数）：`sqlite3.OPEN_READONLY`、`sqlite3.OPEN_READWRITE`和`sqlite3.OPEN_CREATE`三个值的其中一个或多个。默认值是`OPEN_READWRITE | OPEN_CREATE`。

* `callback`（可选参数）：如果提供这个参数，将会在成功打开数据库或打开数据库发生错误时调用此函数。调用函数时，第一个参数时错误信息的对象，如果为`null`，则表示打开数据库成功。如果未提供回调并且发生错误，则`error`事件将会以错误对象的形式，作为数据库对象中唯一的参数返回。如果打开数据库成功，无论是否提供回调，都会触发不带参数的`open`事件。

## sqlite3.verbose()

将执行模式设置为verbose以生成长堆栈跟踪。没有办法重置这个。有关更多信息，请参阅有关[调试](https://github.com/developmentseed/node-sqlite3/wiki/Debugging)的Wiki页面。

# Database

## Database#close([callback])

关闭数据库。

callback (optional): If provided, this function will be called when the database was closed successfully or when an error occurred. The first argument is an error object. When it is null, closing succeeded. If no callback is provided and an error occurred, an error event with the error object as the only parameter will be emitted on the database object. If closing succeeded, a close event with no parameters is emitted, regardless of whether a callback was provided or not.
Database#configure(option, value)
Set a configuration option for the database. Valid options are:

Tracing & profiling
trace: provide a function callback as a value. Invoked when an SQL statement executes, with a rendering of the statement text.
profile: provide a function callback. Invoked every time an SQL statement executes.
busyTimeout: provide an integer as a value. Sets the busy timeout.
Database#run(sql, [param, ...], [callback])
Runs the SQL query with the specified parameters and calls the callback afterwards. It does not retrieve any result data. The function returns the Database object for which it was called to allow for function chaining.

sql: The SQL query to run. If the SQL query is invalid and a callback was passed to the function, it is called with an error object containing the error message from SQLite. If no callback was passed and preparing fails, an error event will be emitted on the underlying Statement object.

param, ... (optional): When the SQL statement contains placeholders, you can pass them in here. They will be bound to the statement before it is executed. There are three ways of passing bind parameters: directly in the function's arguments, as an array, and as an object for named parameters. This automatically sanitizes inputs RE: issue #57.

In case you want to keep the callback as the 3rd parameter, you should set param to "[]" ( Empty Array ) as per issue #116

      // Directly in the function arguments.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2);

      // As an array.
      db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

      // As an object with named parameters.
      db.run("UPDATE tbl SET name = $name WHERE id = $id", {
          $id: 2,
          $name: "bar"
      });
Named parameters can be prefixed with :name, @name and $name. We recommend using $name since JavaScript allows using the dollar sign as a variable name without having to escape it. You can also specify a numeric index after a ? placeholder. These correspond to the position in the array. Note that placeholder indexes start at 1 in SQLite. node-sqlite3 maps arrays to start with one so that you don't have to specify an empty value as the first array element (with index 0). You can also use numeric object keys to bind values. Note that in this case, the first index is 1:

      db.run("UPDATE tbl SET name = ?5 WHERE id = ?", {
          1: 2,
          5: "bar"
      });
This binds the first placeholder ($id) to 2 and the placeholder with index 5 to "bar". While this is valid in SQLite and node-sqlite3, it is not recommended to mix different placeholder types.

If you use an array or an object to bind parameters, it must be the first value in the bind arguments list. If any other object is before it, an error will be thrown. Additional bind parameters after an array or object will be ignored.

callback (optional): If given, it will be called when an error occurs during any step of the statement preparation or execution, and after the query was run. If an error occurred, the first (and only) parameter will be an error object containing the error message. If execution was successful, the first parameter is null. The context of the function (the this object inside the function) is the statement object. Note that it is not possible to run the statement again because it is automatically finalized after running for the first time. Any subsequent attempts to run the statement again will fail.

If execution was successful, the this object will contain two properties named lastID and changes which contain the value of the last inserted row ID and the number of rows affected by this query respectively. Note that lastID only contains valid information when the query was a successfully completed INSERT statement and changes only contains valid information when the query was a successfully completed UPDATE or DELETE statement. In all other cases, the content of these properties is inaccurate and should not be used. The .run() function is the only query method that sets these two values; all other query methods such as .all() or .get() don't retrieve these values.

Database#get(sql, [param, ...], [callback])
Runs the SQL query with the specified parameters and calls the callback with the first result row afterwards. The function returns the Database object to allow for function chaining. The parameters are the same as the Database#run function, with the following differences:

The signature of the callback is function(err, row) {}. If the result set is empty, the second parameter is undefined, otherwise it is an object containing the values for the first row. The property names correspond to the column names of the result set. It is impossible to access them by column index; the only supported way is by column name.

Database#all(sql, [param, ...], [callback])
Runs the SQL query with the specified parameters and calls the callback with all result rows afterwards. The function returns the Database object to allow for function chaining. The parameters are the same as the Database#run function, with the following differences:

The signature of the callback is function(err, rows) {}. rows is an array. If the result set is empty, it will be an empty array, otherwise it will have an object for each result row which in turn contains the values of that row, like the Database#get function.

Note that it first retrieves all result rows and stores them in memory. For queries that have potentially large result sets, use the Database#each function to retrieve all rows or Database#prepare followed by multiple Statement#get calls to retrieve a previously unknown amount of rows.

Database#each(sql, [param, ...], [callback], [complete])
Runs the SQL query with the specified parameters and calls the callback once for each result row. The function returns the Database object to allow for function chaining. The parameters are the same as the Database#run function, with the following differences:

The signature of the callback is function(err, row) {}. If the result set succeeds but is empty, the callback is never called. In all other cases, the callback is called once for every retrieved row. The order of calls correspond exactly to the order of rows in the result set.

After all row callbacks were called, the completion callback will be called if present. The first argument is an error object, and the second argument is the number of retrieved rows. If you specify only one function, it will be treated as row callback, if you specify two, the first (== second to last) function will be the row callback, the last function will be the completion callback.

If you know that a query only returns a very limited number of rows, it might be more convenient to use Database#all to retrieve all rows at once.

There is currently no way to abort execution.

Database#exec(sql, [callback])
Runs all SQL queries in the supplied string. No result rows are retrieved. The function returns the Database object to allow for function chaining. If a query fails, no subsequent statements will be executed (wrap it in a transaction if you want all or none to be executed). When all statements have been executed successfully, or when an error occurs, the callback function is called, with the first parameter being either null or an error object. When no callback is provided and an error occurs, an error event will be emitted on the database object.

Note: This function will only execute statements up to the first NULL byte. Comments are not allowed and will lead to runtime errors.

Database#prepare(sql, [param, ...], [callback])
Prepares the SQL statement and optionally binds the specified parameters and calls the callback when done. The function returns a Statement object.

When preparing was successful, the first and only argument to the callback is null, otherwise it is the error object. When bind parameters are supplied, they are bound to the prepared statement before calling the callback.

Statement
Statement#bind([param, ...], [callback])
Binds parameters to the prepared statement and calls the callback when done or when an error occurs. The function returns the Statement object to allow for function chaining. The first and only argument to the callback is null when binding was successful, otherwise it is the error object.

Binding parameters with this function completely resets the statement object and row cursor and removes all previously bound parameters, if any.

Statement#reset([callback])
Resets the row cursor of the statement and preserves the parameter bindings. Use this function to re-execute the same query with the same bindings. The function returns the Statement object to allow for function chaining. The callback will be called after the reset is complete. This action will never fail and will always return null as the first and only callback parameter.

Statement#finalize([callback])
Finalizes the statement. This is typically optional, but if you experience long delays before the next query is executed, explicitly finalizing your statement might be necessary. This might be the case when you run an exclusive query (see section Control Flow). After the statement is finalized, all further function calls on that statement object will throw errors.

Statement#run([param, ...], [callback])
Binds parameters and executes the statement. The function returns the Statement object to allow for function chaining.

If you specify bind parameters, they will be bound to the statement before it is executed. Note that the bindings and the row cursor are reset when you specify even a single bind parameter.

The callback behavior is identical to the Database#run method with the difference that the statement will not be finalized after it is run. This means you can run it multiple times.

Statement#get([param, ...], [callback])
Binds parameters, executes the statement and retrieves the first result row. The function returns the Statement object to allow for function chaining. The parameters are the same as the Statement#run function, with the following differences:

The signature of the callback is function(err, row) {}. If the result set is empty, the second parameter is undefined, otherwise it is an object containing the values for the first row. Like with Statement#run, the statement will not be finalized after executing this function.

Using this method can leave the database locked, as the database awaits further calls to Statement#get to retrieve subsequent rows. To inform the database that you are finished retrieving rows, you should either finalize (with Statement#finalize) or reset (with Statement#reset) the statement.

Statement#all([param, ...], [callback])
Binds parameters, executes the statement and calls the callback with all result rows. The function returns the Statement object to allow for function chaining. The parameters are the same as the Statement#run function, with the following differences:

The signature of the callback is function(err, rows) {}. If the result set is empty, the second parameter is an empty array, otherwise it contains an object for each result row which in turn contains the values of that row. Like with Statement#run, the statement will not be finalized after executing this function.

Statement#each([param, ...], [callback], [complete])
Binds parameters, executes the statement and calls the callback for each result row. The function returns the Statement object to allow for function chaining. The parameters are the same as the Statement#run function, with the following differences:

The signature of the callback is function(err, row) {}. If the result set succeeds but is empty, the callback is never called. In all other cases, the callback is called once for every retrieved row. The order of calls correspond exactly to the order of rows in the result set.

After all row callbacks were called, the completion callback will be called if present. The first argument is an error object, and the second argument is the number of retrieved rows. If you specify only one function, it will be treated as row callback, if you specify two, the first (== second to last) function will be the row callback, the last function will be the completion callback.

Like with Statement#run, the statement will not be finalized after executing this function.

If you know that a query only returns a very limited number of rows, it might be more convenient to use Statement#all to retrieve all rows at once.

There is currently no way to abort execution!

