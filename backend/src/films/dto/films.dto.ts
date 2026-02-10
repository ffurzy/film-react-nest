//TODO описать DTO для запросов к /films
export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class FilmsResponseDto {
  items: FilmDto[];
  total: number;
}

export class SessionDto {
  id: string;
  daytime: string;
  hall: string;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class ScheduleResponseDto {
  total: number;
  items: SessionDto[];
}