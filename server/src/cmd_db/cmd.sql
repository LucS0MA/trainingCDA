-- 1) Suppression des données existantes
DELETE FROM comment;
DELETE FROM post;
DELETE FROM user;

-- Optionnel : réinitialiser les sequences (pour SQLite on peut TRUNCATE sqlite_sequence if needed)
DELETE FROM sqlite_sequence WHERE name IN ('user','post','comment');

-- 2) Réinsertion d'utilisateurs crédibles
INSERT INTO user (id, username, password, email, createdAt, updatedAt) VALUES
(1, 'amelie', 'argon2id$placeholder$1', 'amelie@example.com', '2025-09-25 09:00:00', '2025-09-25 09:00:00'),
(2, 'benjamin', 'argon2id$placeholder$2', 'benjamin@example.com', '2025-09-25 09:02:00', '2025-09-25 09:02:00'),
(3, 'camille', 'argon2id$placeholder$3', 'camille@example.com', '2025-09-25 09:04:00', '2025-09-25 09:04:00'),
(4, 'david', 'argon2id$placeholder$4', 'david@example.com', '2025-09-25 09:06:00', '2025-09-25 09:06:00'),
(5, 'elodie', 'argon2id$placeholder$5', 'elodie@example.com', '2025-09-25 09:08:00', '2025-09-25 09:08:00');

-- 3) Réinsertion d'articles (posts)
INSERT INTO post (id, title, description, content, createdAt, updatedAt, userId) VALUES
(1, 'Comment sécuriser vos mots de passe en 2025', 'Bonnes pratiques pour stocker et vérifier les mots de passe', '<p>La sécurité des mots de passe reste critique. Utilisez des fonctions de hachage lentes (argon2id, bcrypt) et des salages uniques par utilisateur. Activez 2FA quand c\est possible.</p>', '2025-09-20 10:15:00', '2025-09-20 10:15:00', 2),
(2, 'Introduction aux index SQL : accélérer vos requêtes', 'Un guide pratique pour comprendre et créer des indexes utiles', '<p>Les indexes réduisent les temps de lecture mais augmentent le coût d\écriture. Voici quand et comment créer un index couvrant.</p>', '2025-08-30 14:40:00', '2025-08-30 14:40:00', 3),
(3, 'Le futur du web : tendances front-end 2026', 'Frameworks, performance et accessibilité', '<p>Performance-first, edge computing, et composants web standardisés : que prévoir pour 2026 ?</p>', '2025-09-01 09:00:00', '2025-09-01 09:00:00', 1),
(4, 'Guide pratique : déploiement continu avec CI/CD', 'Automatiser les releases en toute sécurité', '<p>Pipeline exemple : lint -> tests unitaires -> build -> tests d\intégration -> déploiement canari.</p>', '2025-07-12 11:20:00', '2025-07-12 11:20:00', 4),
(5, 'Bonnes pratiques pour l\accessibilité web (WCAG)', 'Rendre votre site utilisable par tous', '<p>Utilisez des labels explicites, une bonne hiérarchie de titres, et testez au clavier et avec des lecteurs d\écran.</p>', '2025-06-18 16:05:00', '2025-06-18 16:05:00', 5),
(6, 'Comment écrire des tests unitaires efficaces', 'Stratégies pour des tests maintenables', '<p>Favorisez des tests rapides, indépendants et faciles à relancer. Mockez les dépendances externes et vérifiez les comportements, pas l\implémentation.</p>', '2025-09-10 08:30:00', '2025-09-10 08:30:00', 2);

-- 4) Réinsertion de commentaires crédibles
INSERT INTO comment (id, content, createdAt, updatedAt, userId, postId) VALUES
(1, 'Super article, j\ai appliqué argon2id et j\ai réduit les risques — merci !', '2025-09-21 12:10:00', '2025-09-21 12:10:00', 1, 1),
(2, 'Un point important : pensez aussi aux politiques de rotation des mots de passe.', '2025-09-21 13:05:00', '2025-09-21 13:05:00', 3, 1),
(3, 'Article clair. Pour les index, méfiez-vous des indexes sur colonnes très volatiles.', '2025-09-02 09:45:00', '2025-09-02 09:45:00', 5, 2),
(4, 'Super synthèse des tendances front-end — j\ajouterais les Web Components.', '2025-09-01 10:20:00', '2025-09-01 10:20:00', 4, 3),
(5, 'Très utile, ça m\a aidé à mettre en place un pipeline canari chez nous.', '2025-07-13 08:00:00', '2025-07-13 08:00:00', 2, 4),
(6, 'N\'oubliez pas les tests d\accessibilité automatisés (axe-core).', '2025-06-19 09:15:00', '2025-06-19 09:15:00', 1, 5),
(7, 'Je recommande aussi Storybook pour documenter les composants accessibles.', '2025-06-20 11:30:00', '2025-06-20 11:30:00', 3, 5),
(8, 'Très bon rappel sur le mocking — tests plus rapides et stables.', '2025-09-11 07:50:00', '2025-09-11 07:50:00', 5, 6),
(9, 'Est-ce que quelqu\un a un exemple de pipeline CI gratuit pour projets open-source ?', '2025-07-14 15:40:00', '2025-07-14 15:40:00', 4, 4),
(10, 'Pour indexer correctement, pensez aux index partiels si votre SGBD les supporte.', '2025-09-03 10:05:00', '2025-09-03 10:05:00', 2, 2),
(11, 'Merci pour le guide, j\ai corrigé plusieurs problèmes d\accessibilité sur mon site.', '2025-06-25 12:22:00', '2025-06-25 12:22:00', 4, 5),
(12, 'Petite question : faut-il tout mocker ou garder certains tests end-to-end ?', '2025-09-11 09:10:00', '2025-09-11 09:10:00', 3, 6);

COMMIT;
PRAGMA foreign_keys = ON;
