-- SQL statement #1
INSERT INTO account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
  );


-- SQL statement #2
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;


-- SQL statement #3
DELETE 
FROM account
WHERE account_id = 1;


-- SQL statment #4
UPDATE inventory
SET inv_description = REPLACE(
    inv_description,
    'small interiors',
    'a huge interior'
  )
WHERE inv_id = 10;


-- SQL statment #5
SELECT inv_make,
  inv_model,
  classification_name
FROM inventory i
  INNER JOIN classification c ON c.classification_id = i.classification_id
WHERE classification_name = 'Sport';


-- SQL statment #6
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/')
WHERE inv_image LIKE '/images/%' OR inv_thumbnail LIKE '/images/%';