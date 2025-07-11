import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

const isTsNode = !!process.env.TS_NODE || process.argv.some(arg => arg.includes("ts-node"));

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  // Use individual connection parameters or fallback to URL
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // Fallback to URL if individual params not provided
  url: process.env.POSTGRES_URL,
  // SSL configuration for production (Supabase requires SSL)
  ssl: process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // prevents auto sync since we are using migration
  synchronize: false,
  entities: isTsNode
    ? ["src/**/*.entity{.ts,.js}"] // scripts run via ts-node
    : ["dist/**/*.entity{.ts,.js}"], // regular compiled app
  migrations: ["dist/db/migrations/*{.ts,.js}"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
