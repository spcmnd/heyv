import { PeriodicityEnum } from './periodicity.enum';

export interface TaskCreationDto {
  title: string;
  occurrence: number;
  periodicity: PeriodicityEnum;
}
