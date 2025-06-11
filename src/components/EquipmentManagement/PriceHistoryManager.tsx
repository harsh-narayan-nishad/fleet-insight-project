
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { VehiclePriceHistory, EquipmentCategory } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { Plus, Edit, Trash2, TrendingUp } from 'lucide-react';

const PriceHistoryManager = () => {
  const [priceHistory, setPriceHistory] = useState<VehiclePriceHistory[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newEntry, setNewEntry] = useState({
    category: '',
    year: new Date().getFullYear(),
    basePrice: 0,
    evPrice: 0,
    source: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const historyData = FinancialDataService.getPriceHistory();
      const categoryData = FinancialDataService.getEquipmentCategories();
      setPriceHistory(historyData);
      setCategories(categoryData);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Failed to load price history and categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = () => {
    if (!newEntry.category || !newEntry.basePrice || !newEntry.source) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      FinancialDataService.addPriceEntry(newEntry);
      loadData();
      setNewEntry({
        category: '',
        year: new Date().getFullYear(),
        basePrice: 0,
        evPrice: 0,
        source: '',
      });
      toast({
        title: "Price Entry Added",
        description: "Price history entry added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Adding Entry",
        description: error instanceof Error ? error.message : "Failed to add price entry.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculatePriceChange = (currentPrice: number, previousPrice: number) => {
    if (!previousPrice) return null;
    const change = ((currentPrice - previousPrice) / previousPrice) * 100;
    return change;
  };

  const getPreviousPrice = (category: string, year: number) => {
    const previousEntry = priceHistory.find(
      entry => entry.category === category && entry.year === year - 1
    );
    return previousEntry?.basePrice || 0;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading price history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Vehicle Price History
        </CardTitle>
        <CardDescription>
          Track historical pricing data for vehicles and equipment to improve forecasting accuracy
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="price-category">Category</Label>
            <Select value={newEntry.category} onValueChange={(value) => setNewEntry({ ...newEntry, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-year">Year</Label>
            <Input
              id="price-year"
              type="number"
              min="2000"
              max="2030"
              value={newEntry.year}
              onChange={(e) => setNewEntry({ ...newEntry, year: parseInt(e.target.value) || new Date().getFullYear() })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="base-price">Base Price ($)</Label>
            <Input
              id="base-price"
              type="number"
              min="0"
              step="1000"
              value={newEntry.basePrice}
              onChange={(e) => setNewEntry({ ...newEntry, basePrice: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ev-price">EV Price ($)</Label>
            <Input
              id="ev-price"
              type="number"
              min="0"
              step="1000"
              value={newEntry.evPrice}
              onChange={(e) => setNewEntry({ ...newEntry, evPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price-source">Source</Label>
            <Input
              id="price-source"
              value={newEntry.source}
              onChange={(e) => setNewEntry({ ...newEntry, source: e.target.value })}
              placeholder="e.g., Market Analysis"
            />
          </div>

          <div className="flex items-end">
            <Button onClick={handleAddEntry} className="w-full">
              Add Entry
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>EV Price</TableHead>
                <TableHead>Change %</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceHistory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No price history found. Add your first entry above.
                  </TableCell>
                </TableRow>
              ) : (
                priceHistory
                  .sort((a, b) => b.year - a.year || a.category.localeCompare(b.category))
                  .map((entry) => {
                    const previousPrice = getPreviousPrice(entry.category, entry.year);
                    const priceChange = calculatePriceChange(entry.basePrice, previousPrice);
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.category}</TableCell>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>{formatCurrency(entry.basePrice)}</TableCell>
                        <TableCell>{entry.evPrice ? formatCurrency(entry.evPrice) : 'N/A'}</TableCell>
                        <TableCell>
                          {priceChange !== null && (
                            <span className={priceChange >= 0 ? 'text-red-600' : 'text-green-600'}>
                              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{entry.source}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryManager;
