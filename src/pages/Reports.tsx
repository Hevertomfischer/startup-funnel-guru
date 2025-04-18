
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';

const monthlyData = [
  { name: 'Jan', applications: 20, reviews: 15, investments: 2 },
  { name: 'Feb', applications: 15, reviews: 12, investments: 1 },
  { name: 'Mar', applications: 25, reviews: 18, investments: 3 },
  { name: 'Apr', applications: 30, reviews: 22, investments: 2 },
  { name: 'May', applications: 22, reviews: 20, investments: 4 },
  { name: 'Jun', applications: 18, reviews: 15, investments: 1 },
];

const statusData = [
  { name: 'Initial Contact', value: 35 },
  { name: 'Application Review', value: 25 },
  { name: 'Due Diligence', value: 15 },
  { name: 'Investment Committee', value: 10 },
  { name: 'Term Sheet', value: 8 },
  { name: 'Invested', value: 7 },
];

const sectorData = [
  { name: 'Fintech', value: 25 },
  { name: 'Healthtech', value: 20 },
  { name: 'Edtech', value: 15 },
  { name: 'SaaS', value: 18 },
  { name: 'E-commerce', value: 12 },
  { name: 'Other', value: 10 },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">Analyze your investment funnel performance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="reviews" stroke="#10b981" />
                  <Line type="monotone" dataKey="investments" stroke="#f59e0b" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Current Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Investments by Sector</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6">
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Average Review Time</p>
                <p className="text-2xl font-semibold">12.5 Days</p>
                <p className="text-xs text-green-500">-2.3 days vs last quarter</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-semibold">8.2%</p>
                <p className="text-xs text-green-500">+1.4% vs last quarter</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Investment Size</p>
                <p className="text-2xl font-semibold">R$500K</p>
                <p className="text-xs text-green-500">+50K vs last quarter</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-semibold">32 Startups</p>
                <p className="text-xs text-green-500">+5 vs last quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
