import { TbRulerMeasure2, TbDatabaseStar, TbHierarchy3 } from "react-icons/tb";
const Configs = [
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

export default Configs;