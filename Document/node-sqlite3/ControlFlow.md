#Control Flow

https://github.com/mapbox/node-sqlite3/wiki/Control-Flow

`node-sqlite3`提供了两种方式来帮助控制和执行语句流。默认的模式是并行执行语句。然而，`Database#close`方法将总会运行在独战模式下，意味着它将等待之前所有的查询完成后，并且`node-sqlite3`在运行关闭时不会执行任何其他的查询。

## Database#serialize([callback])

将执行模式设置为串行。这意味着在同一时间一次最多只能有一个语句对象执行查询。其他的语句将在队列中等待，直到前面的语句执行完。

如果提供了回调函数，它将会立刻被触发。所有在回调函数中的数据查询计划将会被顺序执行。在函数返回return后，数据库会重新设置回之前的模式。嵌套调用`Database#serialize()`是安全的：

```javascript
// 这里查询并行执行。

db.serialize(function() {
  // 查询在这里将串行执行。
  db.serialize(function() {
    // 查询在这里将串行执行。
  });
  // 查询在这里将串行执行。
});

// 这里查询并行执行。
```

注意，不在这个回调函数中的查询不一定是串行的：

```javascript
db.serialize(function() {
  // 这里的两个查询是串行的。
  db.run("CREATE TABLE foo (num)");
  db.run("INSERT INTO foo VALUES (?)", 1, function() {
    // 这里的两个查询将是并行的，第二个查询不一定能成功，因为表不一定存在。】
    db.run("CREATE TABLE bar (num)");
    db.run("INSERT INTO bar VALUES (?)", 1);
  });
});
```

如果你不传入参数调用这个函数，执行模式的设置就是长时间有效的，并且在下次调用`Database#parallelize`之前不会更改。

## Database#parallelize([callback])

设置执行模式为并行。

如果传入回调函数，回调函数回被立刻调用。所有在回调函数中的数据查询计划将会被并行执行。在函数返回return后，数据库会重新设置回之前的模式。嵌套调用`Database#parallelize()`是安全的：

```javascript
db.serialize(function() {
   // 查询在这里将串行执行。
   db.parallelize(function() {
     // 这里查询并行执行。
   });
   // 查询在这里将串行执行。
});
```

如果你不传入参数调用这个函数，执行模式的设置就是长时间有效的，并且在下次调用`Database#serialize`之前不会更改。