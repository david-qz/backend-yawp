const pool = require('../utils/pool');
const HttpError = require('../utils/HttpError');

class Review {
    id;
    restaurantId;
    userId;
    detail;
    stars;

    constructor(row) {
        this.id = row.id;
        this.restaurantId = row.restaurant_id;
        this.userId = row.user_id;
        this.detail = row.detail;
        this.stars = row.stars;
    }

    static async getById(id) {
        const { rows } = await pool.query('select * from reviews where id = $1;', [id]);

        if (!rows[0]) throw new HttpError('no review with id=${id}', 404);

        return new Review(rows[0]);
    }

    static async insert({ userId, restaurantId, detail, stars }) {
        const { rows } = await pool.query(
            `
            insert into reviews (user_id, restaurant_id, detail, stars)
            values
                ($1, $2, $3, $4)
            returning *;
            `,
            [userId, restaurantId, detail, stars]
        );

        if (!rows[0]) throw new Error('unable to create review for unknown reason');

        return new Review(rows[0]);
    }

    static async delete(id) {
        const { rows } = await pool.query('delete from reviews where id = $1 returning *', [id]);

        if (!rows[0]) throw new HttpError('no review with id=${id}', 404);

        return new Review(rows[0]);
    }
}

module.exports.Review = Review;
