
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CostParameters } from '@/types/vehicle';
import { CostParametersService } from '@/services/costParametersService';
import { AuthService } from '@/services/authService';

interface CostParametersFormProps {
  currentParameters: CostParameters;
  onParametersUpdated: (parameters: CostParameters) => void;
}

const CostParametersForm = ({ currentParameters, onParametersUpdated }: CostParametersFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const userRole = AuthService.getCurrentUserRole();
  
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<CostParameters>({
    defaultValues: currentParameters,
  });

  const onSubmit = async (data: CostParameters) => {
    if (!userRole.canEditParameters) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit cost parameters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const updatedParameters = await CostParametersService.updateParameters(data);
      onParametersUpdated(updatedParameters);
      
      toast({
        title: "Parameters Updated",
        description: "Cost parameters have been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update parameters.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset(currentParameters);
  };

  const isReadOnly = !userRole.canEditParameters;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Parameters</CardTitle>
        <CardDescription>
          Manage inflation rate, tariff rate, and EV transition ratios for fleet forecasting.
          {isReadOnly && " (Read-only access)"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
              <Input
                id="inflationRate"
                type="number"
                step="0.1"
                disabled={isReadOnly}
                {...register('inflationRate', { 
                  required: 'Inflation rate is required',
                  min: { value: 0, message: 'Must be 0 or greater' },
                  max: { value: 20, message: 'Must be 20% or less' }
                })}
              />
              {errors.inflationRate && (
                <p className="text-sm text-destructive">{errors.inflationRate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tariffRate">Tariff Rate (%)</Label>
              <Input
                id="tariffRate"
                type="number"
                step="0.1"
                disabled={isReadOnly}
                {...register('tariffRate', { 
                  required: 'Tariff rate is required',
                  min: { value: 0, message: 'Must be 0 or greater' },
                  max: { value: 50, message: 'Must be 50% or less' }
                })}
              />
              {errors.tariffRate && (
                <p className="text-sm text-destructive">{errors.tariffRate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="smallToEvRatio">Small Vehicle → EV Ratio (%)</Label>
              <Input
                id="smallToEvRatio"
                type="number"
                disabled={isReadOnly}
                {...register('smallToEvRatio', { 
                  required: 'Small to EV ratio is required',
                  min: { value: 0, message: 'Must be 0 or greater' },
                  max: { value: 100, message: 'Must be 100% or less' }
                })}
              />
              {errors.smallToEvRatio && (
                <p className="text-sm text-destructive">{errors.smallToEvRatio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bigToEvRatio">Large Vehicle → EV Ratio (%)</Label>
              <Input
                id="bigToEvRatio"
                type="number"
                disabled={isReadOnly}
                {...register('bigToEvRatio', { 
                  required: 'Large to EV ratio is required',
                  min: { value: 0, message: 'Must be 0 or greater' },
                  max: { value: 100, message: 'Must be 100% or less' }
                })}
              />
              {errors.bigToEvRatio && (
                <p className="text-sm text-destructive">{errors.bigToEvRatio.message}</p>
              )}
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading || !isDirty}
                className="min-w-[100px]"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading || !isDirty}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CostParametersForm;
