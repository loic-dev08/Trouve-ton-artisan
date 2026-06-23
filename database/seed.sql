-- ==============================================
-- Alimentation de la base de données
-- Jeu de données initial - Trouve ton artisan
-- ==============================================

USE trouve_ton_artisan;

-- Catégories
INSERT INTO categories (id, nom) VALUES
  (1, 'Alimentation'),
  (2, 'Bâtiment'),
  (3, 'Fabrication'),
  (4, 'Services');

-- Spécialités
INSERT INTO specialites (id, nom, categorie_id) VALUES
  (1,  'Boucher',      1),
  (2,  'Boulanger',    1),
  (3,  'Chocolatier',  1),
  (4,  'Traiteur',     1),
  (5,  'Chauffagiste', 2),
  (6,  'Electricien',  2),
  (7,  'Menuisier',    2),
  (8,  'Plombier',     2),
  (9,  'Bijoutier',    3),
  (10, 'Couturier',    3),
  (11, 'Ferronnier',   3),
  (12, 'Coiffeur',     4),
  (13, 'Fleuriste',    4),
  (14, 'Toiletteur',   4),
  (15, 'Webdesigner',  4);

-- Artisans
INSERT INTO artisans (nom, specialite_id, note, ville, email, site_web, a_propos, top) VALUES
  ('Boucherie Dumont',    1,  4.5, 'Lyon',              'boucherie.dumond@gmail.com',                  NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Au pain chaud',       2,  4.8, 'Montélimar',         'aupainchaud@hotmail.com',                     NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 1),
  ('Chocolaterie Labbé',  3,  4.9, 'Lyon',              'chocolaterie-labbe@gmail.com',                'https://chocolaterie-labbe.fr',         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 1),
  ('Traiteur Truchon',    4,  4.1, 'Lyon',              'contact@truchon-traiteur.fr',                 'https://truchon-traiteur.fr',           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Orville Salmons',     5,  5.0, 'Évian',             'o-salmons@live.com',                          NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 1),
  ('Mont Blanc Électricité', 6, 4.5, 'Chamonix',        'contact@mont-blanc-electricite.com',          'https://mont-blanc-electricite.com',    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Boutot & fils',       7,  4.7, 'Bourg-en-Bresse',  'boutot-menuiserie@gmail.com',                 'https://boutot-menuiserie.com',         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Vallis Bellemare',    8,  4.0, 'Vienne',            'v.bellemare@gmail.com',                       'https://plomberie-bellemare.com',       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Claude Quinn',        9,  4.2, 'Aix-les-Bains',    'claude.quinn@gmail.com',                      NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Amitee Lécuyer',     10,  4.5, 'Annecy',            'a.amitee@hotmail.com',                        'https://lecuyer-couture.com',           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Ernest Carignan',    11,  5.0, 'Le Puy-en-Velay',  'e-carigan@hotmail.com',                       NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Royden Charbonneau', 12,  3.8, 'Saint-Priest',     'r.charbonneau@gmail.com',                     NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Leala Dennis',       12,  3.8, 'Chambéry',          'l.dennos@hotmail.fr',                         'https://coiffure-leala-chambery.fr',    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('C\'est sup\'hair',   12,  4.1, 'Romans-sur-Isère', 'sup-hair@gmail.com',                          'https://sup-hair.fr',                   'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Le monde des fleurs',13,  4.6, 'Annonay',           'contact@le-monde-des-fleurs-annonay.fr',      'https://le-monde-des-fleurs-annonay.fr','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('Valérie Laderoute',  14,  4.5, 'Valence',           'v-laredoute@gmail.com',                       NULL,                                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0),
  ('CM Graphisme',       15,  4.4, 'Valence',           'contact@cm-graphisme.com',                    'https://cm-graphisme.com',              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus eleifend augue vel orci tristique, vitae commodo orci tempus. Praesent condimentum risus nec libero volutpat, eget vehicula velit fermentum.', 0);
