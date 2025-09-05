import React, { useState, useEffect } from "react";
import Inventory from "../components/entities/Inventory"; // Temporarily comment out
import Card, { CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Table from "../components/ui/Table";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Package, AlertTriangle, Search, Plus, Download } from "lucide-react";

import AddInventoryForm from "../components/inventory/AddInventoryForm";

const statusColors = {
  'Available': 'bg-green-100 text-green-800 border-green-200',
  'Low Stock': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
  'Ordered': 'bg-blue-100 text-blue-800 border-blue-200'
};

export default function InventoryControl() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const data = await Inventory.list('-updated_date');
      setInventory(data);
    } catch (error) {
      console.error('Error loading inventory:', error);
    }
    setIsLoading(false);
  };

  const filteredInventory = inventory.filter(item =>
    !searchTerm ||
    item.item_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => 
    item.current_stock <= item.minimum_stock
  ).length;

  const totalValue = inventory.reduce((sum, item) => 
    sum + (item.current_stock * item.unit_cost || 0), 0
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">INVENTORY CONTROL</h1>
            <p className="text-blue-700 mt-1">Manage and track inventory items</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Total Items</p>
                  <p className="text-2xl font-bold text-blue-900">{inventory.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Low Stock Alert</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">₹{totalValue.toLocaleString()}</p>
                </div>
                <Package className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-blue-200 border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 mb-2">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {[...new Set(inventory.map(i => i.category))].length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showAddForm && (
          <AddInventoryForm 
            onSubmit={async (data) => {
              await Inventory.create(data);
              setShowAddForm(false);
              loadInventory();
            }}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Inventory Table */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-800 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory Items ({filteredInventory.length})
              </CardTitle>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-black"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-900 hover:bg-blue-900">
                    <TableHead className="text-white font-semibold">Item Code</TableHead>
                    <TableHead className="text-white font-semibold">Item Name</TableHead>
                    <TableHead className="text-white font-semibold">Category</TableHead>
                    <TableHead className="text-white font-semibold">Current Stock</TableHead>
                    <TableHead className="text-white font-semibold">Min Stock</TableHead>
                    <TableHead className="text-white font-semibold">Status</TableHead>
                    <TableHead className="text-white font-semibold">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-6 bg-gray-200 rounded animate-pulse"></div></TableCell>
                        <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse"></div></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-blue-50">
                        <TableCell className="font-medium text-blue-900">{item.item_code}</TableCell>
                        <TableCell>{item.item_name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.current_stock}</TableCell>
                        <TableCell>{item.minimum_stock}</TableCell>
                        <TableCell>
                          <Badge className={`${statusColors[item.status]} border font-medium`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ₹{(item.current_stock * item.unit_cost || 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}