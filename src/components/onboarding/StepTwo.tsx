'use client';

import { useState } from 'react';
import { uploadPDF, extractTopicsFromJSON } from '@/lib/api';
import { Upload, FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { BasicInfo, ExtractedData } from '@/lib/types';

interface StepTwoProps {
  basicInfo: BasicInfo;
  onNext: (data: ExtractedData) => void;
  onBack: () => void;
}

interface FileUploadResult {
  filename: string;
  json_path: string;
  json_filename: string;
  text_length: number;
  status: 'success' | 'error';
}

export default function StepTwo({ basicInfo, onNext, onBack }: StepTwoProps) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    pyq: null,
    syllabus: null,
    notes: null,
  });
  
  const [uploadResults, setUploadResults] = useState<FileUploadResult[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'uploading' | 'extracting' | 'done'>('select');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (type: string, file: File | null) => {
    setFiles(prev => ({ ...prev, [type]: file }));
  };

  const handleUpload = async () => {
    setError(null);
    setCurrentStep('uploading');
    const results: FileUploadResult[] = [];
    
    try {
      console.log('\n🚀 Starting upload process...');
      
      // Step 1: Upload all files and save to JSON
      for (const [type, file] of Object.entries(files)) {
        if (file) {
          try {
            console.log(`\n📤 Uploading ${type}: ${file.name}`);
            const result = await uploadPDF(file, type);
            
            results.push({
              filename: result.filename,
              json_path: result.json_path,
              json_filename: result.json_filename,
              text_length: result.text_length,
              status: 'success'
            });
            
            console.log(`✓ Uploaded successfully: ${result.json_filename}`);
          } catch (err: any) {
            console.error(`❌ Failed to upload ${type}:`, err);
            results.push({
              filename: file.name,
              json_path: '',
              json_filename: '',
              text_length: 0,
              status: 'error'
            });
          }
        }
      }
      
      setUploadResults(results);
      
      const successfulUploads = results.filter(r => r.status === 'success');
      
      if (successfulUploads.length === 0) {
        throw new Error('No files were uploaded successfully');
      }
      
      console.log(`\n✓ Upload phase complete: ${successfulUploads.length}/${results.length} files successful`);
      
      // Step 2: Extract topics from saved JSON files
      setCurrentStep('extracting');
      console.log('\n🤖 Starting topic extraction from JSON files...');
      
      const jsonPaths = successfulUploads.map(r => r.json_path);
      console.log('JSON paths:', jsonPaths);
      
      const topicsResult = await extractTopicsFromJSON(jsonPaths);
      
      console.log(`✓ Topic extraction complete: ${topicsResult.topics.length} topics found`);
      console.log('Topics:', topicsResult.topics);
      
      // Step 3: Move to next step
      setCurrentStep('done');
      
      const combinedText = successfulUploads
        .map(r => `[${r.filename}] (${r.text_length} chars)`)
        .join('\n');
      
      onNext({ 
        extractedText: combinedText,
        topics: topicsResult.topics 
      });
      
    } catch (error: any) {
      console.error('\n❌ Upload process failed:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to process files';
      setError(errorMessage);
      setCurrentStep('select');
    }
  };

  const hasFiles = Object.values(files).some(f => f);
  const canUpload = hasFiles && currentStep === 'select';

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 mb-4"
          disabled={currentStep !== 'select'}
        >
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-gray-800">Upload Study Materials</h2>
        <p className="text-gray-600 mt-2">Upload PDFs to extract topics and create your study plan</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Progress indicator */}
      {currentStep !== 'select' && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="font-medium text-blue-900">
                {currentStep === 'uploading' && 'Uploading and extracting text from PDFs...'}
                {currentStep === 'extracting' && 'Analyzing content with AI...'}
                {currentStep === 'done' && 'Complete!'}
              </p>
              {uploadResults.length > 0 && (
                <p className="text-sm text-blue-700 mt-1">
                  Processed {uploadResults.filter(r => r.status === 'success').length}/{uploadResults.length} files
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* File upload boxes */}
      {['pyq', 'syllabus', 'notes'].map((type) => (
        <div key={type} className="border-2 border-dashed border-gray-300 rounded-lg p-6 relative">
          <label className="flex flex-col items-center cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700 capitalize">
              {type === 'pyq' ? 'Previous Year Questions' : type}
            </span>
            <span className="text-xs text-gray-500 mt-1">Click to upload PDF</span>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)}
              className="hidden"
              disabled={currentStep !== 'select'}
            />
            {files[type] && (
              <div className="mt-2 flex items-center text-sm text-gray-700">
                <FileText className="w-4 h-4 mr-1" />
                {files[type]?.name}
              </div>
            )}
          </label>
          
          {uploadResults.find(r => files[type] && r.filename === files[type]?.name) && (
            <div className="absolute top-4 right-4">
              {uploadResults.find(r => files[type] && r.filename === files[type]?.name)?.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleUpload}
        disabled={!canUpload}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {currentStep === 'select' ? (
          'Extract Topics & Continue'
        ) : (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        )}
      </button>
    </div>
  );
}
