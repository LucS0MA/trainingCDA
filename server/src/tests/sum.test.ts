import request from 'supertest';
import { DataSource } from 'typeorm';
import { User } from '../entity/Users';
import { app, initializeDatabase } from '../index';
import { dataSourceBlogDB } from '../db/db';
import * as argon2 from 'argon2';
import jwt, { Secret } from 'jsonwebtoken';

describe('GET /api/users/:id', () => {
  let dataSource: DataSource;
  let userRepository: any;
  let token: string;
  let testUser: User;

  const createAuthToken = (id: number, email: string, username: string) => {
    return jwt.sign(
      { id: id, email: email, username: username }, 
      process.env.JWT_SECRET_KEY as Secret,
      { expiresIn: '2 days' }
    );
  };

  beforeAll(async () => {
    await initializeDatabase();
    dataSource = dataSourceBlogDB;
    userRepository = dataSource.getRepository(User);
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  beforeEach(async () => {
    await userRepository.clear();
    
    const hashedPassword = await argon2.hash('testpassword');
    const user = userRepository.create({
      username: 'Test User',
      password: hashedPassword,
      email: 'auth@test.com'
    });
    testUser = await userRepository.save(user);
    
    token = createAuthToken(testUser.id, testUser.email, testUser.username);
  });

  it('devrait retourner un utilisateur existant avec authentification', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const savedUser = await userRepository.save(user);

    // Fixed: Correct cookie name without quotes
    const response = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) // Fixed: removed quotes and typo
      .expect(200);

    expect(response.body).toHaveProperty('id', savedUser.id);
    expect(response.body).toHaveProperty('username', 'John Doe');
    expect(response.body).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('password', hashedPassword);
  });

  it('devrait retourner 403 sans authentification', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const savedUser = await userRepository.save(user);

    const response = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .expect(403);

    expect(response.body).toHaveProperty('message'); // Changed from 'error' to 'message'
  });

  it('devrait retourner 404 pour un utilisateur inexistant', async () => {
    const response = await request(app)
      .get('/api/users/999')
      .set('Cookie', [`access_token=${token}`]) 
      .expect(404);

    expect(response.body).toEqual({ message: "User not found" });
  });

  it('devrait retourner 400 pour un ID invalide', async () => {
    const response = await request(app)
      .get('/api/users/idInvalide')
      .set('Cookie', [`access_token=${token}`]) 
      .expect(400);

    expect(response.body).toEqual({ message: "ID not valid" });
  });

  it('devrait gérer les erreurs de base de données', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const savedUser = await userRepository.save(user);

    // Mock the User.findOne method instead of repository if your route uses User.findOne
    const originalFindOne = User.findOne;
    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(500);

    expect(response.body).toEqual({
      message: "Internal server error"
    });

    // Restore
    User.findOne = originalFindOne;
  });
});