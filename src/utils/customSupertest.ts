import { app } from '@src/server';
import supertest from 'supertest';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';

export interface TttpSupertestRequestParams {
  method: HttpMethod;
  endpoint: string;
  token: string;
  query?: any;
  body?: string | object;
}

export const httpSupertestRequest = async ({
  method,
  endpoint,
  token,
  query = {},
  body,
}: TttpSupertestRequestParams) => {
  switch (method) {
    case 'GET':
      return supertest(app)
        .get(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .query(query);
    case 'POST':
      return supertest(app)
        .post(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .send(body)
        .query(query);
    case 'PATCH':
      return supertest(app)
        .patch(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .send(body)
        .query(query);
    case 'PUT':
      return supertest(app)
        .put(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .send(body)
        .query(query);
    case 'DELETE':
      return supertest(app)
        .delete(endpoint)
        .set({ Authorization: `Bearer ${token}` })
        .query(query);
  }
};
