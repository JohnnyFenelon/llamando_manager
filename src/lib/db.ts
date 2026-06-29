import { Pool, type ClientBase, type QueryResultRow } from "pg";
import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";
import { attachDatabasePool } from "@vercel/functions";

const signer = new DsqlSigner({
  ...(process.env.AWS_ROLE_ARN
    ? {
        credentials: awsCredentialsProvider({
          roleArn: process.env.AWS_ROLE_ARN as string,
          clientConfig: { region: process.env.AWS_REGION },
        }),
      }
    : {}),
  region: process.env.AWS_REGION || "us-east-1",
  hostname: process.env.PGHOST as string,
});

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "postgres",
  port: 5432,
  user: process.env.PGUSER || "admin",
  // IAM auth token for DSQL admin user
  password: () => signer.getDbConnectAdminAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 20,
});

attachDatabasePool(pool);

// Single-statement queries.
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
) {
  return pool.query<T>(text, params as unknown[]);
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
