import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ScraperForm from './components/ScraperForm';
import ResultsDisplay from './components/ResultsDisplay';
import { getStates, getDistricts, getCourtComplexes, getCauseList } from './services/geminiService';
import { CauseList } from './types';

const App: React.FC = () => {
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [courtComplexes, setCourtComplexes] = useState<string[]>([]);

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedComplex, setSelectedComplex] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDistrictsLoading, setIsDistrictsLoading] = useState(false);
  const [isComplexesLoading, setIsComplexesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [causeList, setCauseList] = useState<CauseList | null>(null);
  
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setError(null);
        const fetchedStates = await getStates();
        setStates(fetchedStates);
      } catch (e: any) {
        setError(e.message || "Failed to fetch states.");
      }
    };
    fetchStates();
  }, []);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setSelectedDistrict('');
    setDistricts([]);
    setSelectedComplex('');
    setCourtComplexes([]);
    setCauseList(null);
  };

  useEffect(() => {
    if (!selectedState) return;
    const fetchDistricts = async () => {
      try {
        setError(null);
        setIsDistrictsLoading(true);
        const fetchedDistricts = await getDistricts(selectedState);
        setDistricts(fetchedDistricts);
      } catch (e: any) {
        setError(e.message || "Failed to fetch districts.");
      } finally {
        setIsDistrictsLoading(false);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    setSelectedComplex('');
    setCourtComplexes([]);
    setCauseList(null);
  };

  useEffect(() => {
    if (!selectedDistrict) return;
    const fetchComplexes = async () => {
        try {
            setError(null);
            setIsComplexesLoading(true);
            const fetchedComplexes = await getCourtComplexes(selectedDistrict);
            setCourtComplexes(fetchedComplexes);
        } catch(e: any) {
            setError(e.message || "Failed to fetch court complexes.")
        } finally {
            setIsComplexesLoading(false);
        }
    }
    fetchComplexes();
  }, [selectedDistrict]);
  
  const handleSearch = useCallback(async () => {
    if (!selectedComplex || !selectedDate) {
      setError("Please select a court complex and a date.");
      return;
    }
    try {
      setError(null);
      setIsLoading(true);
      setCauseList(null);
      const fetchedCauseList = await getCauseList(selectedComplex, selectedDate);
      setCauseList(fetchedCauseList);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred while generating the cause list.");
      setCauseList(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedComplex, selectedDate]);

  return (
    <div className="min-h-screen bg-[#E1F0DA]">
      <Header />
      <main className="container mx-auto p-4 md:p-6 space-y-8">
        <ScraperForm
          states={states}
          districts={districts}
          courtComplexes={courtComplexes}
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedComplex={selectedComplex}
          selectedDate={selectedDate}
          onStateChange={handleStateChange}
          onDistrictChange={handleDistrictChange}
          onComplexChange={(e) => setSelectedComplex(e.target.value)}
          onDateChange={(e) => setSelectedDate(e.target.value)}
          onSearch={handleSearch}
          isLoading={isLoading}
          isDistrictsLoading={isDistrictsLoading}
          isComplexesLoading={isComplexesLoading}
        />
        <ResultsDisplay
          causeList={causeList}
          isLoading={isLoading}
          error={error}
          searchParams={{complex: selectedComplex, date: selectedDate}}
          onRetry={handleSearch}
        />
      </main>
      <footer className="text-center p-4 text-slate-600 text-sm">
        <p>&copy; {new Date().getFullYear()} eCourts Scraper. All data is AI-generated for demonstration purposes.</p>
      </footer>
    </div>
  );
};

export default App;