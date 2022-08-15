const pool = require('../utils/pool');

class User {
    id;
    email;
    #passwordHash;

    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.#passwordHash = row.password_hash;
    }

    static async insert({ email, passwordHash }) {
        const { rows } = await pool.query(
            'insert into users (email, password_hash) values ($1, $2) returning *',
            [email, passwordHash]
        );

        if (!rows[0]) throw new Error('Unable to create user for unknown reason');

        return new User(rows[0]);
    }

    static async getByEmail(email) {
        const { rows } = await pool.query('select * from users where email = $1', [email]);

        if (!rows[0]) return null;

        return new User(rows[0]);
    }

    get passwordHash() {
        return this.#passwordHash;
    }
}

module.exports.User = User;
