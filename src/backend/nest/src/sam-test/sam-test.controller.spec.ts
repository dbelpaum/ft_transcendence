import { Test, TestingModule } from '@nestjs/testing';
import { SamTestController } from './sam-test.controller';

describe('SamTestController', () => {
  let controller: SamTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SamTestController],
    }).compile();

    controller = module.get<SamTestController>(SamTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
