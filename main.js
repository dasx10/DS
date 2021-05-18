const users = [
    {
        id: 'asd',
        name: 'john'
    },
    {
        id: 'ore',
        name: 'Klark'
    },
    {
        id: 'asdwas1',
        name: 'mois',
        age: 22
    },
    {
        id: 'asdwads1',
        name: 'moias',
        age: 22
    },

    {
        id: 'a1sd',
        name: 'john1'
    },
    {
        id: 'o1re',
        name: 'Klark1'
    },
    {
        id: 'a1sdwas1',
        name: 'mois1',
        age: 22
    },
    {
        id: 'a1sdwads1',
        name: 'moias',
        age: 22
    }
];

class CollectionItem {
    constructor (item, parent) {
        this.__proto__._parent = parent;
        Object.keys(item).forEach((key) => {
            this[key] = item[key];
        });
    }

    get parent () {
        return this.__proto__._parent;
    }

    remove() {
        this.parent.removeByKey(this[this.parent.primaryKey]);
        return this.parent;
    }
}

class Collection {
    static map (array, key = 'id', parent) {
        return array.reduce((accumulator, item) => {
            accumulator[item[key]] = new CollectionItem(item, parent || this);
            return accumulator;
        }, {});
    }

    static isCollection(property) {
        return property && property.type === 'collection';
    }

    static collections = {};

    constructor (collectionName = 'values', array = [], key = 'id') {
        if (Collection.collections[collectionName]) {
            return Collection.collections[collectionName];
        }
        Collection.collections[collectionName] = this;

        this._name = collectionName;
        this._primaryKey = key;
        this.array = array;
    }

    get type () {
        return 'collection';
    }

    get name () {
        return this._name;
    }

    get primaryKey () {
        return this._primaryKey;
    }

    get array () {
        return Object.values(this[this._name]);
    }

    set array (value) {
        return this[this._name] = Collection.map(value, this.primaryKey, this);
    }

    get keys () {
        return Object.keys(this[this._name]);
    }

    get values () {
        return this[this._name];
    }

    get length () {
        return this.keys.length;
    }

    removeByKey (key) {
        delete this[this._name][key];

        return this;
    }

    add (element) {
        this[this._name] = { [element[this._primaryKey]]: element, ...this[this._name] };

        return this;
    }

    set (element) {
        if (this[this._name][element[this._primaryKey]]) {
            this[this._name][element[this._primaryKey]] = element;
        }
    }

    get (key) {
        return this[this._name][key];
    }

    forEach (callback) {
        let isStop = false;
        const stop = (cb = () => true) => isStop = cb();
        for (const key in this[this._name]) {
            const item = this[this._name][key];
            callback(item, key, stop);
            if (isStop) break;
        }
        return this;
    }

    remove (callback) {
        const data = {};

        this.forEach((item, key, stop) => {
            if (!callback(item, key, stop)) {
                data[key] = item;
                stop();
            }
        });

        this[this._name] = data;

        return this;
    }

    find (callback) {
        let found;

        this.forEach((item, key, stop) => {
            if (callback(item, key, stop)) {
                found = item;
                stop();
            }
        });

        return found;
    }

    filter (callback) {
        const data = {};
        
        this.forEach((item, key, stop) => {
            if (callback(item, key, stop)) data[key] = item;
        });

        return data;
    }

    count (callback) {
        let countItem = 0;
        
        this.forEach((item, key, stop) => {
            if (callback(item, key, stop)) countItem++;
        });

        return countItem;
    }
}

new Collection('users', users, 'id');
Collection.collections.users.add({id: 'aa', remove: 'dsa'});


console.log(Collection.collections.users.values.asd.remove().values.aa.remove());


// console.log(usersCollection);

// console.log(usersCollection);
// usersCollection.type = 'ass';
// console.log(usersCollection);
// usersCollection.array = [{ id: 'as', name: 'aa'}];
// console.log(usersCollection);
// console.log(Collection.collections.users);

// Object.keys()
