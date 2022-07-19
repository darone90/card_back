import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from 'ormConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig as TypeOrmModule)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
