import { Body, Controller, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderItemDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() items: CreateOrderItemDto[]): Promise<OrderResponseDto> {
    return this.orderService.createOrder(items);
  }
}
