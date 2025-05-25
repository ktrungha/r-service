import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const LoginReqData = z
  .object({ username: z.string(), password: z.string().min(8).max(72) })
  .passthrough();
const LoginWithPasswordSuccess = z
  .object({
    token: z.string().nullish(),
    success: z.boolean().default(true),
    sessionId: z.string(),
  })
  .passthrough();
const CreateUserData = z
  .object({
    username: z.string().regex(/^([a-zA-Z0-9]|-|_){3,32}$/),
    password: z.string().min(8).max(72),
  })
  .passthrough();
const User = z
  .object({
    id: z.string(),
    username: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  })
  .passthrough();
const RegisterUserSuccess = z.object({ user: User }).passthrough();
const SimpleSuccessResponse = z.object({ success: z.boolean() }).passthrough();
const RwaziService = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    lat: z.number(),
    lon: z.number(),
  })
  .passthrough();
const UserFavoriteRwaziService = z
  .object({
    userId: z.string(),
    rwaziServiceId: z.string(),
    createdAt: z.string().datetime({ offset: true }),
    rwaziService: RwaziService,
  })
  .passthrough();

export const schemas = {
  LoginReqData,
  LoginWithPasswordSuccess,
  CreateUserData,
  User,
  RegisterUserSuccess,
  SimpleSuccessResponse,
  RwaziService,
  UserFavoriteRwaziService,
};

const endpoints = makeApi([
  {
    method: 'post',
    path: '/authen/create-user',
    alias: 'AuthenController_createUser',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateUserData,
      },
    ],
    response: RegisterUserSuccess,
  },
  {
    method: 'post',
    path: '/authen/login',
    alias: 'AuthenController_loginWithPassword',
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: LoginReqData,
      },
    ],
    response: LoginWithPasswordSuccess,
  },
  {
    method: 'post',
    path: '/authen/seed-users',
    alias: 'AuthenController_seedUsers',
    requestFormat: 'json',
    response: z.object({ success: z.boolean() }).passthrough(),
  },
  {
    method: 'get',
    path: '/rwazi-service/favorite',
    alias: 'CoreController_getFavoriteServices',
    requestFormat: 'json',
    response: z.array(UserFavoriteRwaziService),
  },
  {
    method: 'put',
    path: '/rwazi-service/favorite/:id',
    alias: 'CoreController_createFavoriteService',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ success: z.boolean() }).passthrough(),
  },
  {
    method: 'delete',
    path: '/rwazi-service/favorite/:id',
    alias: 'CoreController_deleteFavoriteService',
    requestFormat: 'json',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ success: z.boolean() }).passthrough(),
  },
  {
    method: 'get',
    path: '/rwazi-service/search',
    alias: 'CoreController_searchRwaziService',
    requestFormat: 'json',
    parameters: [
      {
        name: 'lat',
        type: 'Query',
        schema: z.number(),
      },
      {
        name: 'lon',
        type: 'Query',
        schema: z.number(),
      },
      {
        name: 'search-radius',
        type: 'Query',
        schema: z.number(),
      },
      {
        name: 'name',
        type: 'Query',
        schema: z.string().optional(),
      },
      {
        name: 'types',
        type: 'Query',
        schema: z.string().optional(),
      },
    ],
    response: z.array(RwaziService),
  },
  {
    method: 'post',
    path: '/rwazi-service/seed',
    alias: 'CoreController_seedData',
    requestFormat: 'json',
    response: z.object({ success: z.boolean() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
