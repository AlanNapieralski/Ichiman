import 'dotenv/config'
import { sql } from 'drizzle-orm'
import { db } from '../src/db'

async function main() {
  try {
    await db.execute(sql`TRUNCATE TABLE "skills" RESTART IDENTITY CASCADE;`)
    console.log('Skills table truncated and identities reset.')
  } catch (err) {
    console.error('Failed to reset skills:', err)
    process.exitCode = 1
  }
}

main()
