
export interface Case {
  serialNumber: number;
  caseNumber: string;
  parties: string;
  petitionerAdvocate: string;
  respondentAdvocate: string;
  pdfAvailable: boolean;
}

export interface Court {
  courtName: string;
  cases: Case[];
}

export type CauseList = Court[];
