import React, { useState } from 'react';
import Component from './Component';
import { FaDatabase } from "react-icons/fa";
import { TbRulerMeasure2 } from "react-icons/tb";
import { TbDatabaseStar } from "react-icons/tb";
import { TbHierarchy3 } from "react-icons/tb";

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const [empId, setEmpId] = useState('');
  const [answers, setAnswers] = useState({});
  const [subheading, setSubheading] = useState('');

  const componentConfigs = [
    { 
      id: 1, 
      title: 'Data Measure', 
      icon:<TbRulerMeasure2 />,
      subcategories: [
        { title: 'DQ Check', jsonFile: 'c1' },
        { title: 'DQ Metric', jsonFile: 'c2' }
      ]
    },
    { 
      id: 2, 
      title: 'Data Quality',
      icon:<TbDatabaseStar />,
      subcategories: [
        { title: 'Data Integrity', jsonFile: 'c3' },
        { title: 'Data Accuracy', jsonFile: 'c4' }
      ]
    },
    { 
      id: 3, 
      title: 'Data Hierarchy', 
      icon:<TbHierarchy3 />,
      subcategories: [
        { title: 'Data Classification', jsonFile: 'c5' },
        { title: 'Data Structure', jsonFile: 'c6' }
      ]
    }
  ];

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
  };

  const handleSubmit = () => {
    if (empId.length !== 5) {
      alert('Please enter a 5-character Employee ID');
      return;
    }

    const submissionData = {
      empId,
      answers
    };

    console.log('Submission Data:', submissionData);
    localStorage.setItem('submission_data', JSON.stringify(submissionData));
  };

  return (
    <div className="home-container">
      <div>
        <div className='container-header'>
          <FaDatabase className='header-icon'/>
          <h1 className='data-header'>Data Quality Index</h1>
        </div>
      <p className='data-subheader'>Comprehensive Assessment of Data Quality for Improved Decision-Making</p>
      </div>
      {componentConfigs.map(config => (
        <div key={config.id} className="component">
          <div className="component-header" onClick={() => handleComponentClick(config.id)}>
            {config.icon}
            {config.title} <span>{openComponent === config.id ? '▼' : '▶'}</span>
          </div>
          {openComponent === config.id && (
            <div className="component-subcategories">
              {config.subcategories.map(subcategory => (
                <div key={subcategory.title} className="subcategory">
                  <div className="subcategory-header" onClick={() => handleSubcategoryClick(config.id, subcategory.title)}>
                    {subcategory.title}
                    <span>{openSubcategory[config.id] === subcategory.title ? '▼' : '▶'}</span>
                  </div>
                  
                  {openSubcategory[config.id] === subcategory.title && (
                    <div className="subcategory-content">
                      <Component 
                        componentId={config.id} 
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
      
      {/* Single Employee ID Input and Submit Button */}
      <input 
        type="text" 
        placeholder="Enter 5-character Employee ID" 
        maxLength="5"
        className="emp-id-input"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default HomePage;
