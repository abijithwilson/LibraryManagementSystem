import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as K from '../shared/constants';

@Injectable()
export class DatabaseService {
  private logger = new Logger(DatabaseService.name);

  constructor(
    private configService: ConfigService,
    @Inject(K.POSTGRES_CONNECTION) public pool: Pool
  ) {
    pool.connect().then(
      (val) => {
        this.logger.log('connection successfull');
      },
      (err) => {
        this.logger.error('connection error');
        throw new Error(err);
      }
    );
  }
}
