import { execSync } from 'child_process';

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name.');
  process.exit(1);
}

try {
  execSync(
    `yarn run typeorm migration:generate ./src/migrations/${migrationName}`,
    { stdio: 'inherit' },
  );
  console.log('Migration generated successfully.');
} catch (error) {
  console.error('Error generating migration:', (error as Error).message);
}
