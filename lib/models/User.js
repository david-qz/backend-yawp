const pool = require('../utils/pool');

class User {
    id;
    email;
    #isAdmin;
    #passwordHash;

    constructor(row) {
        this.id = row.id;
        this.email = row.email;
        this.#isAdmin = row.is_admin;
        this.#passwordHash = row.password_hash;
    }

    static async getAll() {
        const { rows } = await pool.query('select * from users');
        return rows.map(row => new User(row));
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

    get isAdmin() {
        return this.#isAdmin;
    }

    get passwordHash() {
        return this.#passwordHash;
    }

    toToken() {
        return {
            id: this.id,
            email: this.email,
            isAdmin: this.#isAdmin
        };
    }
}

module.exports.User = User;
