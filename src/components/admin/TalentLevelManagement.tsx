
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Award, Crown, TrendingUp } from 'lucide-react';

const TalentLevelManagement = () => {
  const talentLevels = [
    {
      name: 'Fresh Talent',
      icon: Star,
      count: 89,
      commission: 20,
      requirements: 'Default level untuk talent baru',
      color: 'bg-blue-100 text-blue-600',
      borderColor: 'border-blue-200',
      upgradePath: 'Selesaikan 30 order dengan rating 4.5+'
    },
    {
      name: 'Elite Talent',
      icon: Award,
      count: 45,
      commission: 18,
      requirements: '30+ order selesai, rating minimal 4.5/5',
      color: 'bg-green-100 text-green-600',
      borderColor: 'border-green-200',
      upgradePath: '6 bulan aktif + 100 order dengan rating 4.5+'
    },
    {
      name: 'VIP Talent',
      icon: Crown,
      count: 22,
      commission: 15,
      requirements: '6+ bulan aktif, 100+ order, rating minimal 4.5/5',
      color: 'bg-purple-100 text-purple-600',
      borderColor: 'border-purple-200',
      upgradePath: 'Level tertinggi'
    }
  ];

  const talentProgression = [
    {
      name: 'Sarah M.',
      currentLevel: 'Fresh Talent',
      orders: 25,
      rating: 4.7,
      nextLevel: 'Elite Talent',
      progress: 83, // 25/30 orders
      timeActive: '3 bulan'
    },
    {
      name: 'Maya A.',
      currentLevel: 'Elite Talent',
      orders: 78,
      rating: 4.6,
      nextLevel: 'VIP Talent',
      progress: 78, // 78/100 orders
      timeActive: '4 bulan'
    },
    {
      name: 'Andi K.',
      currentLevel: 'VIP Talent',
      orders: 156,
      rating: 4.8,
      nextLevel: 'Max Level',
      progress: 100,
      timeActive: '8 bulan'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Talent Level Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {talentLevels.map((level) => {
          const Icon = level.icon;
          return (
            <Card key={level.name} className={`${level.borderColor} border-2`}>
              <CardHeader>
                <CardTitle className={`text-lg flex items-center gap-2 ${level.color.split(' ')[1]}`}>
                  <Icon className="w-5 h-5" />
                  {level.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-3xl font-bold">{level.count}</div>
                  <Badge className={level.color}>
                    Komisi Platform: {level.commission}%
                  </Badge>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Requirements:</p>
                    <p>{level.requirements}</p>
                  </div>
                  <div className="text-sm text-blue-600">
                    <p className="font-medium mb-1">Upgrade Path:</p>
                    <p>{level.upgradePath}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Talent Progression Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Talent Progression Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {talentProgression.map((talent) => (
              <div key={talent.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{talent.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{talent.currentLevel}</Badge>
                      <span className="text-sm text-gray-500">
                        {talent.orders} orders • ⭐ {talent.rating} • {talent.timeActive}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Next Level:</div>
                    <div className="font-medium">{talent.nextLevel}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {talent.nextLevel}</span>
                    <span>{talent.progress}%</span>
                  </div>
                  <Progress value={talent.progress} className="h-2" />
                  
                  {talent.currentLevel === 'Fresh Talent' && (
                    <div className="text-xs text-gray-500">
                      Butuh {30 - talent.orders} order lagi untuk Elite Talent
                    </div>
                  )}
                  {talent.currentLevel === 'Elite Talent' && (
                    <div className="text-xs text-gray-500">
                      Butuh {100 - talent.orders} order lagi dan {6 - parseInt(talent.timeActive)} bulan untuk VIP Talent
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Structure & Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Commission Rates</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Fresh Talent</span>
                  <Badge className="bg-blue-100 text-blue-600">20% Platform Commission</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Elite Talent</span>
                  <Badge className="bg-green-100 text-green-600">18% Platform Commission</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="font-medium">VIP Talent</span>
                  <Badge className="bg-purple-100 text-purple-600">15% Platform Commission</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Additional Benefits</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded">
                  <div className="font-medium text-green-600">Elite Talent</div>
                  <div className="text-sm text-gray-600">Priority support, featured listing</div>
                </div>
                <div className="p-3 border rounded">
                  <div className="font-medium text-purple-600">VIP Talent</div>
                  <div className="text-sm text-gray-600">Premium support, top listing, exclusive promotions</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentLevelManagement;
