
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { EquipmentCategory } from '@/types/financial';
import { FinancialDataService } from '@/services/financialDataService';
import { Plus, Edit, Trash2 } from 'lucide-react';

const EquipmentCategories = () => {
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'vehicle' as 'vehicle' | 'equipment',
    defaultLifespan: 8,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    try {
      const data = FinancialDataService.getEquipmentCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: "Error Loading Categories",
        description: "Failed to load equipment categories.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      FinancialDataService.addEquipmentCategory(newCategory);
      loadCategories();
      setNewCategory({ name: '', type: 'vehicle', defaultLifespan: 8 });
      toast({
        title: "Category Added",
        description: "Equipment category added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Adding Category",
        description: error instanceof Error ? error.message : "Failed to add category.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = (id: string) => {
    try {
      FinancialDataService.deleteEquipmentCategory(id);
      loadCategories();
      toast({
        title: "Category Deleted",
        description: "Equipment category deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error Deleting Category",
        description: error instanceof Error ? error.message : "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Equipment Categories
        </CardTitle>
        <CardDescription>
          Manage equipment and vehicle categories with their default lifespans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="category-name">Category Name</Label>
            <Input
              id="category-name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              placeholder="e.g., Small Vehicles"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category-type">Type</Label>
            <select
              id="category-type"
              value={newCategory.type}
              onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as 'vehicle' | 'equipment' })}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="vehicle">Vehicle</option>
              <option value="equipment">Equipment</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="default-lifespan">Default Lifespan (Years)</Label>
            <Input
              id="default-lifespan"
              type="number"
              min="1"
              max="50"
              value={newCategory.defaultLifespan}
              onChange={(e) => setNewCategory({ ...newCategory, defaultLifespan: parseInt(e.target.value) || 8 })}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddCategory} className="w-full">
              Add Category
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default Lifespan</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No equipment categories found. Add your first category above.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="capitalize">{category.type}</TableCell>
                    <TableCell>{category.defaultLifespan} years</TableCell>
                    <TableCell>{formatDate(category.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(category.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCategories;
