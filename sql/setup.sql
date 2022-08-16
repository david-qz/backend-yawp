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

-- In a real app, I would've kept this seed data in a separate sql file that is only used during testing so that these
-- users don't end up in the production database. But I want the deployed version to have an admin and some seed data to
-- poke at so it can be graded :^). Nobody else is allowed to read the admin password out of this file and do bad things!
insert into users (email, password_hash, is_admin) values
('admin@test.com', '$2b$10$dZ2exrAGjVX9fGrECy4w0u5IVz2gZ/NgIj1.0DilGW7nCLA10Vk/G', true), -- pw: admin
('alice@test.com', '$2b$10$i41JAODX74XLyOCIEfk5W.yFXrorvnGisRA.DB6EAwKVkFGbLkANK', false), -- pw: 123456
('curmudgeon@test.com', '$2b$10$rs3dpRNMt8i6bHB3UkvXWOndzt5zfOhsA2vHYao7J/1Sje0uDZ1YS', false); -- pw: eeyore

create table restaurants(
    id bigint generated always as identity primary key,
    name varchar(255) not null,
    cuisine varchar(255),
    cost smallint constraint five_star_scale check(cost >= 1 and cost <= 5),
    website text,
    image text
);

insert into restaurants (name, cuisine, cost, website, image) values
('Andina', 'Peruvian', 3, 'https://www.andinarestaurant.com/', 'https://images.squarespace-cdn.com/content/v1/5b747f617e3c3a0811711c60/8e16f160-e74f-4112-8e34-a504af331ff9/Dina+Avila_Andina_5210.jpg?format=2500w'),
('Top Burmese', 'Burmese', 2, 'https://topburmese.com/', 'https://cdn.shopify.com/s/files/1/0063/5040/5732/files/Top_Burmese_Samosas_Best_Burmese_Food_fea2db54-55f6-4651-8910-a588a4470313_720x.JPEG?v=1550123611'),
('Syun Izakaya', 'Japanese', 2, 'https://www.syunhillsboro.com/', 'https://www.syunhillsboro.com/uploads/1/3/4/6/134642574/s399356810435617057_p228_i1_w1000.jpeg?width=1200');

create table reviews(
    id bigint generated always as identity primary key,
    user_id bigint references users (id),
    restaurant_id bigint references restaurants (id),
    detail text not null,
    stars smallint constraint five_star_scale check(stars >= 1 and stars <=5),
    constraint one_review_per_restaurant_per_user unique (user_id, restaurant_id)
);

insert into reviews (user_id, restaurant_id, detail, stars) values
(2, 2, 'Great samosas!', 4),
(2, 3, 'Get the okonomiyaki.', 5),
(3, 1, 'Loud environment :(', 1),
(3, 2, 'Curry wasn''t spicy!', 1),
(3, 3, 'Bad service!', 1);
