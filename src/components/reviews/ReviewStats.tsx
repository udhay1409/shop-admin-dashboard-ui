
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { getReviewStats } from '@/services/reviewService';
import { Review } from '@/types/review';

interface ReviewStatsProps {
  reviews: Review[];
}

export const ReviewStats: React.FC<ReviewStatsProps> = ({ reviews }) => {
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    statusCounts: {
      published: 0,
      pending: 0,
      rejected: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const reviewStats = await getReviewStats();
        setStats(reviewStats);
      } catch (error) {
        console.error('Error loading review stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [reviews]);

  const statsCards = [
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      color: "bg-yellow-100"
    },
    {
      title: "Average Rating",
      value: stats.averageRating.toFixed(1),
      icon: <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />,
      color: "bg-yellow-100"
    },
    {
      title: "Pending Reviews",
      value: stats.statusCounts.pending,
      icon: <Clock className="h-6 w-6 text-orange-500" />,
      color: "bg-orange-100"
    },
    {
      title: "Published Reviews",
      value: stats.statusCounts.published,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      color: "bg-green-100"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6 h-24 flex items-center justify-center">
              <div className="w-full h-full bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-full p-3 ${stat.color}`}>
              {stat.icon}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
