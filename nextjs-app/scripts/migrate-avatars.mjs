import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import postgres from 'postgres';

// Load environment variables from .env.local
config({ path: '.env.local' });
config(); // Also try .env

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!supabaseUrl || !supabaseKey || !databaseUrl) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const sql = postgres(databaseUrl, { max: 1 });

async function migrateAvatars() {
  try {
    const uploadsDir = 'public/uploads/teams';
    const files = readdirSync(uploadsDir);

    console.log(`Found ${files.length} avatar files to migrate`);

    for (const filename of files) {
      const localPath = join(uploadsDir, filename);
      const fileBuffer = readFileSync(localPath);
      const supabasePath = `teams/${filename}`;

      console.log(`Uploading ${filename}...`);

      // Upload to Supabase
      const { error } = await supabase.storage
        .from('team-avatars')
        .upload(supabasePath, fileBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (error) {
        console.error(`Error uploading ${filename}:`, error.message);
        continue;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('team-avatars')
        .getPublicUrl(supabasePath);

      // Update database - find teams with this local path and update to Supabase URL
      const oldUrl = `/uploads/teams/${filename}`;
      const result = await sql`
        UPDATE teams
        SET avatar = ${publicUrl}
        WHERE avatar = ${oldUrl}
      `;

      console.log(`✓ Migrated ${filename} → ${publicUrl} (${result.count} teams updated)`);
    }

    console.log('\nMigration complete!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await sql.end();
  }
}

migrateAvatars();
