CREATE TABLE users(
	id SERIAL PRIMARY KEY,
    nom VARCHAR (100),
	prenom VARCHAR (100),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR (100)
);

INSERT INTO users
VALUES (1, 'islam', 'derrouiche', 'islam@gmail.com', 'islam_session');
INSERT INTO users
VALUES (2, 'Josette', 'joseline', 'josette@gmail.com', 'josette_session')