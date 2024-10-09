--Inserted Iron Man
INSERT INTO public.account (
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

--Updated account type
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';

--Delete Tony
DELETE FROM public.account
WHERE account_firstname = 'Tony';

--Replaced inventory description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

--Inner Join
SELECT 
	inv_make,
	inv_model
FROM public.inventory
INNER JOIN public.classification
	ON classification_name = 'Sport';

--Update path
UPDATE public.inventory
SET inv_thumbnail = REPLACE(inv_thumbnail, 'images', 'images/vehicles'),
	inv_image = REPLACE(inv_image, 'images', 'images/vehicles');



