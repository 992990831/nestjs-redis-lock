import { Controller, Get, CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { RedisLockService, RedisLock } from 'nestjs-simple-redis-lock';

@Controller('api')
export class ApiController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    protected readonly lockService: RedisLockService, // inject RedisLockService
  ) {}

  @Get('long')
  /**
   * Automatically unlock after 1 min
   * Try again after 50ms if failed
   * The max times to retry is 200
   */
  @RedisLock('prod-001-lock', 1 * 60 * 1000, 50, 200)
  async getLongService(): Promise<string> {
    const balance = (await this.cacheManager.get('prod-001')) as number;

    if (balance <= 0) {
      return 'out of stock';
    }

    await new Promise((resolve) =>
      setTimeout(() => {
        console.log('do sonething long');
        resolve(1);
      }, 5000),
    );

    await this.cacheManager.set('prod-001', balance - 1, { ttl: 0 });

    return 'order created';
  }
}
