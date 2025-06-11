
import { useState } from 'react';

export const useFleetData = () => {
  const [fleetData, setFleetData] = useState([
    {
      id: "1",
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    },
    {
      id: "2",
      licensePlate: "13GT-5",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2029",
      category: "Small",
      status: "In Service"
    },
    {
      id: "3",
      licensePlate: "TAC48X",
      startUp: "2004",
      acquisitionValue: 4200.00,
      lcReplaceYear: "2029",
      category: "Small",
      status: "Running"
    },
    {
      id: "4",
      licensePlate: "NO PLATE",
      startUp: "1970",
      acquisitionValue: 150000.00,
      lcReplaceYear: "2027",
      category: "Big",
      status: "DIE"
    },
    {
      id: "5",
      licensePlate: "XR989A",
      startUp: "2009",
      acquisitionValue: 258215.34,
      lcReplaceYear: "2029",
      category: "EV",
      status: "In Service"
    },
    {
      id: "6",
      licensePlate: "EV-101",
      startUp: "2020",
      acquisitionValue: 45000.00,
      lcReplaceYear: "2030",
      category: "EV",
      status: "In Service"
    },
    {
      id: "7",
      licensePlate: "BIG-TRUCK",
      startUp: "2015",
      acquisitionValue: 85000.00,
      lcReplaceYear: "2030",
      category: "Big",
      status: "In Service"
    },
    {
      id: "8",
      licensePlate: "",
      startUp: "2018",
      acquisitionValue: -1000,
      lcReplaceYear: "2030",
      category: "Small",
      status: "Running"
    }
  ]);

  return { fleetData, setFleetData };
};
