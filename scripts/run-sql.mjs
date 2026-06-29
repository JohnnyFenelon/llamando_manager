import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";
import { DsqlSigner } from "@aws-sdk/dsql-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs <file.sql>");
  process.exit(1);
}

const signer = new DsqlSigner({
  ...(process.env.AWS_ROLE_ARN
    ? {
        credentials: awsCredentialsProvider({
          roleArn: process.env.AWS_ROLE_ARN,
          clientConfig: { region: process.env.AWS_REGION },
        }),
      }
    : {}),
  region: process.env.AWS_REGION || "us-east-1",
  hostname: process.env.PGHOST,
});

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "postgres",
  port: 5432,
  user: process.env.PGUSER || "admin",
  password: () => signer.getDbConnectAdminAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 4,
});

const sql = readFileSync(path.join(__dirname, file), "utf8");
const statements = sql
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

try {
  for (const statement of statements) {
    await pool.query(statement);
  }
  console.log(`✓ Executed ${file}`);
} catch (err) {
  console.error(`✗ Failed executing ${file}:`, err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
