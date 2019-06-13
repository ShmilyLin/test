class TransactionManager {
    constructor() {
        this._sqlList = [];
    }

    Exec(sql) {

    }

    Insert(name, theObject) {
        this._parent._sqlList.push({
            type: 1,
            name: name,
            content: theObject
        })
    }

    Inserts(name, objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._sqlList.push({
                type: 1,
                name: name,
                content: objects[i]
            })
        }
    }

    Update(name, theObject) {
        this._sqlList.push({
            type: 2,
            name: name,
            content: theObject
        })
    }

    Updates(name, objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._sqlList.push({
                type: 2,
                name: name,
                content: objects[i]
            })
        }
    }

    Delete(name, theObject) {
        this._sqlList.push({
            type: 3,
            name: name,
            content: theObject
        })
    }

    Deletes(name, objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._sqlList.push({
                type: 3,
                name: name,
                content: objects[i]
            })
        }
    }
}

export default TransactionManager;