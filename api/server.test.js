const db = require("../data/dbConfig")
const request = require('supertest')
const server = require('./server')
const bcrypt = require('bcryptjs')
// Write your tests here
beforeAll(async() => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async() => {
  await db.destroy()
})

it('[0] sanity check', () => {
  expect(true).not.toBe(false)
})


describe('API', () => {
  describe('[POST] /api/auth/register', () => {
    it('[1]Successfully creates new user', async() => {
      await request(server).post('/api/auth/register').send({username: 'Itachi', password: 'Uchiha'})
      const itachi = await db('users').where('username', "Itachi").first()
      expect(itachi).toMatchObject({username: 'Itachi'})
    }, 750)
    it('[2]Responds with id and username', async() => {
      const res = await request(server).post('/api/auth/register')
      .send({username: 'Naruto', password: 'Uzumaki'})
      expect(res.body).toMatchObject({id: 2, username: 'Naruto'})
    }, 750)
  })

  describe('[POST] /api/auth/login', () => {
    it('[3]Logs in with correct credentials', async() => {
      const res = await request(server).post('/api/auth/login').send({ username: 'Itachi', password: 'Uchiha' })
      expect(res.body.message).toMatch(/Welcome back, Itachi/i)
    }, 750)
    it('[4]If credentials are incorrect send invalid credentials message.', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'Itachi', password: 'wrong' })
      expect(res.body.message).toMatch(/invalid credentials/i)
    }, 750)
  })

  describe('[GET] /api/jokes', () => {
    it('[5]Responds with all jokes', async() => {
      let res = await request(server)
      .post('/api/auth/login')
      .send({username: 'Itachi', password: 'Uchiha'})
      res = await request(server).get('/api/jokes')
      .set('Authorization', res.body.token)
      expect(res.body).toMatchObject([{"id": "0189hNRf2g", "joke": "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."}, {"id": "08EQZ8EQukb", "joke": "Did you hear about the guy whose whole left side was cut off? He's all right now."}, {"id": "08xHQCdx5Ed", "joke": "Why didn’t the skeleton cross the road? Because he had no guts."}])
    })
    it('[6]User can not see jokes without a token', async () => {
      const res = await request(server).get('/api/jokes')
      expect(res.body.message).toMatch(/token required/i)
    }, 750)
  })
  
})