import { Test, TestingModule } from '@nestjs/testing';
import { Route4meService } from './route4me.service';

describe('Route4meService', () => {
  let service: Route4meService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Route4meService],
    }).compile();

    service = module.get<Route4meService>(Route4meService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
