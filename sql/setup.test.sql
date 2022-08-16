-- Use this file to add dummy data during testing
-- This file is run after setup.sql only in a test environment
insert into users (email, password_hash, is_admin) values
('alice@test.com', '$2b$10$i41JAODX74XLyOCIEfk5W.yFXrorvnGisRA.DB6EAwKVkFGbLkANK', false), -- pw: 123456
('admin@test.com', '$2b$10$dZ2exrAGjVX9fGrECy4w0u5IVz2gZ/NgIj1.0DilGW7nCLA10Vk/G', true), -- pw: admin
('curmudgeon@test.com', '$2b$10$rs3dpRNMt8i6bHB3UkvXWOndzt5zfOhsA2vHYao7J/1Sje0uDZ1YS', false); -- pw: eeyore

insert into restaurants (name, cuisine, cost, website, image) values
('Andina', 'Peruvian', 3, 'https://www.andinarestaurant.com/', 'https://images.squarespace-cdn.com/content/v1/5b747f617e3c3a0811711c60/8e16f160-e74f-4112-8e34-a504af331ff9/Dina+Avila_Andina_5210.jpg?format=2500w'),
('Top Burmese', 'Burmese', 2, 'https://topburmese.com/', 'https://cdn.shopify.com/s/files/1/0063/5040/5732/files/Top_Burmese_Samosas_Best_Burmese_Food_fea2db54-55f6-4651-8910-a588a4470313_720x.JPEG?v=1550123611'),
('Syun Izakaya', 'Japanese', 2, 'https://www.syunhillsboro.com/', 'https://www.syunhillsboro.com/uploads/1/3/4/6/134642574/s399356810435617057_p228_i1_w1000.jpeg?width=1200');

insert into reviews (user_id, restaurant_id, detail, stars) values
(1, 1, 'I like it!', 5),
(1, 2, 'Great samosas!', 4),
(1, 3, 'Get the okonomiyaki.', 5),
(3, 1, 'Loud environment :(', 1),
(3, 2, 'Curry wasn''t spicy!', 1),
(3, 3, 'Bad service!', 1);
