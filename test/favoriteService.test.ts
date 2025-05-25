import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { StartedMySqlContainer } from '@testcontainers/mysql';
import axios from 'axios';
import * as cookie from 'cookie';
import { Connection } from 'mysql2/promise';
import * as request from 'supertest';
import { AuthenService } from '../src/auth/authen.service';
import { RWAZI_TOKEN_COOKIE } from '../src/common/constants';
import { CoreService } from '../src/core/core.service';
import { createApiClient } from './model/clientTypes';
import { setupApp } from './setupTestAppUtils';
import { getTokenCookieFromHeaders } from './utils';
import { randomUUID } from 'crypto';

describe('Search', () => {
  jest.setTimeout(35000);
  const port = 8302;

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

    await moduleRef.get(CoreService).seedData();
    await moduleRef.get(AuthenService).seedUsers();

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

  it('Add favorite services in Hanoi, check favorite list and then clear the list', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/authen/login')
      .send({ username: 'test1', password: 'password1' });
    const loginCookie = getTokenCookieFromHeaders(loginRes.headers)!;

    const axiosInstance = axios.create({
      headers: {
        Cookie: cookie.serialize(RWAZI_TOKEN_COOKIE, loginCookie.value),
      },
    });
    const client = createApiClient(`http://localhost:${port}`, {
      axiosInstance,
    });

    const rwaziServices = await client.CoreController_searchRwaziService({
      queries: {
        'search-radius': 15,
        lat: 21.023879933295056,
        lon: 105.83249490449899,
        types: ['pharmacy', 'restaurant', 'supermarket'].join(','),
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);

    for (const service of rwaziServices) {
      await client.CoreController_createFavoriteService(undefined, {
        params: { id: service.id },
      });
    }

    const favoriteServices = await client.CoreController_getFavoriteServices();
    expect(favoriteServices.length).toBe(rwaziServices.length);

    for (const favoriteService of favoriteServices) {
      expect(favoriteService.rwaziService.name.startsWith('HN '));
      await client.CoreController_deleteFavoriteService(undefined, {
        params: { id: favoriteService.rwaziServiceId },
      });
    }

    const emptyFavoriteServices =
      await client.CoreController_getFavoriteServices();
    expect(emptyFavoriteServices.length).toBe(0);
  });

  it('Unauthenticated users cannot list, create, delete favorite services', async () => {
    const axiosInstance = axios.create({
      headers: {},
    });
    const client = createApiClient(`http://localhost:${port}`, {
      axiosInstance,
    });

    await expect(() =>
      client.CoreController_getFavoriteServices(),
    ).rejects.toThrow('Request failed with status code 401');

    await expect(() =>
      client.CoreController_createFavoriteService(undefined, {
        params: { id: randomUUID() },
      }),
    ).rejects.toThrow('Request failed with status code 401');

    await expect(() =>
      client.CoreController_deleteFavoriteService(undefined, {
        params: { id: randomUUID() },
      }),
    ).rejects.toThrow('Request failed with status code 401');
  });
});
