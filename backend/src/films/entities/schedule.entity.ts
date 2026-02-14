import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  daytime: string;

  @Column({ type: 'int', nullable: false })
  hall: number;

  @Column({ type: 'int', nullable: false })
  rows: number;

  @Column({ type: 'int', nullable: false })
  seats: number;

  @Column({ type: 'double precision', nullable: false })
  price: number;

  @Column({ type: 'text', default: '', nullable: false })
  taken: string;

  @Column('uuid')
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedules)
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
