
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EquipmentCategories from '@/components/EquipmentManagement/EquipmentCategories';
import PriceHistoryManager from '@/components/EquipmentManagement/PriceHistoryManager';
import VehicleLifecycleManager from '@/components/EquipmentManagement/VehicleLifecycleManager';

const EquipmentPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Equipment & Asset Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage equipment categories, price history, and vehicle lifecycle parameters
        </p>
      </div>

      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Equipment Categories</TabsTrigger>
          <TabsTrigger value="pricing">Price History</TabsTrigger>
          <TabsTrigger value="lifecycle">Vehicle Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <EquipmentCategories />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <PriceHistoryManager />
        </TabsContent>

        <TabsContent value="lifecycle" className="space-y-6">
          <VehicleLifecycleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentPage;
