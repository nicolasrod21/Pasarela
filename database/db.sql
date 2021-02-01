Create DATABASE database_links;

use database_links;
-- users table
Create table users(
    id INT(11) NOT NULL,
    username varchar(16) NOT NULL,
    password varchar(60) NOT NULL,
    fullname varchar(100) NOT NULL
);

alter table users
    add primary key(id);

alter table users
    modify id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;

DESCRIBE users;

-- links table
Create table links(
    id INT(11) NOT NULL,
    title varchar(150) NOT NULL,
    url varchar(255) NOT NULL,
    description text,
    image longblob,
    user_id INT(11),
    Created_at timestamp NOT NULL default current_timestamp,
    constraint fk_user FOREIGN key (user_id) REFERENCES users(id)
);

alter table links
    add primary key(id);

alter table links
    modify id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT = 2;