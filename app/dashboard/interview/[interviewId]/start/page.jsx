"use client";
import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnsSection from './_components/RecordAnsSection';
import Link from 'next/link';
const StartInterview = ({ params }) => {
    const [interviewData, setInterviewData] = useState();
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0); // Start from the first question

    useEffect(() => {
        getInterviewDetails();
    }, []);

    useEffect(() => {
        console.log("Mock Interview Questions:", mockInterviewQuestion);
    }, [mockInterviewQuestion]);

    const getInterviewDetails = async () => {
        try {
            const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
            if (result && result.length > 0) {
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                setMockInterviewQuestion(jsonMockResp);
                setInterviewData(result[0]);
            } else {
                // Handle case when result is empty
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    const handleNextQuestion = () => {
        setActiveQuestionIndex(prevIndex => prevIndex + 1);
    };

    const handlePreviousQuestion = () => {
        setActiveQuestionIndex(prevIndex => prevIndex - 1);
    };

    const handleEndInterview = () => {
        // Logic to end the interview
        console.log('End of interview');
    };

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />
                <RecordAnsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className="flex justify-end gap-6 mt-4">
                {activeQuestionIndex > 0 && (
                    <button onClick={handlePreviousQuestion}>Previous Question</button>
                )}
                {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
                    <button onClick={handleNextQuestion}>Next Question</button>
                )}
                {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
                    <Link href={'/dashboard/interview/'+interviewData?.mockId+'/feedback'}>
                    <button onClick={handleEndInterview}>End Interview</button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default StartInterview;
