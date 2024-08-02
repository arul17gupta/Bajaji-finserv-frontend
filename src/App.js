import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const MyApp = () => {
  const [inputJson, setInputJson] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [chosenOptions, setChosenOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  const dropdownOptions = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null); // Reset error message

    try {
      const parsedData = JSON.parse(inputJson);
      const serverResponse = await axios.post('https://bajaj-finserv-backend-production-c238.up.railway.app/bfhl', parsedData);
      console.log(serverResponse);
      setApiResponse(serverResponse.data);
    } catch (err) {
      if (err.response) {
        // Server responded with an error status
        setErrorMessage(`Error: ${err.response.data.error || 'Unknown error'} - Status: ${err.response.status}`);
      } else if (err.request) {
        // No response received from server
        setErrorMessage('Error: No response received from server');
      } else {
        // Error in setting up the request
        setErrorMessage(`Error: ${err.message}`);
      }
      setApiResponse(null);
    }
  };

  const displayResponse = () => {
    if (!apiResponse) return null;

    return (
      <div>
        {chosenOptions.includes('alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{apiResponse.alphabets.join(', ')}</p>
          </div>
        )}
        {chosenOptions.includes('numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{apiResponse.numbers.join(', ')}</p>
          </div>
        )}
        {chosenOptions.includes('highest_alphabet') && (
          <div>
            <h3>Highest Alphabet:</h3>
            <p>{apiResponse.highest_alphabet.join(', ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="MyApp">
      <h1>JSON Processor</h1>
      <form onSubmit={handleFormSubmit}>
        <textarea
          value={inputJson}
          onChange={(e) => setInputJson(e.target.value)}
          placeholder='Enter JSON here, e.g. {"data": ["A", "C", "z"]}'
        ></textarea>
        <button type="submit">Process</button>
      </form>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {apiResponse && (
        <div>
          <Select
            isMulti
            name="filters"
            options={dropdownOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selected) => setChosenOptions(selected.map(option => option.value))}
          />
          {displayResponse()}
        </div>
      )}
    </div>
  );
};

export default MyApp;
