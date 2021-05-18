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



class Collection {
    static map (array, key = 'id') {
        return array.reduce((accumulator, item) => {
            accumulator[item[key]] = item;
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

        this[`removeBy${this._primaryKey}`] = this.removeByKey;
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
        return this[this._name] = Collection.map(value, this._primaryKey);
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

    remove (callback) {
        const data = {};
        let iterator = 0;
        for (const key in this[this._name]) {
            const item = this[this._name][key];
            if (!callback(item, key, iterator)) data[key] = item;
            iterator++;
        }

        this[this._name] = data;

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
        let iterator = 0;
        for (const key in this[this._name]) {
            const item = this[this._name][key];
            callback(item, key, iterator)
            iterator++;
        }
        return this;
    }

    find (callback) {
        let iterator = 0;
        for (const key in this[this._name]) {
            const item = this[this._name][key];
            if (callback(item, key, iterator)) return item;
            iterator++;
        }

        return undefined;
    }

    filter (callback) {
        const data = {};
        let iterator = 0;

        for (const key in this[this._name]) {
            const item = this[this._name][key];
            if (callback(item, key, iterator)) data[key] = item;
            iterator++;
        }

        return data;
    }

    count (callback) {
        let countItem = 0;
        let iterator = 0;

        for (const key in this[this._name]) {
            const item = this[this._name][key];
            if (callback(item, key, iterator)) countItem++;
            iterator++;
        }

        return countItem;
    }
}

const usersCollection = new Collection('users', users, 'id');
usersCollection.add({id: 1, name: 'dsa'});

usersCollection.forEach((item, key, iterator) => console.log(item));



// console.log(usersCollection);

// console.log(usersCollection);
// usersCollection.type = 'ass';
// console.log(usersCollection);
// usersCollection.array = [{ id: 'as', name: 'aa'}];
// console.log(usersCollection);
// console.log(Collection.collections.users);

// Object.keys()
