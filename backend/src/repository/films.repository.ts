import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

@Injectable()
export class FilmsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepo.find();
  }

  async findByFilmId(filmId: string): Promise<Film> {
    const film = await this.filmRepo.findOne({
      where: { id: filmId },
      relations: { schedules: true },
    });

    if (!film) throw new NotFoundException('Фильм не найден');
    return film;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const schedule = await manager.getRepository(Schedule).findOne({
        where: { id: sessionId, filmid: filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        const filmExists = await manager
          .getRepository(Film)
          .exist({ where: { id: filmId } });
        if (!filmExists) throw new NotFoundException('Фильм не найден');
        throw new NotFoundException('нет sessionId');
      }

      const takenStr = (schedule.taken ?? '').trim();
      const takenSet = new Set(
        takenStr === ''
          ? []
          : takenStr
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean),
      );

      const hasConflict = seatKeys.some((k) => takenSet.has(k));
      if (hasConflict) throw new ConflictException('Место занято');

      seatKeys.forEach((k) => takenSet.add(k));
      schedule.taken = Array.from(takenSet).join(',');

      await manager.getRepository(Schedule).save(schedule);
    });
  }
}
