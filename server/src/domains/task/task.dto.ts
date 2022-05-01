import {
  IsEnum,
  IsNotEmpty,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
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
  @MaxLength(64)
  @MinLength(8)
  title: string;

  @IsNotEmpty()
  @Min(1)
  @Max(3)
  occurrence: number;

  @IsNotEmpty()
  @IsEnum(TaskPeriodicity)
  periodicity: TaskPeriodicity;
}
