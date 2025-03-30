import { uuid, varchar, integer, text, date, boolean, timestamp, pgTable, pgEnum } from "drizzle-orm/pg-core";

//CONCERN USERS 
export const STATUS_ENUM = pgEnum('status', [  
    'PENDING', 
    'APPROVED', 
    'REJECTED'
]);
export const ROLE_ENUM = pgEnum('role', [     
    'USER',
    'ADMIN'
]);
//CONCERN BOOKS
export const BORROW_STATUS_ENUM = pgEnum('borrow_status', [
    'BORROWED', 
    'RETURNED'
]);


export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", {length: 255}).notNull(),   //Maxiumum of 255 character
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull().unique(),
  password: text('password').notNull(),
  universityCard: text('university_card').notNull().unique(),
  status: STATUS_ENUM('status').default('PENDING'),
  role: ROLE_ENUM('role').default('USER'),
  lastActivityDate: date('last_activity_date').defaultNow(),

  /*{ withTimezone: true } explicitly tells Drizzle to use PostgreSQL's timestamptz (timestamp with timezone)*/
  createdAt: timestamp('created_at', { withTimezone: true, }).defaultNow(),
});




//npx drizzle-kit generate : generates sql command  from schema
//npx drizzle-kit migrate : applies sql command  to DB