import React, { useState } from 'react';
import { CauseList, Court, Case } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { downloadCasePdf, downloadAllCauseLists } from '../utils/fileDownloader';
import { DownloadIcon, PdfIcon, AlertTriangleIcon, ChevronDownIcon } from './icons';

interface ResultsDisplayProps {
  causeList: CauseList | null;
  isLoading: boolean;
  error: string | null;
  searchParams: { complex: string; date: string; };
  onRetry: () => void;
}

const CaseRow: React.FC<{ caseData: Case; courtName: string; }> = ({ caseData, courtName }) => (
    <tr className="border-b border-[#D4E7C5] hover:bg-[#F0F7E8]">
        <td className="p-3 text-sm text-gray-700">{caseData.serialNumber}</td>
        <td className="p-3 text-sm text-gray-900 font-medium">{caseData.caseNumber}</td>
        <td className="p-3 text-sm text-gray-700">{caseData.parties}</td>
        <td className="p-3 text-sm text-gray-700">{caseData.petitionerAdvocate}</td>
        <td className="p-3 text-sm text-gray-700">{caseData.respondentAdvocate}</td>
        <td className="p-3 text-center">
            {caseData.pdfAvailable ? (
                <button
                    onClick={() => downloadCasePdf(courtName, caseData)}
                    className="flex items-center gap-1 text-sm text-[#99BC85] hover:text-[#8AB079] font-medium disabled:opacity-50"
                    title="Download Case Details as TXT"
                >
                    <PdfIcon className="h-4 w-4" />
                    <span>Download</span>
                </button>
            ) : (
                <span className="text-xs text-gray-400">N/A</span>
            )}
        </td>
    </tr>
);

const CourtAccordion: React.FC<{ court: Court, isOpen: boolean, onToggle: () => void }> = ({ court, isOpen, onToggle }) => {
  return (
    <div className="border border-[#D4E7C5] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-[#D4E7C5] hover:bg-[#C3D9B5] focus:outline-none focus:ring-2 focus:ring-[#99BC85]"
      >
        <h3 className="text-lg font-semibold text-slate-800 text-left">{court.courtName}</h3>
        <ChevronDownIcon className={`h-6 w-6 text-gray-500 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="bg-white overflow-x-auto">
          <table className="min-w-full divide-y divide-[#D4E7C5]">
            <thead className="bg-[#E1F0DA]">
              <tr>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">S.No.</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Case No.</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Parties</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Petitioner Advocate</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Respondent Advocate</th>
                <th className="p-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#D4E7C5]">
              {court.cases.map(caseData => (
                <CaseRow key={caseData.serialNumber} caseData={caseData} courtName={court.courtName} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ causeList, isLoading, error, searchParams, onRetry }) => {
  const [openCourtIndex, setOpenCourtIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenCourtIndex(openCourtIndex === index ? null : index);
  };
  
  if (isLoading) {
    return <LoadingSpinner message="Generating Cause List... This may take a moment." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md" role="alert">
        <div className="flex items-center">
            <AlertTriangleIcon className="h-6 w-6 mr-3"/>
            <div>
                <p className="font-bold">An Error Occurred</p>
                <p className="text-sm">{error}</p>
            </div>
        </div>
        <div className="mt-4 text-right">
            <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
                Try Again
            </button>
        </div>
      </div>
    );
  }

  if (!causeList) {
    return null; // Initial state, don't show anything
  }
  
  if (causeList.length === 0) {
      return (
          <div className="text-center p-8 bg-white rounded-lg shadow-md border border-[#D4E7C5]">
              <h2 className="text-xl font-semibold text-gray-700">No Results Found</h2>
              <p className="text-gray-500 mt-2">No cause list data could be generated for the selected criteria.</p>
          </div>
      )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-[#D4E7C5]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Cause List for {searchParams.complex}</h2>
                <p className="text-sm text-gray-500 mt-1">Date: {new Date(searchParams.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <button
                onClick={() => downloadAllCauseLists(causeList, searchParams.complex, searchParams.date)}
                className="flex items-center justify-center gap-2 mt-4 md:mt-0 w-full md:w-auto px-4 py-2 bg-[#99BC85] text-white font-semibold rounded-lg shadow-md hover:bg-[#8AB079] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99BC85] transition-all duration-300"
            >
                <DownloadIcon className="h-5 w-5" />
                <span>Download Complete List</span>
            </button>
        </div>
        <div className="space-y-4">
            {causeList.map((court, index) => (
                <CourtAccordion
                    key={court.courtName}
                    court={court}
                    isOpen={openCourtIndex === index}
                    onToggle={() => handleToggle(index)}
                />
            ))}
        </div>
    </div>
  );
};

export default ResultsDisplay;