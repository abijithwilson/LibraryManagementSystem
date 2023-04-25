import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import databaseConfig from './config/database.config';
import validationSchemaConfig from './config/validationSchema.config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration, databaseConfig],
      isGlobal: true,
      validationSchema: validationSchemaConfig
    })
  ],
  providers: [],
  exports: []
})
export class AppModule {}
