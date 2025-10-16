
import { CauseList, Court, Case } from '../types';

const generateContentForCase = (courtName: string, caseData: Case): string => {
  return `
-----------------------------------------
COURT: ${courtName}
-----------------------------------------
Serial Number: ${caseData.serialNumber}
Case Number:   ${caseData.caseNumber}
Parties:       ${caseData.parties}
Petitioner Advocate: ${caseData.petitionerAdvocate}
Respondent Advocate: ${caseData.respondentAdvocate}
-----------------------------------------
  `;
};

const generateContentForCourt = (courtData: Court): string => {
  let content = `
=========================================
      CAUSE LIST FOR: ${courtData.courtName}
=========================================
`;
  courtData.cases.forEach(caseData => {
    content += generateContentForCase(courtData.courtName, caseData);
  });
  return content;
};

const downloadTextFile = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadCasePdf = (courtName: string, caseData: Case) => {
  const content = generateContentForCase(courtName, caseData);
  const filename = `${caseData.caseNumber.replace(/[\/\s]/g, '_')}.txt`;
  downloadTextFile(content, filename);
};

export const downloadAllCauseLists = (causeList: CauseList, complexName: string, date: string) => {
  let fullContent = `
***************************************************
  COMPLETE CAUSE LIST FOR ${complexName.toUpperCase()}
  DATE: ${date}
***************************************************
`;
  causeList.forEach(court => {
    fullContent += generateContentForCourt(court);
  });

  const filename = `Complete_Cause_List_${complexName.replace(/\s/g, '_')}_${date}.txt`;
  downloadTextFile(fullContent, filename);
};
