
import DateDrillDown from '@/components/DateDrillDown';

const TimelinePage = () => {
  // Sample fleet data - in real app this would come from props or context
  const fleetData = [
    {
      id: "1",
      licensePlate: "87JD-1",
      startUp: "1992",
      acquisitionValue: 210000.00,
      lcReplaceYear: "2027",
      category: "Small",
      status: "In Service"
    }
  ];

  return <DateDrillDown vehicles={fleetData} />;
};

export default TimelinePage;
