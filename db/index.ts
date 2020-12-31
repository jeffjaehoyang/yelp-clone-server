import { Pool } from 'pg';

const pool = new Pool();

export const db = {
  query: (text, params) => pool.query(text, params),
};
