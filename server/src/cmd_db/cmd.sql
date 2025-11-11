-- 1) Deleting existing data
DELETE FROM comment;
DELETE FROM post;
DELETE FROM user;

-- Optional: reset sequences (for SQLite you can TRUNCATE sqlite_sequence if needed)
DELETE FROM sqlite_sequence WHERE name IN ('user','post','comment');

-- 2) Reinserting credible users
INSERT INTO user (id, username, password, email, createdAt, updatedAt) VALUES
(1, 'amelie', 'argon2id$placeholder$1', 'amelie@example.com', '2025-09-25 09:00:00', '2025-09-25 09:00:00'),
(2, 'benjamin', 'argon2id$placeholder$2', 'benjamin@example.com', '2025-09-25 09:02:00', '2025-09-25 09:02:00'),
(3, 'camille', 'argon2id$placeholder$3', 'camille@example.com', '2025-09-25 09:04:00', '2025-09-25 09:04:00'),
(4, 'david', 'argon2id$placeholder$4', 'david@example.com', '2025-09-25 09:06:00', '2025-09-25 09:06:00'),
(5, 'elodie', 'argon2id$placeholder$5', 'elodie@example.com', '2025-09-25 09:08:00', '2025-09-25 09:08:00');

-- 3) Reinserting posts (articles) with illustrative images
INSERT INTO post (id, title, description, content, createdAt, updatedAt, userId) VALUES
(1, 'How to secure your passwords in 2025',
'Best practices for storing and verifying passwords',
'<p>Password security remains critical. Use slow hashing functions (argon2id, bcrypt) and unique salts per user. Enable 2FA whenever possible.</p>
<img src="/uploads/security_passwords.jpg" alt="Password security" title="Password security tips">',
'2025-09-20 10:15:00', '2025-09-20 10:15:00', 2),

(2, 'Introduction to SQL indexes: speeding up your queries',
'A practical guide to understanding and creating useful indexes',
'<p>Indexes reduce read times but increase write costs. Here’s when and how to create a covering index.</p>
<img src="/uploads/sql_indexes.jpg" alt="SQL indexes" title="SQL indexing example">',
'2025-08-30 14:40:00', '2025-08-30 14:40:00', 3),

(3, 'The future of the web: front-end trends for 2026',
'Frameworks, performance, and accessibility',
'<p>Performance-first, edge computing, and standardized web components: what to expect for 2026?</p>
<img src="/uploads/frontend_trends.jpg" alt="Front-end trends" title="Front-end evolution 2026">',
'2025-09-01 09:00:00', '2025-09-01 09:00:00', 1),

(4, 'Practical guide: continuous deployment with CI/CD',
'Automating releases securely',
'<p>Example pipeline: lint → unit tests → build → integration tests → canary deployment.</p>
<img src="/uploads/cicd_pipeline.png" alt="CI/CD pipeline" title="Continuous Deployment Pipeline">',
'2025-07-12 11:20:00', '2025-07-12 11:20:00', 4),

(5, 'Best practices for web accessibility (WCAG)',
'Making your site usable by everyone',
'<p>Use explicit labels, a proper heading hierarchy, and test with both keyboard and screen readers.</p>
<img src="/uploads/web_accessibility.png" alt="Accessibility" title="Web accessibility best practices">',
'2025-06-18 16:05:00', '2025-06-18 16:05:00', 5),

(6, 'How to write effective unit tests',
'Strategies for maintainable tests',
'<p>Favor fast, independent, and easily repeatable tests. Mock external dependencies and check behaviors, not implementations.</p>
<img src="/uploads/unit_tests.png" alt="Unit testing" title="Effective unit testing strategies">',
'2025-09-10 08:30:00', '2025-09-10 08:30:00', 2);

-- 4) Reinserting credible comments (unchanged)
INSERT INTO comment (id, content, createdAt, updatedAt, userId, postId) VALUES
(1, 'Great article, I implemented argon2id and reduced risks — thanks!', '2025-09-21 12:10:00', '2025-09-21 12:10:00', 1, 1),
(2, 'One important point: also consider password rotation policies.', '2025-09-21 13:05:00', '2025-09-21 13:05:00', 3, 1),
(3, 'Clear article. For indexes, be careful with indexes on highly volatile columns.', '2025-09-02 09:45:00', '2025-09-02 09:45:00', 5, 2),
(4, 'Great summary of front-end trends — I’d also add Web Components.', '2025-09-01 10:20:00', '2025-09-01 10:20:00', 4, 3),
(5, 'Very useful, it helped me set up a canary pipeline at work.', '2025-07-13 08:00:00', '2025-07-13 08:00:00', 2, 4),
(6, 'Don’t forget automated accessibility tests (axe-core).', '2025-06-19 09:15:00', '2025-06-19 09:15:00', 1, 5),
(7, 'I also recommend Storybook for documenting accessible components.', '2025-06-20 11:30:00', '2025-06-20 11:30:00', 3, 5),
(8, 'Great reminder on mocking — tests become faster and more stable.', '2025-09-11 07:50:00', '2025-09-11 07:50:00', 5, 6),
(9, 'Does anyone have an example of a free CI pipeline for open-source projects?', '2025-07-14 15:40:00', '2025-07-14 15:40:00', 4, 4),
(10, 'To index properly, consider partial indexes if your DBMS supports them.', '2025-09-03 10:05:00', '2025-09-03 10:05:00', 2, 2),
(11, 'Thanks for the guide, I fixed several accessibility issues on my site.', '2025-06-25 12:22:00', '2025-06-25 12:22:00', 4, 5),
(12, 'Quick question: should we mock everything or keep some end-to-end tests?', '2025-09-11 09:10:00', '2025-09-11 09:10:00', 3, 6);

COMMIT;
PRAGMA foreign_keys = ON;
