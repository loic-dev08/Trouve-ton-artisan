-- ==============================================
-- Création de la base de données Trouve ton artisan
-- ==============================================

CREATE DATABASE IF NOT EXISTS trouve_ton_artisan
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trouve_ton_artisan;

-- Table des catégories (Bâtiment, Services, Fabrication, Alimentation)
CREATE TABLE IF NOT EXISTS categories (
  id        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom       VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des spécialités (Boucher, Boulanger, Electricien…)
CREATE TABLE IF NOT EXISTS specialites (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom          VARCHAR(100) NOT NULL,
  categorie_id INT UNSIGNED NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_specialite_categorie
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des artisans
CREATE TABLE IF NOT EXISTS artisans (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(150) NOT NULL,
  specialite_id INT UNSIGNED NOT NULL,
  note          DECIMAL(2,1) NOT NULL DEFAULT 0.0
                  CHECK (note >= 0 AND note <= 5),
  ville         VARCHAR(100) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  site_web      VARCHAR(255) NULL,
  a_propos      TEXT NULL,
  top           TINYINT(1) NOT NULL DEFAULT 0,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_artisan_specialite
    FOREIGN KEY (specialite_id) REFERENCES specialites(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour accélérer les recherches fréquentes
CREATE INDEX idx_artisan_nom   ON artisans(nom);
CREATE INDEX idx_artisan_top   ON artisans(top);
CREATE INDEX idx_artisan_note  ON artisans(note);
