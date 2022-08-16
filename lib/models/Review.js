const pool = require('../utils/pool');

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
}

module.exports.Review = Review;
