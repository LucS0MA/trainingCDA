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

    const response = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(200);

    expect(response.body).toHaveProperty('id', savedUser.id);
    expect(response.body).toHaveProperty('username', 'John Doe');
    expect(response.body).toHaveProperty('email', 'test@example.com');
  });

    it('devrait retourner un utilisateur existant modifié', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const userModifData = ({
      username: 'Jon Does',
      email: 'tes@ample.com'
    });
    const savedUser = await userRepository.save(user);

    const response = await request(app)
      .put(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) 
      .send(userModifData)
      .expect(200);

    const response2 = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(200);

    expect(response.body).toEqual({"message": "User updated"});
    expect(response2.body).toHaveProperty('id', savedUser.id);
    expect(response2.body).toHaveProperty('username', 'Jon Does');
    expect(response2.body).toHaveProperty('email', 'tes@ample.com');
  });

      it('devrait retourner un utilisateur créé', async () => {
    const userData = {
      username: 'John Dose',
      password: 'michel52200',
      email: 'testo@example.com'
    };

    const response = await request(app)
      .post(`/api/register`)
      .send(userData)
      .expect(201);

    const userCreatedid = response.body.newUser.id
    console.log("popol", userCreatedid)

    const response2 = await request(app)
      .get(`/api/users/${userCreatedid}`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(200);

    expect(response.body).toHaveProperty("message", "User created");
    expect(response2.body).toHaveProperty( "email", "testo@example.com" );
    expect(response2.body).toHaveProperty( "username", "John Dose" );

  });

  it('devrait retourner tous les utilisateurs', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const secondUser = await userRepository.save(user);

    const response = await request(app)
      .get(`/api/users`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(200);

  expect(Array.isArray(response.body)).toBe(true);
  expect(response.body).toHaveLength(2);
  
  const userIds = response.body.map((user: { id: any; }) => user.id);
  expect(userIds).toContain(testUser.id);
  expect(userIds).toContain(secondUser.id);
  
  const returnedUser1 = response.body.find((user: { id: number; }) => user.id === testUser.id);
    expect(returnedUser1).toHaveProperty('username', 'Test User');
  expect(returnedUser1).toHaveProperty('email', 'auth@test.com');
  
  const returnedUser2 = response.body.find((user: { id: number; }) => user.id === secondUser.id);
    expect(returnedUser2).toHaveProperty('username', 'John Doe');
  expect(returnedUser2).toHaveProperty('email', 'test@example.com');
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

    expect(response.body).toHaveProperty('message'); 
  });

    it('devrait retourner le message de user supprimé', async () => {
    const hashedPassword = await argon2.hash('michel52200');
    const user = userRepository.create({
      username: 'John Doe',
      password: hashedPassword,
      email: 'test@example.com'
    });
    const savedUser = await userRepository.save(user);

    const response = await request(app)
      .delete(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`])
      .expect(200);

    const response2 = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`])
      .expect(404);


    expect(response.body).toEqual({ message: `User deleted` });
    expect(response2.body).toEqual({ message: "User not found" });
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

 
    const originalFindOne = User.findOne;
    User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get(`/api/users/${savedUser.id}`)
      .set('Cookie', [`access_token=${token}`]) 
      .expect(500);

    expect(response.body).toEqual({
      message: "Internal server error"
    });

    User.findOne = originalFindOne;
  });
  
});