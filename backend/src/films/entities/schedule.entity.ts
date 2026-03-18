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

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  taken: string[];

  @Column({ name: 'filmId', type: 'uuid' })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedules, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'filmId' })
  film: Film;
}
