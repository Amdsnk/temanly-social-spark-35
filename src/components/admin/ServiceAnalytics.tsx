
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Clock, MapPin } from 'lucide-react';

const ServiceAnalytics = () => {
  const serviceData = [
    { name: 'Chat', orders: 412, revenue: 11330000, popularity: 45, avgDuration: '1 hari', color: '#3B82F6' },
    { name: 'Video Call', orders: 234, revenue: 16731000, popularity: 25, avgDuration: '1.2 jam', color: '#10B981' },
    { name: 'Call', orders: 189, revenue: 7560000, popularity: 20, avgDuration: '45 menit', color: '#F59E0B' },
    { name: 'Offline Date', orders: 67, revenue: 19095000, popularity: 8, avgDuration: '3.2 jam', color: '#EF4444' },
    { name: 'Party Buddy', orders: 18, revenue: 18000000, popularity: 2, avgDuration: '8 jam', color: '#8B5CF6' }
  ];

  const cityData = [
    { city: 'Jakarta', orders: 456, revenue: 35240000 },
    { city: 'Bandung', orders: 234, revenue: 18450000 },
    { city: 'Surabaya', orders: 189, revenue: 15670000 },
    { city: 'Medan', orders: 123, revenue: 9890000 },
    { city: 'Yogyakarta', orders: 98, revenue: 7560000 }
  ];

  const timeSlotData = [
    { time: '08:00-12:00', orders: 145, type: 'Pagi' },
    { time: '12:00-17:00', orders: 289, type: 'Siang' },
    { time: '17:00-21:00', orders: 378, type: 'Sore' },
    { time: '21:00-24:00', orders: 234, type: 'Malam' },
    { time: '00:00-08:00', orders: 67, type: 'Dini Hari' }
  ];

  const totalRevenue = serviceData.reduce((sum, service) => sum + service.revenue, 0);
  const totalOrders = serviceData.reduce((sum, service) => sum + service.orders, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">Rp {(totalRevenue / 1000000).toFixed(0)}M</div>
                <div className="text-sm text-gray-600">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">Rp {Math.round(totalRevenue / totalOrders / 1000)}k</div>
                <div className="text-sm text-gray-600">Avg Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-gray-600">Active Cities</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Revenue Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip 
                  formatter={(value: number) => [`Rp ${(value / 1000000).toFixed(1)}M`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="popularity"
                  label={({ name, popularity }) => `${name}: ${popularity}%`}
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Service Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Service Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceData.map((service) => (
              <div key={service.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: service.color }}
                    ></div>
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <Badge variant="outline">{service.popularity}% market share</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">Rp {(service.revenue / 1000000).toFixed(1)}M</div>
                    <div className="text-sm text-gray-600">{service.orders} orders</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Average Duration: </span>
                    <span className="font-medium">{service.avgDuration}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revenue per Order: </span>
                    <span className="font-medium">Rp {Math.round(service.revenue / service.orders / 1000)}k</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Growth: </span>
                    <span className="font-medium text-green-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* City Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by City</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {cityData.map((city) => (
              <div key={city.city} className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg">{city.city}</h3>
                <div className="text-2xl font-bold text-blue-600">
                  Rp {(city.revenue / 1000000).toFixed(0)}M
                </div>
                <div className="text-sm text-gray-600">{city.orders} orders</div>
                <div className="text-xs text-gray-500 mt-1">
                  Avg: Rp {Math.round(city.revenue / city.orders / 1000)}k/order
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Orders by Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSlotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Peak Hours:</strong> 17:00-21:00 (Sore) dengan 378 orders</p>
            <p><strong>Lowest Activity:</strong> 00:00-08:00 (Dini Hari) dengan 67 orders</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceAnalytics;
