
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EquipmentCategory } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { Clock, Settings } from 'lucide-react';

interface LifecycleRule {
  id: string;
  categoryId: string;
  categoryName: string;
  minLifespan: number;
  maxLifespan: number;
  optimalLifespan: number;
  replacementTriggers: string[];
  costThreshold: number;
}

const VehicleLifecycleManager = () => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [lifecycleRules, setLifecycleRules] = useState<LifecycleRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRule, setEditingRule] = useState<LifecycleRule | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const categoryData = FinancialDataService.getEquipmentCategories();
      setCategories(categoryData);
      
      // Initialize lifecycle rules from categories
      const rules: LifecycleRule[] = categoryData.map(category => ({
        id: category.id,
        categoryId: category.id,
        categoryName: category.name,
        minLifespan: Math.max(1, category.defaultLifespan - 3),
        maxLifespan: category.defaultLifespan + 5,
        optimalLifespan: category.defaultLifespan,
        replacementTriggers: ['Age', 'Maintenance Cost', 'Reliability'],
        costThreshold: 0.6, // 60% of original value
      }));
      
      setLifecycleRules(rules);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load lifecycle data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRule = (rule: LifecycleRule) => {
    setLifecycleRules(prev => 
      prev.map(r => r.id === rule.id ? rule : r)
    );
    setEditingRule(null);
    toast({
      title: "Rule Updated",
      description: "Lifecycle rule updated successfully.",
    });
  };

  const calculateReplacementWindow = (rule: LifecycleRule) => {
    return `${rule.minLifespan}-${rule.maxLifespan} years`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Lifecycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading lifecycle data...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Vehicle Lifecycle Management
          </CardTitle>
          <CardDescription>
            Define replacement rules and lifecycle parameters for each equipment category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Optimal Lifespan</TableHead>
                  <TableHead>Replacement Window</TableHead>
                  <TableHead>Cost Threshold</TableHead>
                  <TableHead>Triggers</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lifecycleRules.map((rule) => (
                  <TableRow key={rule.id}>
                    <TableCell className="font-medium">{rule.categoryName}</TableCell>
                    <TableCell>{rule.optimalLifespan} years</TableCell>
                    <TableCell>{calculateReplacementWindow(rule)}</TableCell>
                    <TableCell>{(rule.costThreshold * 100).toFixed(0)}%</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rule.replacementTriggers.map((trigger, index) => (
                          <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                            {trigger}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRule(rule)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingRule && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Lifecycle Rule - {editingRule.categoryName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-lifespan">Minimum Lifespan (years)</Label>
                <Input
                  id="min-lifespan"
                  type="number"
                  min="1"
                  max="50"
                  value={editingRule.minLifespan}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    minLifespan: parseInt(e.target.value) || 1
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optimal-lifespan">Optimal Lifespan (years)</Label>
                <Input
                  id="optimal-lifespan"
                  type="number"
                  min="1"
                  max="50"
                  value={editingRule.optimalLifespan}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    optimalLifespan: parseInt(e.target.value) || 1
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-lifespan">Maximum Lifespan (years)</Label>
                <Input
                  id="max-lifespan"
                  type="number"
                  min="1"
                  max="50"
                  value={editingRule.maxLifespan}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    maxLifespan: parseInt(e.target.value) || 1
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost-threshold">Cost Threshold (%)</Label>
                <Input
                  id="cost-threshold"
                  type="number"
                  min="0"
                  max="100"
                  step="5"
                  value={(editingRule.costThreshold * 100).toFixed(0)}
                  onChange={(e) => setEditingRule({
                    ...editingRule,
                    costThreshold: (parseInt(e.target.value) || 0) / 100
                  })}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button onClick={() => handleUpdateRule(editingRule)}>
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingRule(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleLifecycleManager;
