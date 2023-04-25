import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as K from '../shared/constants';

export const connectionProvider = {
  provide: K.POSTGRES_CONNECTION,
  useFactory: (configService: ConfigService) => {
    const pool = new Pool({
      host: configService.get<string>('database.host'),
      database: configService.get<string>('database.name'),
      port: configService.get<number>('database.port'),
      user: configService.get<string>('database.username'),
      password: configService.get<string>('database.password')
    });
    return pool;
  },
  inject: [ConfigService]
};
