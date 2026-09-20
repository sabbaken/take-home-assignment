import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentVariables } from '../config/env.validation';
import { Country, Department, Employee, Role } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => {
        // Read through locals: inside the options literal TypeScript would infer
        // `get`'s type from TypeORM's option types instead of EnvironmentVariables.
        const host = config.get('DB_HOST', { infer: true });
        const port = config.get('DB_PORT', { infer: true });
        const username = config.get('DB_USER', { infer: true });
        const password = config.get('DB_PASSWORD', { infer: true });
        const database = config.get('DB_NAME', { infer: true });

        return {
          type: 'mysql' as const,
          host,
          port,
          username,
          password,
          database,
          entities: [Country, Department, Employee, Role],
          // The schema ships with the assignment and is already seeded —
          // the ORM must never alter it.
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
