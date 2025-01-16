CREATE TABLE users(
	id SERIAL PRIMARY KEY,
    nom VARCHAR (100),
	prenom VARCHAR (100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR (100)
);
