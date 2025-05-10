
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, CheckCircle, AlertCircle, BarChart } from 'lucide-react';
import { getCouponStats } from '@/services/couponService';

const CouponStats = () => {
  const [stats, setStats] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    redemptionsCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const couponStats = await getCouponStats();
        setStats(couponStats);
      } catch (error) {
        console.error('Error loading coupon stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Coupons',
      value: stats.totalCoupons,
      icon: <Ticket className="h-8 w-8 text-pink-500" />,
      color: 'bg-pink-100',
    },
    {
      title: 'Active Coupons',
      value: stats.activeCoupons,
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      color: 'bg-green-100',
    },
    {
      title: 'Expired Coupons',
      value: stats.expiredCoupons,
      icon: <AlertCircle className="h-8 w-8 text-orange-500" />,
      color: 'bg-orange-100',
    },
    {
      title: 'Total Redemptions',
      value: stats.redemptionsCount,
      icon: <BarChart className="h-8 w-8 text-blue-500" />,
      color: 'bg-blue-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6 h-24 flex items-center justify-center">
              <div className="w-full h-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className={`rounded-full p-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h4 className="text-2xl font-bold">{stat.value}</h4>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CouponStats;
