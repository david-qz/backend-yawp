const pool = require('../utils/pool');
const HttpError = require('../utils/HttpError');
const { Review } = require('./Review');

class Restaurant {
    id;
    name;
    cuisine;
    cost;
    website;
    image;
    reviews;

    constructor(row) {
        this.id = row.id;
        this.name = row.name;
        this.cuisine = row.cuisine;
        this.cost = row.cost;
        this.website = row.website;
        this.image = row.image;

        if (row.reviews) {
            this.reviews = row.reviews.map(x => new Review(x));
        }
    }

    static async getAll() {
        const { rows } = await pool.query('select * from restaurants;');
        return rows.map(row => new Restaurant(row));
    }

    static async getById(id) {
        const { rows } = await pool.query(
            `
            select
            restaurants.*,
                coalesce(
                  json_agg(reviews), '[]'
                ) as reviews
            from restaurants
            left join reviews on restaurants.id = reviews.restaurant_id
            where restaurants.id = $1
            group by restaurants.id;
            `,
            [id]
        );

        if (!rows[0]) throw new HttpError(`no restaurant with id=${id}`, 404);

        return new Restaurant(rows[0]);
    }
}

module.exports.Restaurant = Restaurant;
