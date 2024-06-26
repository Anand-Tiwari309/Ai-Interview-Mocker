import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button"; // Ensure you have the Button component
import { useRouter } from 'next/navigation';
const InterviewItemCard = ({ interview }) => {
  const router = useRouter();

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId);
  }

  const onFeedback = () => {
    router.push('/dashboard/interview/' + interview.mockId + "/feedback");
  }

  return (
    <div className='border shadow-sm rounded-lg p-3 '>
      <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
      <h2 className='text-xs text-gray-400'> Created At: {interview.createdAt}</h2>
      <div className='flex justify-between my-2 gap-5'>
        <Link href={"/dashboard/interview/" + interview?.mockId+"/feedback"} className="w-full">
          <Button size="sm" variant="outline" className="w-full">Feedback</Button>
        </Link>
        <Button size="sm" className="w-full" onClick={onStart}>Start</Button>
      </div>
    </div>
  );
}

export default InterviewItemCard;
