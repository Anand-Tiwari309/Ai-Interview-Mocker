import { Volume2 } from 'lucide-react';
import React from 'react';

const QuestionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
    console.log("this is questionaire", mockInterviewQuestion);

    const textToSpeech = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        } else {
            alert('Sorry, your browser does not support text to speech');
        }
    };

    if (!mockInterviewQuestion || !mockInterviewQuestion.length) {
        return (
            <div className="p-5 border rounded-lg my-10">
                <p>No interview questions available.</p>
            </div>
        );
    }

    return (
        <div className='p-5 border rounded-lg my-10'>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {mockInterviewQuestion.map((question, index) => (
                    <h2
                        key={index}
                        className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index ? 'bg-primary text-white' : 'bg-secondary text-black'}`}
                    >
                        Question #{index + 1}
                    </h2>
                ))}
            </div>
            {mockInterviewQuestion[activeQuestionIndex] && (
                <div className='my-5'>
                    <h2 className='text-md md:text-lg'>{mockInterviewQuestion[activeQuestionIndex].question}</h2>
                    <Volume2
                        onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex].question)}
                        className="cursor-pointer text-primary ml-2"
                        size={24}
                        aria-label="Listen to question"
                        title="Listen to question"
                    />
                </div>
            )}
            <div className='border rounded-lg p-5 bg-blue-100'>
                <h2 className='text-primary'>
                    Click on Record Answer when you want to answer the question. At the end of the interview, we will give you feedback along with the correct answer for each question and your answer to compare it.
                </h2>
            </div>
        </div>
    );
}

export default QuestionsSection;
