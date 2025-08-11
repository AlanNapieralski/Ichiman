import 'dotenv/config'
import { db } from '../src/db'
import { skillsTable } from '../src/db/schema'

async function main() {
  try {
    // Insert a userId=1 sample hierarchy
    const [guitar] = await db.insert(skillsTable).values({ name: 'Guitar', userId: 1, timeCount: 0 }).returning()
    const [chords] = await db.insert(skillsTable).values({ name: 'Chord Practice', userId: 1, timeCount: 0, parentId: guitar.id }).returning()
    const [scales] = await db.insert(skillsTable).values({ name: 'Scales', userId: 1, timeCount: 0, parentId: guitar.id }).returning()

    console.log('Seeded skills:', { guitar, chords, scales })
  } catch (err) {
    console.error('Failed to seed skills:', err)
    process.exitCode = 1
  }
}

main()
