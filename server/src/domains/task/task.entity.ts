import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskDto } from './task.dto';

export enum TaskPeriodicity {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Annually = 'ANNUALLY',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  occurrence: number;

  @Column({ nullable: false })
  periodicity: TaskPeriodicity;

  @Column({ default: 0, nullable: false })
  doneCount: number;

  @Column({ nullable: false })
  dueDate: Date;

  public toDto(): TaskDto {
    return {
      id: this.id,
      title: this.title,
      occurrence: this.occurrence,
      periodicity: this.periodicity,
      dueDate: this.dueDate.toISOString(),
    };
  }
}
