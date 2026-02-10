import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<FilmDocument>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmModel.find().lean();
  }

  async findByFilmId(filmId: string): Promise<Film> {
    const film = await this.filmModel.findOne({ id: filmId }).lean();
    if (!film) throw new NotFoundException('Фильм не найден');
    return film;
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void> {
    const filmExists = await this.filmModel.exists({ id: filmId });
    if (!filmExists) throw new NotFoundException('Фильм не найден');

    const res = await this.filmModel.updateOne(
      {
        id: filmId,
        schedule: {
          $elemMatch: {
            id: sessionId,
            taken: { $nin: seatKeys },
          },
        },
      },
      {
        $addToSet: { 'schedule.$.taken': { $each: seatKeys } },
      },
    );

    if (res.matchedCount === 0) {
      const film = await this.filmModel
        .findOne({ id: filmId, 'schedule.id': sessionId })
        .lean();
      if (!film) throw new NotFoundException('нет sessionId');

      throw new ConflictException('Место занято');
    }
  }
}
