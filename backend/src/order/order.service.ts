import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  CreateOrderItemDto,
  OrderResponseDto,
  OrderItemDto,
} from './dto/order.dto';
import {
  FilmsRepository,
  FilmNotFoundError,
  SessionNotFoundError,
  SeatConflictError,
} from '../repository/films.repository';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepo: FilmsRepository) {}

  async createOrder(items: CreateOrderItemDto[]): Promise<OrderResponseDto> {
    const groups = new Map<string, CreateOrderItemDto[]>();

    for (const item of items) {
      const key = `${item.film}__${item.session}`;
      const arr = groups.get(key) ?? [];
      arr.push(item);
      groups.set(key, arr);
    }

    for (const [, groupItems] of groups) {
      const { film, session } = groupItems[0];
      const seatKeys = groupItems.map((x) => `${x.row}:${x.seat}`);

      try {
        await this.filmsRepo.reserveSeats(film, session, seatKeys);
      } catch (e) {
        if (e instanceof FilmNotFoundError) {
          throw new NotFoundException('Фильм не найден');
        }
        if (e instanceof SessionNotFoundError) {
          throw new NotFoundException('Сеанс не найден');
        }
        if (e instanceof SeatConflictError) {
          throw new ConflictException('Место занято');
        }
        throw e;
      }
    }

    const responseItems: OrderItemDto[] = items.map((i) => ({
      ...i,
      id: randomUUID(),
    }));

    return {
      total: responseItems.length,
      items: responseItems,
    };
  }
}
