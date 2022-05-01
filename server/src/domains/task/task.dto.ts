import { IsNotEmpty, IsEnum } from 'class-validator';
import { TaskPeriodicity } from './task.entity';

export class TaskDto {
  id: number;
  title: string;
  occurrence: number;
  periodicity: TaskPeriodicity;
  dueDate: string;
}

export class TaskCreationDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  occurrence: number;

  @IsNotEmpty()
  @IsEnum(TaskPeriodicity)
  periodicity: TaskPeriodicity;
}
