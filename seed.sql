create table departments (
    id int primary key,
    name varchar(255)
);

insert into departments (id, name) values (1, 'Marketing');
insert into departments (id, name) values (2, 'Sales');
insert into departments (id, name) values (3, 'IT');
insert into departments (id, name) values (4, 'Engineering');


create table roles (
    id int primary key,
    name varchar(255)
);

insert into roles (id, name) values (1, 'Analyst');
insert into roles (id, name) values (2, 'Manager');
insert into roles (id, name) values (3, 'Accountant');
insert into roles (id, name) values (4, 'Administrator');

create table countries (
    id int primary key,
    name varchar(255)
);

insert into countries (id, name) values (1, 'United States');
insert into countries (id, name) values (2, 'Germany');
insert into countries (id, name) values (3, 'Japan');
insert into countries (id, name) values (4, 'France');
insert into countries (id, name) values (5, 'Spain');

create table employees (
    id int primary key,
    first_name varchar(255),
    last_name varchar(255),
    role_id int,
    country_id int,
    department_id int,
    foreign key (role_id) references roles(id),
    foreign key (department_id) references departments(id),
    foreign key (country_id) references countries(id)
);

insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (1, 'Kirstyn', 'Durie', 2, 3, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (2, 'Stesha', 'Ranyard', 1, 5, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (3, 'Donnajean', 'MacElroy', 1, 1, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (4, 'Jeremie', 'Enefer', 3, 5, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (5, 'Guglielma', 'Bomfield', 4, 1, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (6, 'Conny', 'Lafond', 1, 2, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (7, 'Hayley', 'Moyle', 3, 4, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (8, 'Ada', 'Tice', 1, 3, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (9, 'Flory', 'Petrov', 3, 2, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (10, 'Arlana', 'Bullent', 3, 2, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (11, 'Annaliese', 'Hayfield', 1, 1, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (12, 'Dorree', 'Dioniso', 1, 4, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (13, 'Glendon', 'O''Donnelly', 4, 2, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (14, 'Saudra', 'Baudoux', 1, 3, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (15, 'Sherye', 'Delhay', 1, 1, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (16, 'Drud', 'MacCoveney', 3, 3, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (17, 'Regan', 'Rippen', 2, 5, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (18, 'Cecily', 'Husk', 1, 5, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (19, 'Tedda', 'Guirau', 1, 2, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (20, 'Scarface', 'Murtell', 3, 4, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (21, 'Rafaela', 'Jahnel', 2, 2, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (22, 'Teressa', 'O''Grogane', 1, 5, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (23, 'Felicio', 'Tremolieres', 1, 5, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (24, 'Ferrell', 'Castiglio', 2, 1, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (25, 'Fiona', 'Jirek', 1, 1, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (26, 'Rozanne', 'Brunker', 4, 4, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (27, 'Dame', 'Warland', 4, 4, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (28, 'Artemus', 'Stidworthy', 1, 4, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (29, 'Latashia', 'Stolberger', 1, 3, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (30, 'Louisette', 'Das', 1, 2, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (31, 'Lacie', 'Olander', 3, 1, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (32, 'Candra', 'Ouslem', 4, 4, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (33, 'Olia', 'Spenclay', 4, 2, 4);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (34, 'Ives', 'Layman', 2, 4, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (35, 'Jonathon', 'Sandiland', 3, 4, 3);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (36, 'Kellby', 'Carslake', 2, 1, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (37, 'Hal', 'Neat', 2, 4, 1);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (38, 'Fern', 'Hutchason', 4, 5, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (39, 'Jule', 'Carnalan', 4, 5, 2);
insert into employees (id, first_name, last_name, role_id, country_id, department_id) values (40, 'Frederich', 'Gave', 2, 4, 3);