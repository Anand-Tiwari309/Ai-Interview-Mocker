"use client"
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import React, { useEffect, useState } from 'react'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button';
import Link from 'next/link'

function Interview({ params }) {
    const [InterviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setwebCamEnabled] = useState(false);

    useEffect(() => {
        console.log(params.interviewId);
        GetInterviewDetails();
    }, [params.interviewId]);

    useEffect(() => {
        if (InterviewData) {
            console.log("this is interview", InterviewData.jobDesc);
        }
    }, [InterviewData]);

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId));
        setInterviewData(result[0]);
    }

    return (
        <div className="my-10 ">
            <h2 className="font-bold text-2xl">Let's get started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col p-5 gap-5 rounded-lg border'>
                        {InterviewData ? (
                            <>
                                <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {InterviewData.jobPosition}</h2>
                                <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {InterviewData.jobDescription}</h2>
                                <h2 className='text-lg'><strong>Years of Experience:</strong> {InterviewData.jobExperience}</h2>
                            </>
                        ) : (
                            <p>Loading interview details...</p>
                        )}
                    </div>
                    <div className='border p-5 rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            style={{
                                height: 300,
                                width: 300
                            }}
                            onUserMedia={() => (true)}
                            onUserMediaError={() => setwebCamEnabled(false)}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border-' />
                            <button variant="ghost" className='w-full bg-blue' onClick={() => setwebCamEnabled(true)}>Enable Web Cam and Microphone</button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end'>
                <Link href={params.interviewId+'/start'}>
                <Button>Start Interview</Button>
                </Link>
            
            </div>
        </div>
    )
}

export default Interview
