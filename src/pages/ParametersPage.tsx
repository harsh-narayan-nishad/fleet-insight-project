
import CostParametersPage from '@/components/CostParameters';

const ParametersPage = () => {
  const handleParametersChanged = (parameters: any) => {
    console.log('Parameters changed:', parameters);
  };

  return <CostParametersPage onParametersChanged={handleParametersChanged} />;
};

export default ParametersPage;
