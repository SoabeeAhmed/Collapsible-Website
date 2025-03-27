import React, { useState } from 'react';
import Component from './Component';

const HomePage = () => {
  const [openComponent, setOpenComponent] = useState(null);
  const [openSubcategory, setOpenSubcategory] = useState({});

  const componentConfigs = [
    { 
      id: 1, 
      title: 'Component 1', 
      subcategories: [
        { title: 'DQ Check', jsonFile: 'c1' },
        { title: 'DQ Metric', jsonFile: 'c2' }
      ]
    },
    { 
      id: 2, 
      title: 'Component 2', 
      subcategories: [
        { title: 'Data Integrity', jsonFile: 'c3' },
        { title: 'Data Accuracy', jsonFile: 'c4' }
      ]
    },
    { 
      id: 3, 
      title: 'Component 3', 
      subcategories: [
        { title: 'Data Classification', jsonFile: 'c5' },
        { title: 'Data Structure', jsonFile: 'c6' }
      ]
    }
  ];

  const handleComponentClick = (componentId) => {
    setOpenComponent(prevOpen => 
      prevOpen === componentId ? null : componentId
    );
    // Reset subcategory when component is closed
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

  return (
    <div className="home-container">
      {componentConfigs.map(config => (
        <div 
          key={config.id} 
          className="component"
        >
          <div 
            className="component-header" 
            onClick={() => handleComponentClick(config.id)}
          >
            {config.title}
            <span>{openComponent === config.id ? '▼' : '▶'}</span>
          </div>
          
          {openComponent === config.id && (
            <div className="component-subcategories">
              {config.subcategories.map(subcategory => (
                <div 
                  key={subcategory.title}
                  className="subcategory"
                >
                  <div 
                    className="subcategory-header"
                    onClick={() => handleSubcategoryClick(config.id, subcategory.title)}
                  >
                    {subcategory.title}
                    <span>
                      {openSubcategory[config.id] === subcategory.title ? '▼' : '▶'}
                    </span>
                  </div>
                  
                  {openSubcategory[config.id] === subcategory.title && (
                    <div className="subcategory-content">
                      <Component 
                        componentId={config.id} 
                        jsonFile={subcategory.jsonFile} 
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default HomePage;