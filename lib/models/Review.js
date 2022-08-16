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
}

module.exports.Review = Review;
