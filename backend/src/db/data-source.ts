import { DataSource, DataSourceOptions } from "typeorm";
require("dotenv").config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: process.env.POSTGRES_URL,
  // prevents auto sync since we are using migration
  synchronize: false,
  entities: ["dist/**/*.entity{.ts,.js}"],
  migrations: ["dist/db/migrations/*{.ts,.js}"],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
