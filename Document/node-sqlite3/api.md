# API

https://github.com/mapbox/node-sqlite3/wiki/API

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

返回一个新的Database对象，并自动打开这个数据库。没有单独打开数据库的方法。

* `filename`：有效值是文件名，":memory:"表示匿名存在内存中的数据库，空字符串表示匿名于磁盘的数据库。匿名数据库不会被持久化，关闭数据库句柄时，其内容将会丢失。

* `mode`（可选参数）：`sqlite3.OPEN_READONLY`、`sqlite3.OPEN_READWRITE`和`sqlite3.OPEN_CREATE`三个值的其中一个或多个。默认值是`OPEN_READWRITE | OPEN_CREATE`。

* `callback`（可选参数）：如果提供这个参数，将会在成功打开数据库或打开数据库发生错误时调用此函数。调用函数时，第一个参数时错误信息的对象，如果为`null`，则表示打开数据库成功。如果未提供回调并且发生错误，则Database对象的`error`事件将会携带一个错误对象被触发。如果打开数据库成功，无论是否提供回调，都会触发不带参数的`open`事件。

## sqlite3.verbose()

将执行模式设置为verbose以生成长堆栈跟踪。没有办法重置这个。有关更多信息，请参阅有关[调试](https://github.com/developmentseed/node-sqlite3/wiki/Debugging)的Wiki页面。

# Database

## Database#close([callback])

关闭数据库。

* `callback`（可选参数）：如果传入了该参数，这个回调函数将会在数据库成功关闭或关闭发生错误的时候被调用，当错误发生的时候，回调函数的第一个参数是一个错误对象；数据库成功的关闭的时候，这个回调函数的参数是`null`。如果没有传入回调函数，并且发生错误的时候，则Database对象的`error`事件将会携带一个错误对象被触发；如果数据库成功关闭，无论是否提供该回调函数参数，Database对象的`close`事件都会不携带参数的被触发。

## Database#configure(option, value)

设置数据库的配置选项。有效选项有：

* [跟踪和分析（tracing & profiling）](https://www.sqlite.org/c3ref/profile.html)
    * 跟踪（trace）：提供一个回调函数作为值。当一个SQL语句执行时被调用，并返回语句文本。
    * 分析（profile）：提供一个回调函数作为值。每次执行SQL语句时都会调用。
* 繁忙超时时间（busyTimeout）：提供一个int值。设置繁忙超时时间。

## Database#run(sql, [param, ...], [callback])

运行带有指定参数的SQL查询，并在之后调用回调函数。这个方法将不会取回任何结果数据。这个方法返回调用它的Database对象以允许函数链式调用。

* `sql`：要运行的SQL查询。如果这个SQL查询是无效的，并且传入了回调函数，则将会调用这个回调，并在回调中返回一个包含来自SQLite的错误信息的错误对象。如果没有传入回调函数并发生错误，底层的Statement对象的`error`事件会被触发。

* `param, ...`（可选参数）：当SQL语句包含占位符，你可以通过这个参数传入它们，它们将在执行之前绑定到该语句。这里有三种方式传入绑定参数：直接通过函数的参数，作为一个数组，或者作为一个对象。This automatically sanitizes inputs RE: [issue #57](https://github.com/mapbox/node-sqlite3/issues/57).

根据[issue #116](https://github.com/mapbox/node-sqlite3/issues/116)，如果你想保持回调函数始终是第三个参数，你需要设置`param`为“`[]`”（空数组）。

```javascript
    // 直接设置为函数参数。
    db.run("UPDATE tbl SET name = ? WHERE id = ?", "bar", 2);

    // 作为一个数组。
    db.run("UPDATE tbl SET name = ? WHERE id = ?", [ "bar", 2 ]);

    // 作为一个对象。
    db.run("UPDATE tbl SET name = $name WHERE id = $id", {
        $id: 2,
        $name: "bar"
    });
```

作为对象时，命名参数可以带有这些前缀：`:name`，`@name`和`$name`。自从JavaScript允许美元符号作为变量符号而不用转义之后，我们推荐使用`$name`。你也可以在`?`占位符之后指定一个数字索引，这些索引对应数组中的指定位置，_注意占位符索引在SQLite中从1开始_。`node-sqlite3`会自动将数组映射为从1开始，所以你不需要在数组中指定开始位置的元素为空了。你也可以在对象中使用数字key来绑定值，注意如果这样做，开始的索引也是`：

```javascript
    db.run("UPDATE tbl SET name = ?5 WHERE id = ?", {
        1: 2,
        5: "bar"
    });
```

这里绑定第一个占位符（`$id`）为`2`，第五个占位符为`"bar"`。这在SQLite和`node-sqlite3`中都是有效的，这里不推荐混合使用不同的占位符类型。

如果你使用一个数组或一个对象来绑定参数，则必须是绑定参数列表（`[param, ...]`）中的第一个，如果又一个其他的对象在它之前，则会抛出错误。其他的在绑定参数后的数组或对象都会被自动忽略。

* `callback`（可选参数）：如果传入，则查询语句运行起来之后，在语句的准备和执行中发生错误的时候被掉用。如果一个错误发生，回调函数中的唯一的参数是包含了错误信息的错误对象。如果执行成功，回调函数中的参数为`null`。回调函数的上下文（函数中的`this`对象）是Statement对象。注意一旦运行过该语句，就无法再次运行，因为它是在第一运行后自动完成的。人物再次运行该语句的尝试都将失败。
<br/><br/>
如果执行成功，`this`对象将会包含两个属性，为`lastID`和`changes`，分别包含了上一次插入的行的ID以及查询语句结果的行数。注意，当查询语句成功完成`INSERT`语句时`lastID`包含有效的信息，当查询语句成功完成`UPDATE`或`DELETE`语句时`changes`包含有效的信息。所有的其他情况，这两个属性的值都是不准确的，不应该被使用。`.run()`方法是唯一的可以获取这两个值的查询方法，其他的查询方法，例如`.all()`或`.get()`都不会检索这两个值。

## Database#get(sql, [param, ...], [callback])

运行带有指定参数的SQL查询，并在之后调用回调函数传回结果的第一行。这个方法返回Database对象以允许函数链式调用。这个函数的参数和`Database#run`函数的参数基本一样，只有以下不同：

回调函数的样子是`function(err, row) {}`。如果结果为空，第二个参数为`undefined`。否则是一个包含了第一行值的对象。这个对象的属性名（key）对应结果集合的列名。不可以通过列的索引值访问它们，只能通过列名访问。

## Database#all(sql, [param, ...], [callback])

运行带有指定参数的SQL查询，并在之后调用回调函数传回所有结果。这个方法返回Database对象以允许函数链式调用。这个函数的参数和`Database#run`函数的参数基本一样，只有以下不同：

回调函数的样子是`function(err, rows) {}`，`rows`是一个数组。如果结果为空，第二个参数为`undefined`，否则它将为每一行结果提供一个对象，该对象包含了该行的值，类似`Database#get`方法。

注意，第一次收到所有结果时它们是存储在内存中的。查询结果可能是相当大的集合，使用`Database#each`方法接收所有结果或者`Database#prepare`followed by multiple `Statement#get` calls to retrieve a previously unknown amount of rows.

## Database#each(sql, [param, ...], [callback], [complete])

运行带有指定参数的SQL查询，并在之后为每一行结果调用一次`callback`回调函数传回数据。这个方法返回Database对象以允许函数链式调用。这个函数的参数和`Database#run`函数的参数基本一样，只有以下不同：

回调函数的样子是`function(err, row) {}`。如果查询成功但是结果为空，`callback`回调函数永远不会被调用。其他情况下，`callback`回调函数会为每一行回调一次，调用顺序与结果集中的行顺序完全对应。

所有行的回调结束之后，如果`complete`回调函数存在则将会被调用。`complete`回调函数的第一个参数是错误对象，第二个参数是接收到的数据的行数。如果你只传入了一个回调函数，它将被视为行的`callback`回调函数；如果你传入了两个，第一个回调函数将是行的`callback`回调函数，剩下一个将是`complete`回调函数。

如果你知道这个查询只会返回很少数量的结果，可以使用`Database#all`一次接收所有结果。

这个函数目前无法终止执行。

## Database#exec(sql, [callback])

运行所有的SQL查询。不返回结果。这个方法返回Database对象以允许函数链式调用。如果其中一个查询失败，将不会运行下面的所有语句（如果你想要执行全部或全部不执行，请将其包装在事务中）。当所有的语句都执行成功，或者又一个错误发生的时候，回调函数会被调用，回调函数的第一个参数是`null`或者是一个错误对象。当没有设置回调函数并且有错误发生，Database对象的`error`事件会被触发。

注意：这个方法只执行语句直到遇到第一个NULL字节。不允许使用注释，这将导致运行时错误。

## Database#prepare(sql, [param, ...], [callback])

准备SQL语句，如果有设置指定的参数，就将参数绑定到语句中，当所有都准备完毕调用回调函数。这个方法返回一个Statement对象。

当准备成功，回调函数的参数为`null`，否则参数为一个错误对象。当提供绑定参数，它们会在调用回调函数之前绑定到语句中。

# Statement

## Statement#bind([param, ...], [callback])

绑定参数到准备好的语句中，并在绑定完成或绑定发生错误的时候调用回调函数。这个方法返回Statement对象以允许函数链式调用。当绑定成功，回调函数的第一个参数是`null`，否则参数是一个错误对象。

使用此函数绑定参数会完全重置语句对象和行光标，并删除所有先前绑定的参数（如果有的话）。

## Statement#reset([callback])

重置行光标但保留绑定参数。使用这个函数来重新执行有着同样绑定参数的同样的查询。这个函数返回Statement对象以允许函数链式调用。回调函数在重置完成后被调用，这个操作将不会出现失败，回调函数的参数将一直返回`null`。

## Statement#finalize([callback])

完成语句。这通常是可选的，但是如果你在执行下一个语句之前遇到长时间的等待，则可能需要手动调用完成你的语句。当你运行独占查询的时候可能遇到这种情况（请参阅[控制流](./ControlFlow.md)部分）。语句完成后，对该Statement对象的所有下一步操作函数调用都将抛出错误。

## Statement#run([param, ...], [callback])

绑定参数并执行语句。这个函数返回Statement对象以允许函数链式调用。

如果你传入绑定参数，它们将在执行之前绑定到语句中。注意，哪怕你只指定一个绑定参数，也会重置所有绑定和行光标。

回调函数的处理逻辑和`Database#run`方法的基本一样，区别是这个函数执行后语句不会完成，这意味着你可以多次运行它。

## Statement#get([param, ...], [callback])

绑定参数，执行语句并返回结果的第一行数据。这个函数返回Statement对象以允许函数链式调用。这个函数的参数和`Statement#run`方法类似，个别区别如下：

回调函数的样子是`function(err, row) {}`。如果结果集合是空的，第二个回调函数参数`row`是`undefined`，否则`row`是一个包含了第一行数据的对象。和`Statement#run`类似，这个函数执行后语句不会完成。

使用这个方法可以锁定数据库，因为数据库正在等待对`Statement#get`的进一步调用，以检索后续行。要通知数据库你已经完成检索，你应该完成（`Statement#finalize`）或重置（`Statement#reset`）这个语句。

## Statement#all([param, ...], [callback])

绑定参数，执行语句并返回结果的所有数据。这个函数返回Statement对象以允许函数链式调用。这个函数的参数和`Statement#run`方法类似，个别区别如下：

回调函数的样子是`function(err, rows) {}`。如果结果集合是空的，第二个回调函数参数`rows`是一个空的数组，否则`rows`将为每一行结果提供一个对象，该对象包含了该行的值。和`Statement#run`类似，这个函数执行后语句不会完成。

## Statement#each([param, ...], [callback], [complete])

绑定参数，执行语句并为每一行结果调用一次回调函数。这个函数返回Statement对象以允许函数链式调用。这个函数的参数和`Statement#run`方法类似，个别区别如下：

回调函数的样子是`function(err, row) {}`。如果查询结果成功，但是结果为空，回调函数`callback`永远不会被调用。其他情况下，`callback`回调函数会为每一行结果数据调用一次，调用顺序与结果集中的行顺序完全对应。

所有`callback`回调函数调用完成后，如果传入了`complete`回调函数，`complete`回调函数会被调用。`complete`回调函数的第一个参数是一个错误对象，第二个参数是接收的结果数据的总行数。如果你只传入了一个回调函数，那么这个回调函数会被视为`callback`回调函数；如果你传入了两个，那么第一个回调函数是行回调`callback`，另外一个是完成回调`complete`。

和`Statement#run`方法类似，这个函数执行后语句不会完成。

如果你知道一个查询语句只返回一个非常小的数据量，你可以使用`Statement#all`一次性接收所有数据。

这个函数目前无法终止执行。

