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

describe('Search', () => {
  jest.setTimeout(35000);
  const port = 8303;

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

  it('Search by types in Hanoi', async () => {
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
      expect(service.name.startsWith('HN ')).toBeTruthy();
    }
  });

  it('Search by types in Saigon', async () => {
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
        lat: 10.830070607086515,
        lon: 106.67867927363264,
        types: ['pharmacy', 'restaurant', 'supermarket'].join(','),
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);
    for (const service of rwaziServices) {
      expect(service.name.startsWith('SG ')).toBeTruthy();
    }
  });

  it('Search by name in Hanoi', async () => {
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
        name: 'HN Larkin and Sons',
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);
    for (const service of rwaziServices) {
      expect(service.name).toBe('HN Larkin and Sons');
    }
  });

  it('Search by name in Saigon', async () => {
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
        lat: 10.830070607086515,
        lon: 106.67867927363264,
        name: 'SG Berge Inc',
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);
    for (const service of rwaziServices) {
      expect(service.name).toBe('SG Berge Inc');
    }
  });

  it('Search by name and type in Hanoi', async () => {
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
        name: 'HN Larkin and Sons',
        types: 'restaurant,gasStation',
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);
    for (const service of rwaziServices) {
      expect(service.name).toBe('HN Larkin and Sons');
      expect(service.type).toBe('gasStation');
    }
  });

  it('Search by name and type in Saigon', async () => {
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
        lat: 10.830070607086515,
        lon: 106.67867927363264,
        name: 'SG Berge Inc',
        types: 'pharmacy,gasStation',
      },
    });
    expect(rwaziServices.length).toBeGreaterThan(0);
    for (const service of rwaziServices) {
      expect(service.name).toBe('SG Berge Inc');
      expect(service.type).toBe('pharmacy');
    }
  });

  it('Search in Hanoi with big search radius', async () => {
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
        'search-radius': 100,
        lat: 21.023879933295056,
        lon: 105.83249490449899,
      },
    });
    expect(rwaziServices.length).toBe(300); // all data in Hanoi
    for (const service of rwaziServices) {
      expect(service.name.startsWith('HN ')).toBeTruthy();
    }
  });

  it('Search in Saigon with big search radius', async () => {
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
        'search-radius': 100,
        lat: 10.830070607086515,
        lon: 106.67867927363264,
      },
    });
    expect(rwaziServices.length).toBe(300); // all data in Saigon
    for (const service of rwaziServices) {
      expect(service.name.startsWith('SG ')).toBeTruthy();
    }
  });

  it('Unauthenticated users cannot search services', async () => {
    const axiosInstance = axios.create({
      headers: {},
    });
    const client = createApiClient(`http://localhost:${port}`, {
      axiosInstance,
    });

    await expect(() =>
      client.CoreController_searchRwaziService({
        queries: {
          'search-radius': 100,
          lat: 10.830070607086515,
          lon: 106.67867927363264,
        },
      }),
    ).rejects.toThrow('Request failed with status code 401');
  });
});
