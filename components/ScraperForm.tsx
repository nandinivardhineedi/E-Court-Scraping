import React from 'react';
import { SearchIcon } from './icons';

interface ScraperFormProps {
  states: string[];
  districts: string[];
  courtComplexes: string[];
  selectedState: string;
  selectedDistrict: string;
  selectedComplex: string;
  selectedDate: string;
  onStateChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDistrictChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onComplexChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  isLoading: boolean;
  isDistrictsLoading: boolean;
  isComplexesLoading: boolean;
}

const SelectInput: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    placeholder: string;
    disabled?: boolean;
    isLoading?: boolean;
}> = ({ label, value, onChange, options, placeholder, disabled = false, isLoading = false }) => (
    <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                disabled={disabled || isLoading}
                className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2.5 text-slate-900 focus:ring-2 focus:ring-[#99BC85] focus:border-[#99BC85] disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
            >
                <option value="">{isLoading ? `Loading...` : placeholder}</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
        </div>
    </div>
);


const ScraperForm: React.FC<ScraperFormProps> = (props) => {
  const {
    states, districts, courtComplexes,
    selectedState, selectedDistrict, selectedComplex, selectedDate,
    onStateChange, onDistrictChange, onComplexChange, onDateChange,
    onSearch, isLoading, isDistrictsLoading, isComplexesLoading
  } = props;
  
  const isSearchDisabled = !selectedState || !selectedDistrict || !selectedComplex || !selectedDate || isLoading;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-[#D4E7C5]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SelectInput 
            label="State" 
            value={selectedState} 
            onChange={onStateChange} 
            options={states} 
            placeholder="Select a State"
        />
        <SelectInput 
            label="District" 
            value={selectedDistrict} 
            onChange={onDistrictChange} 
            options={districts} 
            placeholder="Select a District" 
            disabled={!selectedState}
            isLoading={isDistrictsLoading}
        />
        <SelectInput 
            label="Court Complex" 
            value={selectedComplex} 
            onChange={onComplexChange} 
            options={courtComplexes} 
            placeholder="Select a Court Complex" 
            disabled={!selectedDistrict}
            isLoading={isComplexesLoading}
        />
         <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={onDateChange}
            className="w-full bg-white border border-gray-300 rounded-md shadow-sm p-2 text-slate-900 focus:ring-2 focus:ring-[#99BC85] focus:border-[#99BC85] disabled:opacity-50"
            disabled={!selectedComplex}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={onSearch}
          disabled={isSearchDisabled}
          className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#99BC85] text-white font-semibold rounded-lg shadow-md hover:bg-[#8AB079] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#99BC85] focus:ring-offset-gray-50 transition-all duration-300 disabled:bg-[#99bc85]/60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5"/>
              <span>Search Cause List</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ScraperForm;