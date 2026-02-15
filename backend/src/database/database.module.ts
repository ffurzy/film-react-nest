import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');

        if (!url) {
          throw new Error('DATABASE_URL is not defined');
        }

        const parsed = new URL(url);

        return {
          type: 'postgres',
          host: parsed.hostname,
          port: Number(parsed.port) || 5432,
          database: parsed.pathname.replace('/', ''),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          synchronize: false,
          entities: [Film, Schedule],
        };
      },
    }),

    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
