import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import pg from "pg";
import { Signer } from "@aws-sdk/rds-signer";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/run-sql.mjs <file.sql>");
  process.exit(1);
}

const signer = new Signer({
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
  username: process.env.PGUSER || "postgres",
  port: 5432,
});

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE || "postgres",
  port: 5432,
  user: process.env.PGUSER || "postgres",
  password: () => signer.getAuthToken(),
  ssl: { rejectUnauthorized: false },
  max: 4,
});

const sql = readFileSync(path.join(__dirname, file), "utf8");

try {
  await pool.query(sql);
  console.log(`✓ Executed ${file}`);
} catch (err) {
  console.error(`✗ Failed executing ${file}:`, err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
