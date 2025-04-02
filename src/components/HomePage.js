import React, { useState } from 'react';
import Component from './Component';
import { FaDatabase } from "react-icons/fa";
import { TbRulerMeasure2, TbDatabaseStar, TbHierarchy3 } from "react-icons/tb";
import EmployeeIdModal from './EmployeeIdModal';


const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});
  const [empId, setEmpId] = useState('');
  const [answers, setAnswers] = useState({});
  const [subheading, setSubheading] = useState('');
  const [isModalOpen,setIsModalOpen]=useState(false);
  const componentConfigs = [
    { 
      id: 1, 
      title: 'Data Measure', 
      icon: <TbRulerMeasure2 />,
      subcategories: [
        { title: 'DQ Check', jsonFile: 'c1' },
        { title: 'DQ Metric', jsonFile: 'c2' }
      ]
    },
    { 
      id: 2, 
      title: 'Data Quality',
      icon: <TbDatabaseStar />,
      subcategories: [
        { title: 'Data Integrity', jsonFile: 'c3' },
        { title: 'Data Accuracy', jsonFile: 'c4' }
      ]
    },
    { 
      id: 3, 
      title: 'Data Hierarchy', 
      icon: <TbHierarchy3 />,
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
    // Ask for Employee ID using prompt
    // const userEmpId = window.prompt('Please enter your 5-character Employee ID:');
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
  };

  //   if (userEmpId && userEmpId.length === 5) {
  //     setEmpId(userEmpId); // Update state with the entered ID

  //     const submissionData = {
  //       empId: userEmpId,
  //       answers
  //     };

  //     console.log('Submission Data:', submissionData);
  //     localStorage.setItem('submission_data', JSON.stringify(submissionData));
  //     alert('Submission successful!');
  //   } else {
  //     alert('Invalid Employee ID. Please enter exactly 5 characters.');
  //   }
  // };

  return (
    <div className="home-container">
      <div>
        <div className='container-header'>
          <FaDatabase className='header-icon' />
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

      {/* <input
        type="text"
        placeholder="Enter 5-character Employee ID"
        maxLength="5"
        className="emp-id-input"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      /> */}
      <button className="submit-button" onClick={handleSubmit}>
        Submit
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
