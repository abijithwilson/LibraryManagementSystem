import { Module } from '@nestjs/common';
import { connectionProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  providers: [connectionProvider, DatabaseService],
  exports: [DatabaseService]
})
export class DatabaseModule {}
