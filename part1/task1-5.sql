-- Switch to the database
USE DogWalkService;

-- Insert five users
INSERT INTO Users (username, email, password_hash, role) VALUES
('alice123', 'alice@example.com', 'hashed123', 'owner'),
('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
('carol123', 'carol@example.com', 'hashed789', 'owner'),
('tommytung', 'tommy@ava.com', 'hashed696','owner'),
('lucateng', 'luca@teng.com', 'hashed969', 'walker');

-- Insert five dogs
INSERT INTO Dogs (name, size, owner_id) VALUES
('Max', 'medium', (SELECT user_id FROM Users WHERE username = 'alice123')),
('Bella', 'small', (SELECT user_id FROM Users WHERE username = 'carol123')),
('Tow', 'large', (SELECT user_id FROM Users WHERE username = 'alice123')),
('Su Go', 'medium', (SELECT user_id FROM Users WHERE username = 'tommytung')),
('My Dieu', 'small', (SELECT user_id FROM Users WHERE username = 'tommytung'));

-- Insert five walk requests
INSERT INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
(
    (SELECT dog_id FROM Dogs WHERE name = 'Max'),
    '2025-06-10 08:00:00',
    30,
    'Parklands',
    'open'
),
(
    (SELECT dog_id FROM Dogs WHERE name = 'Bella'),
    '2025-06-11 09:30:00',
    45,
    'Beachside Ave',
    'accepted'
),
(
    (SELECT dog_id FROM Dogs WHERE name = 'Tow'),
    '2025-06-15 16:00:00',
    60,
    'River Bank',
    'completed'
),
(
    (SELECT dog_id FROM Dogs WHERE name = 'Su Go'),
    '2025-06-13 12:35:00',
    30,
    'Downtown',
    'open'
),
(
    (SELECT dog_id FROM Dogs WHERE name = 'My Dieu'),
    '2025-06-14 12:00:00',
    45,
    'Uptown',
    'open'
),
