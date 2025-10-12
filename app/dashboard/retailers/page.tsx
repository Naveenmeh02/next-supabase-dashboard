'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data - replace with actual data from your database
const mockRetailers = [
  {
    id: 1,
    name: 'Acme Retail Store',
    location: 'New York, NY',
    contact: 'john@acmeretail.com',
    phone: '+1 (555) 123-4567',
    totalOrders: 145,
    status: 'active',
    revenue: 45230,
  },
  {
    id: 2,
    name: 'Best Buy Corner',
    location: 'Los Angeles, CA',
    contact: 'sarah@bestbuy.com',
    phone: '+1 (555) 234-5678',
    totalOrders: 98,
    status: 'active',
    revenue: 32100,
  },
  {
    id: 3,
    name: 'Quick Shop',
    location: 'Chicago, IL',
    contact: 'mike@quickshop.com',
    phone: '+1 (555) 345-6789',
    totalOrders: 67,
    status: 'inactive',
    revenue: 18900,
  },
  {
    id: 4,
    name: 'Super Mart',
    location: 'Houston, TX',
    contact: 'lisa@supermart.com',
    phone: '+1 (555) 456-7890',
    totalOrders: 203,
    status: 'active',
    revenue: 67800,
  },
];

export default function RetailersPage() {
  const [retailers, setRetailers] = useState(mockRetailers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRetailer, setNewRetailer] = useState({
    name: '',
    location: '',
    contact: '',
    phone: '',
  });

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch = retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || retailer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddRetailer = () => {
    // Add logic to save retailer to database
    const retailer = {
      id: retailers.length + 1,
      ...newRetailer,
      totalOrders: 0,
      status: 'active',
      revenue: 0,
    };
    setRetailers([...retailers, retailer]);
    setIsAddDialogOpen(false);
    setNewRetailer({ name: '', location: '', contact: '', phone: '' });
  };

  const handleDeleteRetailer = (id: number) => {
    if (confirm('Are you sure you want to delete this retailer?')) {
      setRetailers(retailers.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retailer Management</h1>
          <p className="text-muted-foreground">Manage your retail partners and their information</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Retailer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Retailer</DialogTitle>
              <DialogDescription>
                Enter the details of the new retailer. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Retailer Name</Label>
                <Input
                  id="name"
                  value={newRetailer.name}
                  onChange={(e) => setNewRetailer({ ...newRetailer, name: e.target.value })}
                  placeholder="Enter retailer name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newRetailer.location}
                  onChange={(e) => setNewRetailer({ ...newRetailer, location: e.target.value })}
                  placeholder="City, State"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact">Email</Label>
                <Input
                  id="contact"
                  type="email"
                  value={newRetailer.contact}
                  onChange={(e) => setNewRetailer({ ...newRetailer, contact: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newRetailer.phone}
                  onChange={(e) => setNewRetailer({ ...newRetailer, phone: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddRetailer}>
                Save Retailer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search retailers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Retailers Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRetailers.map((retailer) => (
          <Card key={retailer.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{retailer.name}</CardTitle>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {retailer.location}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    retailer.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}
                >
                  {retailer.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{retailer.contact}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground">{retailer.phone}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Orders</p>
                      <p className="text-lg font-semibold">{retailer.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="text-lg font-semibold">${retailer.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteRetailer(retailer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRetailers.length === 0 && (
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-muted-foreground">No retailers found matching your criteria.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
