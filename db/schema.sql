/*DROP DATABASE IF EXISTS music_db;
CREATE database music_db;

USE music_db;

CREATE TABLE top5000 (
  position INT NOT NULL,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  year INT NULL,
  raw_total DECIMAL(10,4) NULL,
  raw_usa DECIMAL(10,4) NULL,
  raw_uk DECIMAL(10,4) NULL,
  raw_eur DECIMAL(10,4) NULL,
  raw_row DECIMAL(10,4) NULL,
  PRIMARY KEY (position)
);

SELECT * FROM top5000;

CREATE TABLE playlists (
  id INT NOT NULL AUTO_INCREMENT ,
  name_owner VARCHAR(100) NULL,
  name_playlist VARCHAR(100) NULL,
   PRIMARY KEY (id)
);

CREATE TABLE playlist_joe101 (
  id INT NOT NULL AUTO_INCREMENT ,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  position int,
  FOREIGN KEY (position)
  REFERENCES top5000 (position)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);

CREATE TABLE playlist_andrewdalba (
  id INT NOT NULL AUTO_INCREMENT ,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  position int,
  FOREIGN KEY (position)
  REFERENCES top5000 (position)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);

CREATE TABLE playlist_chris123 (
  id INT NOT NULL AUTO_INCREMENT ,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  position int,
  FOREIGN KEY (position)
  REFERENCES top5000 (position)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);

CREATE TABLE playlist_slash (
  id INT NOT NULL AUTO_INCREMENT ,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  position int,
  FOREIGN KEY (position)
  REFERENCES top5000 (position)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);

CREATE TABLE playlist_blondie202 (
  id INT NOT NULL AUTO_INCREMENT ,
  artist VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  genre VARCHAR(100) NULL,
  year INT NULL,
  position int,
  FOREIGN KEY (position)
  REFERENCES top5000 (position)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);



CREATE TABLE endUsers (
  id INT NOT NULL AUTO_INCREMENT ,
  name VARCHAR(100) NULL,
  song VARCHAR(100) NULL,
  age INT NOT NULL,
  username VARCHAR(100) NOT NULL,
  email VARCHAR (15) NOT NULL,
  playlist_id int,
  FOREIGN KEY (playlist_id)
  REFERENCES playlists (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,
   PRIMARY KEY (id)
);

SELECT * FROM endUsers;

SHOW TABLES;
*/