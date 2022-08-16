-- Use this file to add dummy data during testing
-- This file is run after setup.sql only in a test environment
insert into users (email, password_hash, is_admin)
values
    ('alice@test.com', '$2b$10$i41JAODX74XLyOCIEfk5W.yFXrorvnGisRA.DB6EAwKVkFGbLkANK', false), -- pw: 123456
    ('admin@test.com', '$2b$10$dZ2exrAGjVX9fGrECy4w0u5IVz2gZ/NgIj1.0DilGW7nCLA10Vk/G', true) -- pw: admin
