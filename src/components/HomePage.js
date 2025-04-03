import React, { useState } from 'react';
import Component from './Component';
import { FaDatabase } from "react-icons/fa";
import EmployeeIdModal from './EmployeeIdModal';
import Configs from './Configs';

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const [empId, setEmpId] = useState('');
  const [answers, setAnswers] = useState({});
  const [subheading, setSubheading] = useState('');
  const [isModalOpen,setIsModalOpen]=useState(false);

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
    setIsModalOpen(true);
  };
  const handleEmployeeIdSubmit=(userEmpId)=>{
    setEmpId(userEmpId);
    const submissionData = {
      empId: userEmpId,
      answers
    };
    console.log('Submission Data:', submissionData);
    localStorage.setItem('submission_data', JSON.stringify(submissionData));
    alert('Submission successful!');
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
      onClose={()=>setIsModalOpen(false)}
      onSubmit={handleEmployeeIdSubmit}>
      </EmployeeIdModal>
    </div>
  );
};

export default HomePage;
