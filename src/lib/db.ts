import { Pool, type ClientBase } from "pg";
import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { attachDatabasePool } from "@vercel/functions";

const signer = new Signer({
  credentials: awsCredentialsProvider({
    roleArn: process.env.AWS_ROLE_ARN as string,
    clientConfig: { region: process.env.AWS_REGION },
  }),
  region: process.env.AWS_REGION,
  hostname: process.env.PGHOST as string,
  username: process.env.PGUSER || "postgres",
  port: 5432,
});

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "postgres",
  port: 5432,
  user: process.env.PGUSER || "postgres",
  // IAM auth token (valid up to 15 minutes; regenerated per connection).
  password: () => signer.getAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 20,
});

attachDatabasePool(pool);

// Single-statement queries.
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T extends Record<string, unknown> ? T : never>(
    text,
    params as unknown[],
  );
}

// Multi-statement transactions.
export async function withConnection<T>(
  fn: (client: ClientBase) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}
