import { Test } from '@nestjs/testing';
import { DatabaseService } from '../src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as K from '../src/shared/constants';
import { databaseTestConfig } from './test.config';

const connectionProvider = {
  provide: K.POSTGRES_CONNECTION,
  useFactory: () => {
    const pool = new Pool({
      host: databaseTestConfig.host,
      port: databaseTestConfig.port,
      database: databaseTestConfig.name,
      user: databaseTestConfig.username,
      password: databaseTestConfig.password
    });
    return pool;
  }
};

describe('The DatabaseService Test', () => {
  let databaseService: DatabaseService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [connectionProvider, DatabaseService, ConfigService],
      exports: [DatabaseService]
    }).compile();

    databaseService = moduleRef.get<DatabaseService>(DatabaseService);
  });

  it('should connect to database and execute query', (done) => {
    databaseService.pool.query('SELECT 5 * 3 as data').then((res) => {
      expect(res.rows[0].data).toBe(15);
      done();
    });
  });

  it('should execute queries in table users', async () => {
    const result = (
      await databaseService.pool.query(`insert into users 
    (first_name, last_name, user_name, email, "password", salt, phone) 
    values ('test', 'one', 'test01', 'test@abc.com', 'testpassword', 'testsalt', '0123456789') 
    returning id`)
    ).rows[0];
    const testUserId = result.id;
    const testUserData = (
      await databaseService.pool.query(
        `select 
    u.first_name 
    from users u 
    where u.id = $1`,
        [testUserId]
      )
    ).rows[0];
    expect(testUserData.first_name).toBe('test');
    await databaseService.pool.query(`delete from users where id = $1`, [
      testUserId
    ]);
  });

  it('should execute queries in table genres', async () => {
    const result = (
      await databaseService.pool.query(`insert into genres ("name")
    values('testgenre')
    returning id`)
    ).rows[0];
    const testGenreId = result.id;
    const testGenreData = (
      await databaseService.pool.query(
        `select g."name"  
    from genres g 
    where g.id = $1`,
        [testGenreId]
      )
    ).rows[0];
    expect(testGenreData.name).toBe('testgenre');
    await databaseService.pool.query(`delete from genres where id = $1`, [
      testGenreId
    ]);
  });

  it('should execute queries in table books', async () => {
    const result = (
      await databaseService.pool.query(`insert into books 
    (isbn, image, title, author, publisher, owner_id, edition)
    values ('test11', 'test.jpg', 'testtitle', 'testauthor', 'testpublisher', 2, 'testedition')
    returning id`)
    ).rows[0];
    const testBookId = result.id;
    const testBookData = (
      await databaseService.pool.query(
        `select b.title  from books b
    where b.id = $1`,
        [testBookId]
      )
    ).rows[0];
    expect(testBookData.title).toBe('testtitle');
    await databaseService.pool.query(`delete from books where id = $1`, [
      testBookId
    ]);
  });

  it('should execute queries in table genre_book_map', async () => {
    const result = (
      await databaseService.pool
        .query(`insert into genre_book_map (book_id, genre_id)
    values(4, 1) returning id`)
    ).rows[0];
    const testId = result.id;
    const testData = (
      await databaseService.pool.query(
        `select gbm.id from genre_book_map gbm
    where gbm.id = $1`,
        [testId]
      )
    ).rows[0];
    expect(testData.id).toBe(testId);
    await databaseService.pool.query(
      `delete from genre_book_map where id = $1`,
      [testId]
    );
  });

  it('should execute queries in table borrow_requests', async () => {
    const result = (
      await databaseService.pool.query(`insert into borrow_requests 
    (book_id, borrower_id, return_by, status, comments)
    values(4, 7, '12-10-2024', 'pending', 'abcd') returning id`)
    ).rows[0];
    const testId = result.id;
    const testData = (
      await databaseService.pool.query(
        `select 
    br.id from borrow_requests br
    where br.id = $1`,
        [testId]
      )
    ).rows[0];
    expect(testData.id).toBe(testId);
    await databaseService.pool.query(
      `delete from borrow_requests where id = $1`,
      [testId]
    );
  });

  it('should execute queries in table borrowed_books', async () => {
    const result = (
      await databaseService.pool.query(`insert into borrowed_books 
      (book_id, borrower_id, borrowed_date, return_by, returned_date)
      values(4, 7, '12-10-2023', '12-11-2023', '10-11-2023') returning id`)
    ).rows[0];
    const testId = result.id;
    const testData = (
      await databaseService.pool.query(
        `select 
    bb.id from borrowed_books bb
    where bb.id = $1`,
        [testId]
      )
    ).rows[0];
    expect(testData.id).toBe(testId);
    await databaseService.pool.query(
      `delete from borrowed_books where id = $1`,
      [testId]
    );
  });

  afterAll(() => {
    databaseService.pool.end().then(() => {
      databaseService = null;
    });
  });
});
