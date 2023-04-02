// For data persistence we're going to be using PostgreSQL,
// with the help of the following macOS tooling:
// https://postgresapp.com/
// https://tableplus.com/

// Some other tools that we'll make use of are:
// Prisma Client: Auto-generated and type-safe query builder for Node.js & TypeScript
// Prisma Migrate: Migration tool to easily evolve your database schema from prototyping to production
// Prisma Studio: GUI to view and edit data in your database
// `prisma.prisma` VS Code extension.

// The git ignored .env file should contain an entry that matches the following format:
// DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"

// When running PostgreSQL locally on macOS, your user and password as well as the database name
// typically correspond to the current user of your OS:
// DATABASE_URL="postgresql://vitaly:vitaly@localhost:5432/vitaly?schema=public"

// yarn add -D prisma
// npx prisma init
// npx prisma db pull
// npx prisma migrate dev --name init
// yarn add @prisma/client

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Write your Prisma Client queries here.
  // const user = await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io',
  //   },
  // });
  // console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
