import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

const isTsNode = !!process.env.TS_NODE || process.argv.some(arg => arg.includes("ts-node"));

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.POSTGRES_URL,
  // prevents auto sync since we are using migration
  synchronize: false,
  entities: isTsNode
    ? ["src/**/*.entity{.ts,.js}"] // scripts run via ts-node
    : ["dist/**/*.entity{.ts,.js}"], // regular compiled app
  migrations: ["dist/db/migrations/*{.ts,.js}"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
