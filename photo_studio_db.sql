create database if not exists photo_studio;
use photo_studio;

create table if not exists role(
	id int auto_increment primary key,
	role varchar(20) not null,
	created_at datetime default current_timestamp
);

create table if not exists client (
	id int auto_increment primary key,
    username varchar(255) not null unique,
    mail varchar(255) not null unique,
    phone_number varchar(20) not null unique,
    city varchar(255) not null,
    password varchar(255) not null,
    created_at datetime default current_timestamp,
	role_id int not null,
    foreign key (role_id) references role(id),
    is_active boolean default true
);

create table if not exists inquiries (
	id int auto_increment primary key,
    user_name varchar(255),
    mail varchar(255),
    inquiry_msg text,
    created_at datetime default current_timestamp
);

create table if not exists admin (
	id int auto_increment primary key,
    admin_name varchar(255) not null unique,
    mail varchar(255) not null unique,
    phone_number varchar(20) not null unique,
    street varchar(255) not null,
    city varchar(255) not null,
    password varchar(255) not null,
    created_at datetime default current_timestamp,
	role_id int not null,
    foreign key (role_id) references role(id)
);

create table if not exists service_category(
	id int auto_increment primary key,
    category_name varchar(255) not null,
	created_at datetime default current_timestamp
);

create table if not exists sample_photos(
	id int auto_increment primary key,
	file_path varchar(255) not null,
    service_category_id int not null,
	foreign key (service_category_id) references service_category(id),
    service_id int not null,
	created_at datetime default current_timestamp
);

create table if not exists photoshoot(
	id int auto_increment primary key,
    photoshoot_name varchar(255) not null unique,
    price varchar(255) not null,
    durarion varchar(20) not null,
    description varchar(255) not null,
	created_at datetime default current_timestamp,
	service_category_id int not null,
    foreign key (service_category_id) references service_category(id)
);

create table if not exists frames(
	id int auto_increment primary key,
	material_name varchar(255) not null unique,
    size varchar(255) not null,
    color varchar(255) not null,
    price varchar(255) not null,
	description varchar(255) not null,
	created_at datetime default current_timestamp,
	service_category_id int not null,
    foreign key (service_category_id) references service_category(id)
);


create table if not exists printings(
	id int auto_increment primary key,
    printing_name varchar(255) not null unique,
    price varchar(255) not null,
    description varchar(255) not null,
	created_at datetime default current_timestamp,
	service_category_id int not null,
    foreign key (service_category_id) references service_category(id)
);

create table if not exists feedback(
	id int auto_increment primary key,
    feedback text not null,
    rating int not null,
    reply_msg text default null,
    client_id int not null,
	created_at datetime default current_timestamp,
    foreign key (client_id) references client(id)   
);

create table if not exists cart(
	id int auto_increment primary key,
    service_category_id int not null,
    service_id int not null,
    quantity int not null default 1,
    client_id int not null,
	created_at datetime default current_timestamp,
    foreign key (service_category_id) references service_category(id),
    foreign key (client_id) references client(id)   
);

create table if not exists orders(
	id int auto_increment primary key,
    client_id int not null,
	created_at datetime default current_timestamp,
    foreign key (client_id) references client(id)   
);

create table if not exists order_details(
	id int auto_increment primary key,
    order_id int not null,
    service_category_id int not null,
    service_id int not null,
    quantity int not null,
	status enum( 'processing', 
			'editing', 
            'awaiting_approval', 
            'reediting', 
			'approved', 
            'in_production', 
            'ready_for_delivery', 
            'delivered', 
            'cancelled' ) not null default 'processing',
	created_at datetime default current_timestamp,	
    foreign key (service_category_id) references service_category(id),
    foreign key (order_id) references orders(id)   
);

create table if not exists order_delivery_details(
	id int auto_increment primary key,
    order_id int not null,
    sender_phone_number varchar(30) not null,
    receiver_phone_number varchar(30) not null,
    receiver_name varchar(255) not null,
    receiver_district varchar(255) not null,
    receiver_city varchar(255) not null,
    receiver_street varchar(255) not null,
	created_at datetime default current_timestamp,
    foreign key (order_id) references orders(id)
);


create table if not exists client_photos_for_orders(
	id int auto_increment primary key,
    order_details_id int not null,
    file_path varchar(255) not null,
	created_at datetime default current_timestamp,
    foreign key (order_details_id) references order_details(id)
);

create table if not exists edited_photos(
	id int auto_increment primary key,
    order_details_id int not null,
    photo_path varchar(255) not null,
	created_at datetime default current_timestamp,
    foreign key (order_details_id) references order_details(id)
);

create table if not exists payment_details(
	id int auto_increment primary key,
    order_id int not null,
    client_id int not null,
    advance_amount decimal(10, 2),
    total_amount decimal(10, 2) not null,
    payment_method enum('Cash', 'Card') not null,
    status enum('processing', 'parcial_payment', 'complete', 'failed') not null default 'processing',
	created_at datetime default current_timestamp,
    foreign key (client_id) references client(id),
    foreign key (order_id) references orders(id) 
);


select * from client;
select * from admin;
select * from role;
select * from service_category;
select * from photoshoot;
select * from frames;
select * from frame_size;
select * from service_category;
select * from sample photos;





