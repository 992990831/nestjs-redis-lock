import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api/api.controller';
import * as redisStore from 'cache-manager-redis-store';

import { RedisModule } from 'nestjs-redis';
import { RedisLockModule } from 'nestjs-simple-redis-lock';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    RedisModule.register({
      host: 'localhost',
      port: 6379,
    }),
    RedisLockModule.register({}),
  ],
  controllers: [AppController, ApiController],
  providers: [AppService],
})
export class AppModule {}
