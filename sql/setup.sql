-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
drop table if exists reviews;
drop table if exists users;
drop table if exists restaurants;

create table users (
    id bigint generated always as identity primary key,
    email text not null unique,
    password_hash text not null,
    is_admin bool not null default false
);

create table restaurants(
    id bigint generated always as identity primary key,
    name varchar(255) not null,
    cuisine varchar(255),
    cost smallint constraint five_star_scale check(cost >= 1 and cost <= 5),
    website text,
    image text
);

create table reviews(
    id bigint generated always as identity primary key,
    user_id bigint references users (id),
    restaurant_id bigint references restaurants (id),
    detail text not null,
    stars smallint constraint five_star_scale check(stars >= 1 and stars <=5),
    constraint one_review_per_restaurant_per_user unique (user_id, restaurant_id)
);
