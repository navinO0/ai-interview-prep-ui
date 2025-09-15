import { Editor } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";

const Feedbackpg = ({ feedback, question_type }) => {
    return (
        <div className="mt-10 space-y-8">
            {feedback.sarcastic_feedback && (
                <div className="text-center space-y-4">
                    <div className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl font-extrabold tracking-wide">
                        {feedback.score} / 10
                    </div>

                    <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
                        Feedback
                    </h2>

                    <p className="text-xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
                        {feedback.sarcastic_feedback}
                    </p>
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-3">
                Feedback Summary
            </h2>

            {feedback.question && (
                <div className="bg-green-50 p-5 rounded-2xl shadow-md border border-green-200">
                    <p className="font-semibold text-green-700 mb-3 text-lg">
                        Question
                    </p>
                    <div className=" max-w-none text-green-900">
                        <ReactMarkdown>{feedback.question}</ReactMarkdown>
                    </div>
                </div>
            )}


            {(question_type.toLowerCase() !== "coding" && feedback.userAnswer) && (
                <div className="bg-emerald-50 p-5 rounded-2xl shadow-md border border-emerald-200">
                    <p className="font-semibold text-emerald-700 mb-3 text-lg">
                        Your Answer
                    </p>
                    <p className="text-emerald-900 leading-relaxed">
                        {feedback.userAnswer}
                    </p>
                </div>
            )}

            {question_type.toLowerCase() === "coding" && (
                <div className="flex-1">
                    <div className="bg-emerald-50 p-5 rounded-2xl shadow-md border border-emerald-200">
                        <p className="font-semibold text-emerald-700 mb-3 text-lg">
                            Your Answer
                        </p>
                        <p className="text-emerald-900 leading-relaxed">
                            <Editor
                                height="40vh"

                                // language={language}
                                value={feedback.userAnswer}
                                theme="vs-dark"
                                onChange={(val) => setCode(feedback.userAnswer || "")}
                            />
                        </p>
                    </div>


                </div>
            )}

            {feedback.actual_answer && (
                <div className="bg-gray-50 p-5 rounded-2xl shadow-md border border-gray-300">
                    <p className="font-semibold text-gray-800 mb-3 text-lg">
                        Suggested Answer
                    </p>
                    <div className="  max-w-none max-h-90 overflow-y-auto pr-2">
                        <ReactMarkdown>{feedback.actual_answer}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Feedbackpg;
