import type { Logger } from "pino";

declare module "next" {
  interface NextApiRequest {
    log: Logger;
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
