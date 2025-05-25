import { Model } from 'sequelize-typescript';
import * as setCookie from 'set-cookie-parser';

export function getTokenCookieFromHeaders(headers: { [index: string]: string }) {
  try {
    const cookies = setCookie.parse(headers['set-cookie'][0]);
    return cookies[0];
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function toBasicJson<T extends Model>(o: T) {
  return JSON.parse(JSON.stringify(o));
}
