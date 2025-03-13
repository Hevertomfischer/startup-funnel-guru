
import React from 'react';
import { 
  BarChart, 
  Award, 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Activity,
  LineChart 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your startup investment dashboard
          </p>
        </div>
        <div>
          <Button className="bg-scv-blue hover:bg-scv-blue/90">
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Startups', value: '126', icon: Award, change: '+12%', changeType: 'positive' },
          { title: 'Active Investments', value: '38', icon: Activity, change: '+2%', changeType: 'positive' },
          { title: 'Avg. MRR', value: '$28.5K', icon: TrendingUp, change: '+18.2%', changeType: 'positive' },
          { title: 'Deal Flow', value: '24', icon: Users, change: '-4%', changeType: 'negative' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Investment Analysis</CardTitle>
            <CardDescription>
              Monthly portfolio performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center border-2 border-dashed rounded-lg">
            <div className="text-center">
              <BarChart className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Chart visualization would appear here
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Your schedule for the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Pitch Meeting', company: 'TechNova', time: 'Today, 2:00 PM' },
                { title: 'Due Diligence Call', company: 'Quantum Labs', time: 'Tomorrow, 10:30 AM' },
                { title: 'Board Meeting', company: 'SecurePay', time: 'Wed, 9:00 AM' },
                { title: 'Demo Day', company: 'Accelerator X', time: 'Fri, 4:00 PM' },
              ].map((event, i) => (
                <div key={i} className="flex items-start">
                  <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.company}</p>
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Events
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Recent Startups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Startups</CardTitle>
          <CardDescription>
            Latest additions to your investment pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'AI Insights', sector: 'Artificial Intelligence', status: 'Due Diligence', growth: '+24%' },
              { name: 'EcoTech', sector: 'CleanTech', status: 'Screening', growth: '+10%' },
              { name: 'FinFlow', sector: 'FinTech', status: 'Term Sheet', growth: '+42%' },
            ].map((startup, i) => (
              <div key={i} className="flex p-3 border rounded-lg">
                <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {startup.name.substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-medium">{startup.name}</h4>
                  <p className="text-xs text-muted-foreground">{startup.sector}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {startup.status}
                    </span>
                    <span className="text-xs text-green-600">{startup.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View All Startups
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
