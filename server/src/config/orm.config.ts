import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getTypeOrmModuleOptions = (
  configService?: ConfigService,
): TypeOrmModuleOptions => {
  if (configService) {
    return {
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: parseInt(configService.get<string>('DB_PORT')),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/domains/**/*.entity.{ts,js}'],
      synchronize: configService.get<string>('NODE_ENV') === 'development',
      autoLoadEntities: true,
      migrationsRun: true,
    };
  } else {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/domains/**/*.entity.{ts,js}'],
      synchronize: process.env.NODE_ENV === 'development',
      autoLoadEntities: true,
    };
  }
};

export const OrmConfig = {
  ...getTypeOrmModuleOptions(),
  migrationsTableName: 'migrations',
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations',
  },
};

export default OrmConfig;
