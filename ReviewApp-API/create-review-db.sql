-- SQL script to create review database
-- Run this after MySQL is deployed

CREATE DATABASE IF NOT EXISTS review;

-- Grant permissions to admin user
GRANT ALL PRIVILEGES ON review.* TO 'admin'@'%';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;


