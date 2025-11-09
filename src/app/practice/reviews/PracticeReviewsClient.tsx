'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Calendar, Clock, Brain, TrendingUp } from 'lucide-react';

interface DueReview {
  topic_id: number;
  topic_name: string;
  next_review_date: string;
  days_overdue: number;
  review_count: number;
  interval_days: number;
}

export default function ReviewsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = 1;

  const [dueReviews, setDueReviews] = useState<DueReview[]>([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const [dueData, upcomingData] = await Promise.all([
        api.get(`/api/srs/due-reviews/${userId}`, { params: { plan_id: planId } }),
        api.get(`/api/srs/upcoming-reviews/${userId}`, { params: { days_ahead: 7, plan_id: planId } })
      ]);

      setDueReviews(dueData.data.due_today);
      setUpcomingSchedule(upcomingData.data.schedule);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = (topicId: number) => {
    router.push(`/practice/session?topicId=${topicId}&difficulty=medium&planId=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-blue-600" />
            Spaced Repetition Reviews
          </h1>
          <p className="text-gray-600">
            Review topics at optimal intervals for maximum retention
          </p>
        </div>

        {/* Due Today Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-orange-600" />
              Due Today
            </h2>
            <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-bold">
              {dueReviews.length} topic{dueReviews.length !== 1 ? 's' : ''}
            </span>
          </div>

          {dueReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
              <p className="text-gray-600">No reviews due today. Great job staying on track!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dueReviews.map((review) => (
                <div
                  key={review.topic_id}
                  className="border border-orange-200 rounded-lg p-4 hover:shadow-md transition bg-orange-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {review.topic_name}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          Review #{review.review_count}
                        </span>
                        {review.days_overdue > 0 && (
                          <span className="text-red-600 font-semibold">
                            {review.days_overdue} day{review.days_overdue !== 1 ? 's' : ''} overdue
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleStartReview(review.topic_id)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
                    >
                      Review Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Reviews Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Upcoming Reviews (Next 7 Days)
          </h2>

          <div className="space-y-3">
            {Object.entries(upcomingSchedule).map(([date, reviews]: [string, any]) => {
              const reviewCount = reviews.length;
              const dateObj = new Date(date);
              const isToday = date === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={date}
                  className={`border rounded-lg p-4 ${
                    isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {dateObj.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        {isToday && <span className="ml-2 text-blue-600">(Today)</span>}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                      {reviewCount} review{reviewCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {reviewCount > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {reviews.map((review: any) => (
                        <span
                          key={review.topic_id}
                          className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:border-blue-500 cursor-pointer transition"
                          onClick={() => handleStartReview(review.topic_id)}
                        >
                          {review.topic_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-600" />
            How Spaced Repetition Works
          </h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              • Topics are reviewed at increasing intervals based on your performance
            </p>
            <p>
              • Better performance = longer intervals between reviews
            </p>
            <p>
              • Struggling topics are reviewed more frequently
            </p>
            <p>
              • This method optimizes long-term retention and reduces study time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
