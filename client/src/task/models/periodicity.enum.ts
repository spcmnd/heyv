export enum PeriodicityEnum {
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
  Annually = 'ANNUALLY',
}

export const frenchPeriodicityDictionnary: {
  [key in PeriodicityEnum]: string;
} = {
  DAILY: 'Jour',
  WEEKLY: 'Semaine',
  MONTHLY: 'Mois',
  ANNUALLY: 'Année',
};
