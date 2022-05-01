import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { TaskModule } from './domains/task/task.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
