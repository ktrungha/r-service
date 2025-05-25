import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import { Connection } from 'mysql2/promise';
import { setupApp } from './setupTestAppUtils';
import { createApiClient } from './model/clientTypes';
import axios from 'axios';

describe('Authen', () => {
  jest.setTimeout(35000);
  const port = 8301;

  let mySqlContainer: StartedMySqlContainer;
  let app: INestApplication;
  let mySqlConnection: Connection;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    jest.useFakeTimers({ advanceTimers: true });

    const setupRes = await setupApp();
    app = setupRes.app;
    mySqlContainer = setupRes.mySqlContainer;
    mySqlConnection = setupRes.mySqlConnection;
    moduleRef = setupRes.moduleRef;

    await app.listen(port);
  });

  afterAll(async () => {
    jest.useRealTimers();
    await Promise.all([
      app.close(),
      mySqlContainer.stop(),
      mySqlConnection.end(),
    ]);
  });

  afterEach(async () => {
    await jest.advanceTimersToNextTimerAsync(100);
    jest.restoreAllMocks();
  });

  it('create user and login', async () => {
    const axiosInstance = axios.create({});
    const client = createApiClient(`http://localhost:${port}`, {
      axiosInstance,
    });

    const testUser = await client.AuthenController_createUser({
      username: 'test',
      password: 'test1234',
    });
    expect(testUser.user.username).toBe('test');

    const testLogin = await client.AuthenController_loginWithPassword({
      username: 'test',
      password: 'test1234',
    });
    expect(testLogin.success).toBe(true);
  });
});
