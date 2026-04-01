Create a new database model using Prisma ORM. Ask the user what data they want to store.

Steps:

1. Determine the model name and fields based on the user's description
2. Add the model definition to prisma/schema.prisma
3. If the model has a user-owned field, add a relation to the User model: `userId String` with `user User @relation(fields: [userId], references: [id], onDelete: Cascade)` — and add the reverse relation on the User model
4. Run `npm run db:push` to sync the schema to the database
5. Create a server action that uses `prisma` from lib/db/prisma.ts to create and query data. Use `auth()` from auth.ts to get the current user's ID for filtering.
6. Show the user a quick example of how to use the new model in a component
