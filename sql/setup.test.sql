-- Use this file to add dummy data during testing
-- This file is run after setup.sql only in a test environment
insert into users (email, password_hash, is_admin) values
('alice@test.com', '$2b$10$i41JAODX74XLyOCIEfk5W.yFXrorvnGisRA.DB6EAwKVkFGbLkANK', false), -- pw: 123456
('admin@test.com', '$2b$10$dZ2exrAGjVX9fGrECy4w0u5IVz2gZ/NgIj1.0DilGW7nCLA10Vk/G', true), -- pw: admin
('curmudgeon@test.com', '$2b$10$rs3dpRNMt8i6bHB3UkvXWOndzt5zfOhsA2vHYao7J/1Sje0uDZ1YS', false); -- pw: eeyore

insert into reviews (user_id, restaurant_id, detail, stars) values
(1, 2, 'Great samosas!', 4),
(1, 3, 'Get the okonomiyaki.', 5),
(3, 1, 'Loud environment :(', 1),
(3, 2, 'Curry wasn''t spicy!', 1),
(3, 3, 'Bad service!', 1);
