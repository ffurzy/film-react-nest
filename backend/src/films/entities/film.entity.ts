import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'double precision', nullable: false })
  rating: number;

  @Column({ type: 'varchar', nullable: false })
  director: string;

  @Column({ type: 'text', nullable: false })
  tags: string;

  @Column({ type: 'varchar', nullable: false })
  image: string;

  @Column({ type: 'varchar', nullable: false })
  cover: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  about: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film)
  schedules: Schedule[];
}
