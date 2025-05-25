import { Test } from '@nestjs/testing';
import { MySqlContainer } from '@testcontainers/mysql';
import { execSync } from 'child_process';
import { Connection, createConnection } from 'mysql2/promise';
import { Model } from 'sequelize-typescript';
import { addUsage } from '../src/setupUtils';

export async function setupApp() {
  const mySqlContainer = await new MySqlContainer('mysql')
    .withUsername('rwazi')
    .withUserPassword('rwazi')
    .withDatabase('rwazi')
    .withDroppedCapabilities()
    .start();
  execSync(
    `MYSQL_PORT=${mySqlContainer.getFirstMappedPort()} ./node_modules/db-migrate/bin/db-migrate up -e test`,
    {
      // stdio: 'inherit',
    },
  );

  process.env.MYSQL_PORT = `${mySqlContainer.getFirstMappedPort()}`;
  // this makes sure app.module is loaded after port for MySQL is overwritten above
  const { AppModule } = await import('../src/app.module');

  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  addUsage(app);

  const mySqlConnection = await createConnection(
    mySqlContainer.getConnectionUri(),
  );

  await Promise.all([app.init(), mySqlConnection.connect()]);

  return { app, mySqlContainer, moduleRef, mySqlConnection };
}

interface Class<Type extends Model> {
  new (): Type;
  getTableName: (typeof Model)['getTableName'];
}

export async function truncate(
  mySqlConnection: Connection,
  ...modelClasses: Class<Model>[]
) {
  await Promise.all(
    modelClasses.map((modelClass) => {
      const tableName = modelClass.getTableName();
      return mySqlConnection.execute(`TRUNCATE TABLE ${tableName} CASCADE;`);
    }),
  );
}
