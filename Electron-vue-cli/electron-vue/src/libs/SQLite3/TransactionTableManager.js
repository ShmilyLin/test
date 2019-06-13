class TransactionTableManager {
    constructor(name) {
        this._name = name;
    }

    Insert(theObject) {
        this._parent._sqlList.push({
            type: 1,
            name: this._name,
            content: theObject
        })
    }

    Inserts(objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._parent._sqlList.push({
                type: 1,
                name: this._name,
                content: objects[i]
            })
        }
    }

    Update(theObject) {
        this._parent._sqlList.push({
            type: 2,
            name: this._name,
            content: theObject
        })
    }

    Updates(objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._parent._sqlList.push({
                type: 2,
                name: this._name,
                content: objects[i]
            })
        }
    }

    Delete(theObject) {
        this._parent._sqlList.push({
            type: 3,
            name: this._name,
            content: theObject
        })
    }

    Deletes(objects) {
        for (var i = 0; i < objects.length ; i++) {
            this._parent._sqlList.push({
                type: 3,
                name: this._name,
                content: objects[i]
            })
        }
    }
}

export default TransactionTableManager;