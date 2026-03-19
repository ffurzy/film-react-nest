import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

const mockOrder = {
  id: '1',
  tickets: [{ film: 'бумер', row: 1, seat: 5 }],
};

const mockOrderService = {
  createOrder: jest.fn().mockResolvedValue(mockOrder),
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('контроллер должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder()', () => {
    const validBody = {
      email: 'test@test.com',
      phone: '+19999999999',
      tickets: [
        {
          film: '11111111-1111-1111-1111-111111111111',
          session: '22222222-2222-2222-2222-222222222222',
          daytime: '22:22',
          row: 1,
          seat: 5,
          price: 300,
        },
      ],
    };

    it('должен вернуть созданный заказ', async () => {
      const result = await controller.createOrder(validBody);

      expect(result).toEqual(mockOrder);
    });

    it('должен вызвать orderService.createOrder с tickets из body', async () => {
      await controller.createOrder(validBody);

      expect(mockOrderService.createOrder).toHaveBeenCalledWith(validBody.tickets);
    });

    it('должен вызвать orderService.createOrder ровно один раз', async () => {
      const body = { email: 'a@b.ru', phone: '8', tickets: [] };
      await controller.createOrder(body);

      expect(mockOrderService.createOrder).toHaveBeenCalledTimes(1);
    });
  });
});
