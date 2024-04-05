import { Sequelize } from "sequelize-typescript";
import { Dialect, PoolOptions } from "sequelize";
import config from "config";
import { Users } from "../models/users";
import { Posts } from "../models/posts";
import { UserPosts } from "../models/usersPosts";
import { FavoritePosts } from "../models/favoritePosts";
import { Threads } from "../models/threads";
import { ThreadMessages } from "../models/threadMessages";
import { getLogger } from "./logging";

export type ConnectionOptionsType = {
  type?: Dialect;
  dialect?: Dialect;
  host: string;
  port?: string | number;
  database: string;
  username: string;
  password: string;
  pool?: PoolOptions;
};

export async function connect(): Promise<Sequelize> {
  const options = config.get<ConnectionOptionsType>("db");
  const logger = getLogger("db");

  // @ts-ignore
  const sequelize = new Sequelize({
    dialect: options.dialect || options.type || "postgres",
    host: options.host,
    database: options.database,
    username: options.username,
    password: options.password,
    benchmark: true,
    pool: options.pool,
    transactionType: "IMMEDIATE" as any,
    models: [Users, Posts, UserPosts, FavoritePosts, Threads, ThreadMessages],
    /* @ts-ignore */
    logging: (str, timing, args: any) => {
      const logDetails = { timing, bind: undefined, trx: undefined };
      let msg = str;
      if (str.indexOf("Exec") === 0) {
        // Extract transaction id, cleanup ugly 'Executing (default): SELECT ...'
        const p0 = str.indexOf("(");
        const p1 = str.indexOf(")");
        const trx = str.substring(p0 + 1, p1);
        msg = str.slice(p1 + 3);
        logDetails.trx = trx === "default" ? undefined : trx;
      }
      if (args && args.bind) {
        logDetails.bind = args.bind;
      }
      logger.debug(logDetails, msg);
    },
  });
  return sequelize;
}
