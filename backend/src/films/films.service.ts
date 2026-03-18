import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsRepository } from '../repository/films.repository';
import {
  FilmsResponseDto,
  ScheduleResponseDto,
  FilmDto,
  SessionDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepo: FilmsRepository) {}
  private toArray(value: unknown): string[] {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(String).filter(Boolean);

    const s = String(value).trim();
    if (!s) return [];
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepo.findAllWithSchedules();
    return {
      total: films.length,
      items: films.map<FilmDto>((f) => ({
        id: f.id,
        rating: f.rating,
        director: f.director,
        tags: this.toArray(f.tags),
        title: f.title,
        about: f.about,
        description: f.description,
        image: f.image,
        cover: f.cover,
        schedule: (f.schedules ?? []).map<SessionDto>((s) => ({
          id: s.id,
          session: s.id,
          daytime: s.daytime,
          hall: s.hall,
          rows: s.rows,
          seats: s.seats,
          price: s.price,
          taken: this.toArray(s.taken),
        })),
      })),
    };
  }

  async getScheduleByFilmId(filmId: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepo.findByFilmId(filmId);
    if (!film) throw new NotFoundException('Фильм не найден');

    return {
      total: film.schedules.length,
      items: film.schedules.map<SessionDto>((s) => ({
        id: s.id,
        session: s.id,
        daytime: s.daytime,
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: this.toArray(s.taken),
      })),
    };
  }
}
