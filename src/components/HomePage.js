import React, { useState, useEffect } from 'react';
import { FaDatabase } from "react-icons/fa";
import EmployeeIdModal from './EmployeeIdModal';
import Configs from './Configs';
import * as XLSX from 'xlsx';
import Component from './Component';
import ReviewAnswersModal from './ReviewAnswersModal';

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const [empId, setEmpId] = useState('');
  const [answers, setAnswers] = useState({}); 
  const [subheading, setSubheading] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAnswers, setSavedAnswers] = useState({}); 
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState([]);
  
  useEffect(() => {
    const savedData = localStorage.getItem('submission_data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSavedAnswers(parsedData.answers || {});
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
            setSubheading(subcategoryTitle);  
          })
          .catch(err => {
            console.error("Error loading the JSON file:", err);
          });
      }
    }
  };

  const handleSubmit = async () => {
    const missingAnswers = [];
    const reviewAnswers = [];
  
    for (const config of Configs) {
      for (const subcategory of config.subcategories) {
        const jsonFile = subcategory.jsonFile;
  
        try {
          const module = await import(`../assets/${jsonFile}.json`);
          const questions = module.questions;
  
          questions.forEach(question => {
            const key = `${config.title}_${subcategory.title}_${question.id}`;
            const answer = answers[key];
  
            if (!answer || answer.toString().trim() === '') {
              missingAnswers.push({
                category: config.title,
                subcategory: subcategory.title,
                question: question.question
              });
            }
  
            reviewAnswers.push({
              category: config.title,
              subcategory: subcategory.title,
              question: question.question,
              answer: answer,
              options: question.options 
            });            
          });
        } catch (err) {
          console.error(`Error loading JSON file: ${jsonFile}`, err);
        }
      }
    }
  
    if (missingAnswers.length > 0) {
      alert(`Please answer all questions before submitting. Missing: ${missingAnswers.length} question(s).`);
      return;
    }
  
    setReviewData(reviewAnswers);
    setShowReviewModal(true);
  };

  const handleReviewConfirm = () => {
    setShowReviewModal(false);
    setIsModalOpen(true); // open Employee ID modal
  };
    
  const handleEmployeeIdSubmit = (userEmpId) => {
    setEmpId(userEmpId);

    
    const submissionData = {
      empId: userEmpId,
      answers
    };
    console.log('Submission Data:', submissionData);
    localStorage.setItem('submission_data', JSON.stringify(submissionData));

    
    setSavedAnswers(answers);

    alert('Submission successful!');

    
    let storedAnswers = answers; 
    let storedEmpId = userEmpId; 

    
    console.log("Answers used for export:", storedAnswers);

    const data = [
      ['Employee ID', 'Category', 'Subcategory', 'Question', 'Answer']
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

            
            questions.forEach(question => {
              
              const questionId = question.id;
              let questionAnswer = 'No answer';

              
              const answerKey = `${config.title}_${subcategory.title}_${questionId}`;

              if (storedAnswers[answerKey] !== undefined) {
                questionAnswer = storedAnswers[answerKey];
                console.log(`Found answer for question ${questionId} with key: ${answerKey} = ${questionAnswer}`);
              }

              data.push([storedEmpId, config.title, subcategory.title, question.question, questionAnswer]);
            });
          } catch (err) {
            console.error(`Error loading the JSON file for ${jsonFile}:`, err);
          }
        }
      }

    
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

      
      XLSX.writeFile(wb, `survey_responses_${storedEmpId}.xlsx`);
    };

    collectAnswers();

  
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

      <ReviewAnswersModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleReviewConfirm}
        questionsData={reviewData}
      />

    </div>
  );
};

export default HomePage;
