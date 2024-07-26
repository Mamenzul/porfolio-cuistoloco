import { SQL, sql } from "drizzle-orm";
import { AnyPgColumn, pgTableCreator, timestamp } from "drizzle-orm/pg-core";
export const createTable = pgTableCreator(
  (name) => `porfolio-cuistoloco_${name}`,
);

export const lifecycleDates = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`current_timestamp`)
    .$onUpdate(() => new Date()),
};

export function lower(email: AnyPgColumn): SQL {
  return sql`lower(${email})`;
}
