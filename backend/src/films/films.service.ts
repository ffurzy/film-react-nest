import { Injectable } from '@nestjs/common';
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

  async getFilms(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepo.findAll();

    return {
      total: films.length,
      items: films.map<FilmDto>((f) => ({
        id: f.id,
        rating: f.rating,
        director: f.director,
        tags: f.tags,
        title: f.title,
        about: f.about,
        description: f.description,
        image: f.image,
        cover: f.cover,
      })),
    };
  }

  async getScheduleByFilmId(filmId: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepo.findByFilmId(filmId);

    return {
      total: film.schedules.length,
      items: film.schedules.map<SessionDto>((s) => ({
        id: s.id,
        daytime: s.daytime,
        hall: s.hall,
        rows: s.rows,
        seats: s.seats,
        price: s.price,
        taken: (s.taken ?? '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      })),
    };
  }
}
