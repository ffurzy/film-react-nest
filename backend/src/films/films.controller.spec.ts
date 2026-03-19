import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

const mockFilms = {
  total: 2,
  items: [
    { id: '1', title: 'бумер' },
    { id: '2', title: 'бригада' },
  ],
};

const mockSchedule = {
  total: 1,
  items: [{ id: '1', daytime: '10:00', taken: [] }],
};

const mockFilmsService = {
  getFilms: jest.fn().mockResolvedValue(mockFilms),
  getScheduleByFilmId: jest.fn().mockResolvedValue(mockSchedule),
};

describe('FilmsController', () => {
  let controller: FilmsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('контроллер должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilms()', () => {
    it('должен вернуть список фильмов', async () => {
      const result = await controller.getFilms();

      expect(result).toEqual(mockFilms);
    });

    it('должен вызвать filmsService.getFilms один раз', async () => {
      await controller.getFilms();

      expect(mockFilmsService.getFilms).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSchedule()', () => {
    it('должен вернуть расписание фильма', async () => {
      const result = await controller.getSchedule('1');

      expect(result).toEqual(mockSchedule);
    });

    it('должен вызвать getScheduleByFilmId с правильным id', async () => {
      await controller.getSchedule('1');

      expect(mockFilmsService.getScheduleByFilmId).toHaveBeenCalledWith('1');
    });

    it('должен вызвать getScheduleByFilmId один раз', async () => {
      await controller.getSchedule('1');

      expect(mockFilmsService.getScheduleByFilmId).toHaveBeenCalledTimes(1);
    });
  });
});
