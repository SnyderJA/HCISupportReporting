export enum SUPPORT_PERCENTAGE_ENUM {
  'FULL' = 100,
  'SEVENT-FIVE' = 75,
  'A-HALF' = 50,
  'TWO-FIVE' = 25,
  'ZERO' = 0,
}

export const THRESHOLD = 2.5;

export const START_STATUS_OF_EACH_WORKFLOW = [
  'Review', // IT-Change Management-v1
  'Request Submitted', // App Suggestion Request
  'Open', // IT-default-v1, IT-Incident Management-v1, IT-Problem Management-v1
  'Waiting for support', // IT-Service Request Fulfilment-v1
  'Bug Reported', // Support Bug Reported
];
