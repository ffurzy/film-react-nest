//TODO реализовать DTO для /orders

export class CreateOrderItemDto {
  film: string;
  session: string;
  daytime: string;
  row: number;
  seat: number;
  price: number;
}

export class OrderItemDto extends CreateOrderItemDto {
  id: string;
}

export class OrderResponseDto {
  total: number;
  items: OrderItemDto[];
}
