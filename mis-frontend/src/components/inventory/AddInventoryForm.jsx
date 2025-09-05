import React, { useState } from "react";
import Card from "../../components/ui/Card";
import { CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Label from "../../components/ui/Label";
import Select from "../../components/ui/Select";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { X, Save } from "lucide-react";

const CATEGORIES = ["Hardware", "Software", "Documents", "Equipment", "Supplies"];
const STATUSES = ["Available", "Low Stock", "Out of Stock", "Ordered"];

export default function AddInventoryForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    item_code: "",
    item_name: "",
    category: "",
    current_stock: "",
    minimum_stock: "",
    location: "",
    unit_cost: "",
    supplier: "",
    last_updated: new Date().toISOString().split('T')[0],
    status: "Available"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      current_stock: parseFloat(formData.current_stock),
      minimum_stock: parseFloat(formData.minimum_stock),
      unit_cost: parseFloat(formData.unit_cost)
    });
  };

  return (
    <Card className="shadow-xl border-0 mb-8">
      <CardHeader className="bg-blue-800 text-white">
        <div className="flex justify-between items-center">
          <CardTitle>Add New Inventory Item</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-blue-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Item Code *</Label>
              <Input
                value={formData.item_code}
                onChange={(e) => setFormData({...formData, item_code: e.target.value})}
                placeholder="Enter item code"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Item Name *</Label>
              <Input
                value={formData.item_name}
                onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                placeholder="Enter item name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Current Stock *</Label>
              <Input
                type="number"
                value={formData.current_stock}
                onChange={(e) => setFormData({...formData, current_stock: e.target.value})}
                placeholder="Enter current stock"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Stock *</Label>
              <Input
                type="number"
                value={formData.minimum_stock}
                onChange={(e) => setFormData({...formData, minimum_stock: e.target.value})}
                placeholder="Enter minimum stock level"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Storage location"
              />
            </div>
            <div className="space-y-2">
              <Label>Unit Cost</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.unit_cost}
                onChange={(e) => setFormData({...formData, unit_cost: e.target.value})}
                placeholder="Cost per unit"
              />
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                placeholder="Supplier name"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}