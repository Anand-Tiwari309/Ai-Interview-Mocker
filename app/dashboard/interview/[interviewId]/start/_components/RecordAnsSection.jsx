"use client";
import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const RecordAnsSection = ({ mockInterviewQuestion, activeQuestionIndex, interviewData }) => {
  const { user } = useUser();
  const [recordedResponse, setRecordedResponse] = useState(null);
  const [showResponse, setShowResponse] = useState(false);
  const [feedbackPrompt, setFeedbackPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({ continuous: true, useLegacyResults: false });

  useEffect(() => {
    if (mockInterviewQuestion && mockInterviewQuestion.length > 0 && activeQuestionIndex >= 0) {
      setFeedbackPrompt(`Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}`);
    }
  }, [activeQuestionIndex, mockInterviewQuestion]);

  const handleStopRecording = async () => {
    stopSpeechToText();
    const finalTranscript = results.map(result => result.transcript).join(' ');
    if (!finalTranscript || finalTranscript.length < 10) {
      setError('Error: Recorded answer is too short.');
      return;
    }

    try {
      setLoading(true);
      const inputPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${finalTranscript}. Please provide feedback in JSON format with rating and feedback fields.`;
      const chatSession = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
      }).startChat({
        generationConfig: {
          temperature: 1,
          topP: 0.95,
          topK: 64,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
        history: [],
      });

      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
      const { rating, feedback } = JSON.parse(mockJsonResp);

      const mockIdRef = interviewData.mockId || '';

      console.log('Inserting User Answer:', {
        mockIdRef: mockIdRef,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        UserAns: finalTranscript,
        feedback: feedback || "",
        rating: rating.toString() || "",
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      });

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: mockIdRef,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        UserAns: finalTranscript,
        feedback: feedback || "",
        rating: rating.toString() || "",
        userEmail: user?.primaryEmailAddress.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      }).execute();

      if (resp) {
        setRecordedResponse({ rating, feedback });
        setShowResponse(true);
      } else {
        setError('Failed to save user answer.');
      }
    } catch (error) {
      console.error('Failed to fetch data from Gemini API:', error);
      setError('Failed to fetch data from Gemini API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-20 space-y-10">
      <div className="bg-secondary rounded-lg p-5 flex flex-col items-center">
        <WebcamIcon className="text-black" size={196} />
        <Webcam
          mirrored={true}
          className="mt-5"
          style={{
            height: 200,
            width: 300,
            zIndex: 10,
            borderRadius: '10px',
          }}
        />
      </div>
      <Button variant="outline" className="my-5" onClick={isRecording ? handleStopRecording : startSpeechToText} disabled={loading}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <h1 className="text-lg font-semibold">Recording: {isRecording.toString()}</h1>
      <div className="w-full max-w-lg px-5 py-3 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-md font-medium">Transcripts:</h2>
        <ul className="list-disc list-inside">
          {results.map((result) => (
            <li key={result.timestamp} className="text-sm">{result.transcript}</li>
          ))}
          {interimResult && <li className="text-sm italic">{interimResult}</li>}
        </ul>
      </div>
      {recordedResponse && (
        <>
          <Button variant="outline" className="my-5" onClick={() => setShowResponse(!showResponse)}>
            {showResponse ? 'Hide Response' : 'Show Response'}
          </Button>
          {showResponse && (
            <div className="w-full max-w-lg px-5 py-3 bg-green-100 rounded-lg shadow-md">
              <h2 className="text-md font-medium">Generated Response:</h2>
              <p className="text-sm">Rating: {recordedResponse.rating}</p>
              <p className="text-sm">Feedback: {recordedResponse.feedback}</p>
            </div>
          )}
        </>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default RecordAnsSection;
