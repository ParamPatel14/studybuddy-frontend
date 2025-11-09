'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { 
  AlertCircle, BookOpen, Zap, FileText, Target, Brain, 
  Clock, TrendingUp, Award, CheckCircle, Sparkles 
} from 'lucide-react';

export default function ExamDayPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const userId = 1;

  const [revisionSheets, setRevisionSheets] = useState<any>(null);
  const [confidenceData, setConfidenceData] = useState<any>(null);
  const [strategyGuide, setStrategyGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (planId) {
      loadExamDayData();
    }
  }, [planId]);

  const loadExamDayData = async () => {
    try {
      const [revision, confidence, strategy] = await Promise.all([
        api.get(`/api/exam-day/quick-revision/${planId}`),
        api.get(`/api/exam-day/confidence-booster/${userId}`, { params: { plan_id: planId } }),
        api.get(`/api/exam-day/exam-strategy/${planId}`)
      ]);

      setRevisionSheets(revision.data);
      setConfidenceData(confidence.data);
      setStrategyGuide(strategy.data);
    } catch (error) {
      console.error('Failed to load exam day data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRapidQuiz = async (topicId: number) => {
    router.push(`/exam-day/rapid-quiz?topicId=${topicId}&planId=${planId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam day tools...</p>
        </div>
      </div>
    );
  }

  const daysRemaining = revisionSheets?.days_remaining || 0;
  const isExamDay = daysRemaining === 0;
  const isExamTomorrow = daysRemaining === 1;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                {isExamDay ? '🔥' : '⚡'} Exam Day Preparation
              </h1>
              <p className="text-purple-100 text-lg">
                {isExamDay && "Today is your exam day! You've got this! 💪"}
                {isExamTomorrow && "Exam tomorrow! Final revision time 📚"}
                {!isExamDay && !isExamTomorrow && `${daysRemaining} days until exam`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-6xl font-bold">{daysRemaining}</div>
              <div className="text-purple-100">days left</div>
            </div>
          </div>
        </div>

        {/* Confidence Booster */}
        {confidenceData && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-yellow-500" />
              Your Preparation Score
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {confidenceData.total_questions_solved}
                </div>
                <div className="text-sm text-gray-600">Questions Solved</div>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-green-50 to-green-100 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {confidenceData.average_score.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {confidenceData.mastery_level}%
                </div>
                <div className="text-sm text-gray-600">Mastery Level</div>
              </div>
              <div className="text-center p-4 bg-linear-to-br from-yellow-50 to-yellow-100 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">
                  {confidenceData.ready_score}%
                </div>
                <div className="text-sm text-gray-600">Exam Ready</div>
              </div>
            </div>

            <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
              <p className="text-lg text-gray-900 font-semibold mb-2">
                {confidenceData.motivational_message}
              </p>
              <p className="text-sm text-gray-700">
                Predicted Score: <strong>{confidenceData.predicted_score_range}</strong>
              </p>
            </div>

            {confidenceData.achievements.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Your Achievements
                </h3>
                <div className="space-y-2">
                  {confidenceData.achievements.map((achievement: string, index: number) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => document.getElementById('revision-sheets')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left border-l-4 border-blue-500"
          >
            <FileText className="w-12 h-12 text-blue-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Quick Revision</h3>
            <p className="text-sm text-gray-600">1-page sheets per topic</p>
          </button>

          <button
            onClick={() => router.push(`/exam-day/formula-sheet?planId=${planId}`)}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left border-l-4 border-green-500"
          >
            <BookOpen className="w-12 h-12 text-green-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Formula Sheet</h3>
            <p className="text-sm text-gray-600">Quick lookup reference</p>
          </button>

          <button
            onClick={() => document.getElementById('rapid-quiz')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left border-l-4 border-purple-500"
          >
            <Zap className="w-12 h-12 text-purple-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">5-Min Quiz</h3>
            <p className="text-sm text-gray-600">Rapid confidence boost</p>
          </button>

          <button
            onClick={() => document.getElementById('strategy')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition text-left border-l-4 border-orange-500"
          >
            <Target className="w-12 h-12 text-orange-600 mb-3" />
            <h3 className="font-bold text-gray-900 mb-1">Exam Strategy</h3>
            <p className="text-sm text-gray-600">Time management tips</p>
          </button>
        </div>

        {/* Revision Sheets */}
        <div id="revision-sheets" className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-blue-600" />
            Quick Revision Sheets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {revisionSheets?.revision_sheets.map((sheet: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-gray-900">{sheet.topic_name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sheet.mastery_level >= 80 ? 'bg-green-100 text-green-800' :
                    sheet.mastery_level >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sheet.mastery_level.toFixed(0)}% mastered
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">Key Formulas:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      {sheet.key_formulas.slice(0, 3).map((formula: string, i: number) => (
                        <li key={i}>{formula}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-700">Quick Tips:</p>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      {sheet.quick_tips.slice(0, 2).map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleRapidQuiz(sheet.topic_id)}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                >
                  5-Min Quiz
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Exam Strategy */}
        {strategyGuide && (
          <div id="strategy" className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-orange-600" />
              Exam Strategy Guide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Time Management</h3>
                <div className="space-y-2">
                  {Object.entries(strategyGuide.time_allocation).map(([key, value]: any) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-semibold text-blue-600">{value} min</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Question Selection Tips</h3>
                <ul className="space-y-2">
                  {strategyGuide.question_selection_tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600 shrink-0 mt-0.5" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-green-900 mb-3">✓ DO</h3>
                <ul className="space-y-1">
                  {strategyGuide.dos_and_donts.do.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-red-900 mb-3">✗ DON'T</h3>
                <ul className="space-y-1">
                  {strategyGuide.dos_and_donts.dont.map((item: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Stress Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {strategyGuide.stress_management.map((tip: string, index: number) => (
                  <div key={index} className="flex items-start text-sm text-blue-800">
                    <Brain className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
