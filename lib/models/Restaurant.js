const pool = require('../utils/pool');

class Restaurant {
    id;
    name;
    cuisine;
    cost;
    website;
    image;

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.cuisine = row.cuisine;
        this.cost = row.cost;
        this.website = row.website;
        this.image = row.image;
    }

    static async getAll() {
        const { rows } = await pool.query('select * from restaurants;');
        return rows.map(row => new Restaurant(row));
    }
}

module.exports.Restaurant = Restaurant;
