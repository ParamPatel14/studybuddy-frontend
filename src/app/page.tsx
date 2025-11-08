'use client';

import { useRouter } from 'next/navigation';
import { GraduationCap, Briefcase, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-10 h-10 text-yellow-500 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Smart Study Buddy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered preparation for exams and job interviews
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
          {/* Exam Prep */}
          <button
            onClick={() => router.push('/onboarding')}
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 text-left transform hover:scale-105 duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                Phases 1-3
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Exam Preparation
            </h2>
            
            <p className="text-gray-600 mb-4 text-sm">
              Complete AI-powered study system for academic exams
            </p>
            
            <div className="space-y-2 mb-6">
              {[
                'AI study plans',
                'Practice questions',
                'Progress tracking',
                'Voice-enabled chatbot'
              ].map((feature, i) => (
                <div key={i} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>

          {/* Placement Prep */}
          <button
            onClick={() => router.push('/placement/welcome')}
            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all p-8 text-left transform hover:scale-105 duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-linear-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                Phase 4
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Placement Preparation
            </h2>
            
            <p className="text-gray-600 mb-4 text-sm">
              Company-specific interview preparation system
            </p>
            
            <div className="space-y-2 mb-6">
              {[
                'Company-specific plans',
                'Round-wise preparation',
                'DSA & system design',
                'Mock interviews'
              ].map((feature, i) => (
                <div key={i} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
            
            <div className="flex items-center text-green-600 font-semibold group-hover:text-teal-600">
              Get Started
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Both modes are completely independent • No conflicts • Separate databases</p>
        </div>
      </div>
    </div>
  );
}
