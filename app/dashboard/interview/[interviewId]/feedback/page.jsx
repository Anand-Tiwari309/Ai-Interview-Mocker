"use client";
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

function Feedback({ params }) {
    const [feedbackList, setFeedbackList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getFeedback();
    }, []);

    const getFeedback = async () => {
        try {
            const result = await db.select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIdRef, params.interviewId))
                .orderBy(UserAnswer.id);
            console.log("this is result", result);
            setFeedbackList(result);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    return (
        <div className='p-10'>
            <h2 className='text-3xl font-bold text-green-300'>Congratulations!</h2>
            <h2 className='font-bold text-2xl'>Here is your Interview feedback</h2>
            {feedbackList?.length==0 ?
            <h2>No Interview Feedback Found</h2>
        :<>
            <h2 className="text-primary text-lg my-3">
                Your overall interview rating <strong>7/10</strong>
            </h2>
            <h2 className='text-sm text-gray-500'>
                Find below interview question with correct answer, your answer, and feedback for improvement
            </h2>
            {feedbackList && feedbackList.map((item, index) => (
                <Collapsible key={index}>
                    <CollapsibleTrigger className='p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-10 w-full'>
                        {item.question} 
                        <ChevronsUpDown className='h-4 w-5 inline-block ml-2' />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className='flex flex-col gap-2'>
                            <p className='p-2 border rounded-lg bg-red-50'>
                                <strong>User Answer:</strong> {item.UserAns}
                            </p>
                            <p className='p-2 border rounded-lg bg-green-100'>
                                <strong>Correct Answer:</strong> {item.correctAns}
                            </p>
                            {item.feedback && 
                                <p className='p-2 border rounded-lg bg-blue-100'>
                                    <strong>Feedback:</strong> {item.feedback}
                                </p>
                            }
                            {item.rating && 
                                <p className='text-red-500 p-2 border rounded-lg'>
                                    <strong>Answer Rating:</strong> {item.rating}
                                </p>
                            }
                        </div>
                    </CollapsibleContent>
                </Collapsible>
            ))}
            </>}
            <Button onClick={() => router.replace('/dashboard')}>
                Go Home
            </Button>
        </div>
        
    );
}

export default Feedback;
