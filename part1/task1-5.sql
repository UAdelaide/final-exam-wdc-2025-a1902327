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
('Tow', 'large', (SELECT user_id FROM Users WHERE username = 'bobwalker')