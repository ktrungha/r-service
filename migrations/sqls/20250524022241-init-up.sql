CREATE TABLE user(
    id                  CHAR(36) NOT NULL PRIMARY KEY,
    password            VARCHAR(60) NOT NULL,
    username            VARCHAR(127) UNIQUE,
    created_at          DATETIME NOT NULL,
    updated_at          DATETIME NOT NULL
);
CREATE INDEX user_username_idx ON user(username);

CREATE TABLE session
(
    id                  CHAR(36) NOT NULL PRIMARY KEY,
    owner_id            CHAR(36) NOT NULL,
    created_at          DATETIME NOT NULL,
    expired_at          DATETIME NOT NULL,
    CONSTRAINT fk_session_owner_id FOREIGN KEY (owner_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX session_owner_id_idx ON session(owner_id);

CREATE TABLE rwazi_service
(
    id                  CHAR(36) NOT NULL PRIMARY KEY,
    name                VARCHAR(127) NOT NULL,
    type                VARCHAR(31) NOT NULL,
    lat                 FLOAT NOT NULL,
    lon                 FLOAT NOT NULL,
    hex_id0              VARCHAR(16) NOT NULL,
    hex_id1              VARCHAR(16) NOT NULL,
    hex_id2              VARCHAR(16) NOT NULL,
    hex_id3              VARCHAR(16) NOT NULL,
    hex_id4              VARCHAR(16) NOT NULL,
    hex_id5              VARCHAR(16) NOT NULL,
    hex_id6              VARCHAR(16) NOT NULL,
    hex_id7              VARCHAR(16) NOT NULL,
    hex_id8              VARCHAR(16) NOT NULL,
    hex_id9              VARCHAR(16) NOT NULL,
    hex_id10             VARCHAR(16) NOT NULL,
    hex_id11             VARCHAR(16) NOT NULL,
    hex_id12             VARCHAR(16) NOT NULL,
    hex_id13             VARCHAR(16) NOT NULL,
    hex_id14             VARCHAR(16) NOT NULL,
    hex_id15             VARCHAR(16) NOT NULL
);
CREATE INDEX rwazi_service_hex_id0_type ON rwazi_service(hex_id0, type);
CREATE INDEX rwazi_service_hex_id1_type ON rwazi_service(hex_id1, type);
CREATE INDEX rwazi_service_hex_id2_type ON rwazi_service(hex_id2, type);
CREATE INDEX rwazi_service_hex_id3_type ON rwazi_service(hex_id3, type);
CREATE INDEX rwazi_service_hex_id4_type ON rwazi_service(hex_id4, type);
CREATE INDEX rwazi_service_hex_id5_type ON rwazi_service(hex_id5, type);
CREATE INDEX rwazi_service_hex_id6_type ON rwazi_service(hex_id6, type);
CREATE INDEX rwazi_service_hex_id7_type ON rwazi_service(hex_id7, type);
CREATE INDEX rwazi_service_hex_id8_type ON rwazi_service(hex_id8, type);
CREATE INDEX rwazi_service_hex_id9_type ON rwazi_service(hex_id9, type);
CREATE INDEX rwazi_service_hex_id10_type ON rwazi_service(hex_id10, type);
CREATE INDEX rwazi_service_hex_id11_type ON rwazi_service(hex_id11, type);
CREATE INDEX rwazi_service_hex_id12_type ON rwazi_service(hex_id12, type);
CREATE INDEX rwazi_service_hex_id13_type ON rwazi_service(hex_id13, type);
CREATE INDEX rwazi_service_hex_id14_type ON rwazi_service(hex_id14, type);
CREATE INDEX rwazi_service_hex_id15_type ON rwazi_service(hex_id15, type);
CREATE INDEX rwazi_service_name ON rwazi_service(name);

CREATE TABLE user_favorite_rwazi_service
(
    user_id             CHAR(36) NOT NULL,
    rwazi_service_id    CHAR(36) NOT NULL,
    created_at          DATETIME NOT NULL,
    PRIMARY KEY (user_id, rwazi_service_id),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_rwazi_service_id FOREIGN KEY (rwazi_service_id) REFERENCES rwazi_service(id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX user_favorite_rwazi_service_user_id_idx ON user_favorite_rwazi_service(user_id);
