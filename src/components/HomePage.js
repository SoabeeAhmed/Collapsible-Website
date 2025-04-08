import React, { useState, useEffect } from 'react';
import { FaDatabase } from "react-icons/fa";
import EmployeeIdModal from './EmployeeIdModal';
import Configs from './Configs';
import * as XLSX from 'xlsx';
import Component from './Component';

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const [empId, setEmpId] = useState('');
  const [answers, setAnswers] = useState({}); // Store answers keyed by question IDs
  const [subheading, setSubheading] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState({}); // Store saved answers separately

  // Load saved answers from localStorage on component mount, but don't set them as current answers
  useEffect(() => {
    const savedData = localStorage.getItem('submission_data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSavedAnswers(parsedData.answers || {});
      // Don't set answers state to prevent populating the UI with previous answers
      // setAnswers(parsedData.answers || {});
      
      // Only set empId if you want to remember the last employee ID used
      setEmpId(parsedData.empId || '');
    }
  }, []);

  const handleComponentClick = (componentId) => {
    setOpenComponent(prevOpen => prevOpen === componentId ? null : componentId);
    if (openComponent === componentId) {
      setOpenSubcategory({});
    }
  };

  const handleSubcategoryClick = (componentId, subcategoryTitle) => {
    setOpenSubcategory(prev => ({
      ...prev,
      [componentId]: prev[componentId] === subcategoryTitle ? null : subcategoryTitle
    }));

    if (!openSubcategory[componentId]) {
      const jsonFileMapping = {
        "DQ Check": "c1",
        "DQ Metric": "c2",
        "Data Integrity": "c3",
        "Data Accuracy": "c4",
        "Data Classification": "c5",
        "Data Structure": "c6"
      };

      const jsonFile = jsonFileMapping[subcategoryTitle];

      if (jsonFile) {
        import(`../assets/${jsonFile}.json`)
          .then(module => {
            const questions = module.questions;
            setSubheading(subcategoryTitle);  // Update subheading based on clicked subcategory
          })
          .catch(err => {
            console.error("Error loading the JSON file:", err);
          });
      }
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleEmployeeIdSubmit = (userEmpId) => {
    setEmpId(userEmpId);
  
    // Immediately use the latest answers state
    const submissionData = {
      empId: userEmpId,
      answers
    };
    console.log('Submission Data:', submissionData);
    localStorage.setItem('submission_data', JSON.stringify(submissionData));
    
    // Update savedAnswers state with the current answers
    setSavedAnswers(answers);
  
    alert('Submission successful!');
  
    // Directly use answers from state, not savedAnswers
    let storedAnswers = answers; // Get the answers directly from state
    let storedEmpId = userEmpId; // Use the userEmpId passed in
  
    // Log retrieved data for debugging
    console.log("Answers used for export:", storedAnswers);
  
    const data = [
      ['Employee ID', 'Category', 'Subcategory', 'Question', 'Answer'] // Headers for the Excel file
    ];
  
    const collectAnswers = async () => {
      for (const config of Configs) {
        for (const subcategory of config.subcategories) {
          const jsonFileMapping = {
            "DQ Check": "c1",
            "DQ Metric": "c2",
            "Data Integrity": "c3",
            "Data Accuracy": "c4",
            "Data Classification": "c5",
            "Data Structure": "c6"
          };
  
          const jsonFile = jsonFileMapping[subcategory.title];
  
          try {
            const module = await import(`../assets/${jsonFile}.json`);
            const questions = module.questions;
  
            // Loop through all questions in each subcategory
            questions.forEach(question => {
              // Find the answer using the question ID
              const questionId = question.id;
              let questionAnswer = 'No answer';
              
              // Try different key formats based on how your Component.js likely stores them
              const possibleKeys = [
                questionId,
                `${questionId}`,
                `${jsonFile}_${questionId}`,
                `${subcategory.title}_${questionId}`,
                `${config.title}_${subcategory.title}_${questionId}`
              ];
              
              for (const key of possibleKeys) {
                if (storedAnswers[key] !== undefined) {
                  questionAnswer = storedAnswers[key];
                  console.log(`Found answer for question ${questionId} with key: ${key} = ${questionAnswer}`);
                  break;
                }
              }
  
              data.push([storedEmpId, config.title, subcategory.title, question.question, questionAnswer]);
            });
          } catch (err) {
            console.error(`Error loading the JSON file for ${jsonFile}:`, err);
          }
        }
      }
  
      // After collecting all the data, generate and export the Excel file
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');
      
      // Use the empId in the filename for dynamic naming
      XLSX.writeFile(wb, `survey_responses_${storedEmpId}.xlsx`);
    };
  
    collectAnswers(); 
  
    // Reset answers after submission
    setAnswers({});
  };
  

  
  return (
    <div className="home-container">
      <div>
        <div className='container-header'>
          <FaDatabase className='header-icon' />
          <h1 className='data-header'>Data Quality Index</h1>
        </div>
        <p className='data-subheader'>Comprehensive Assessment of Data Quality for Improved Decision-Making</p>
      </div>

      
      {Configs.map(config => (
        <div key={config.id} className="component">
          <div className="component-header" onClick={() => handleComponentClick(config.id)}>
            {config.icon}
            {config.title} <span>{openComponent === config.id ? '\u25BC' : '\u25B6'}</span>
          </div>
          {openComponent === config.id && (
            <div className="component-subcategories">
              {config.subcategories.map(subcategory => (
                <div key={subcategory.title} className="subcategory">
                  <div className="subcategory-header" onClick={() => handleSubcategoryClick(config.id, subcategory.title)}>
                    {subcategory.title}
                    <span>{openSubcategory[config.id] === subcategory.title ? '\u25BC' : '\u25B6'}</span>
                  </div>
                  {openSubcategory[config.id] === subcategory.title && (
                    <div className="subcategory-content">
                      <Component
                        componentTitle={config.title}
                        jsonFile={subcategory.jsonFile}
                        answers={answers}
                        setAnswers={setAnswers}
                        subheading={subheading}
                        setSubheading={setSubheading}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <button className="submit-button" onClick={handleSubmit}>
        <strong>Submit</strong>
      </button>

      

      <EmployeeIdModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmployeeIdSubmit}
      />
    </div>
  );
};

export default HomePage;