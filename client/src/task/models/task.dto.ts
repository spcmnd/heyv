import { PeriodicityEnum } from './periodicity.enum';

export interface TaskCreationDto {
  title: string;
  occurrence: number;
  periodicity: PeriodicityEnum;
}

export interface TaskDto {
  id: number;
  title: string;
  occurrence: number;
  periodicity: PeriodicityEnum;
  dueDate: string;
}

export interface TaskUpdateDto {
  title: string;
  occurrence: number;
  periodicity: PeriodicityEnum;
}
