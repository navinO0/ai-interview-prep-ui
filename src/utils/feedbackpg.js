import ReactMarkdown from "react-markdown";


const Feedbackpg = (props) => {
    const { feedback } = props; 
    return (
            <div className="mt-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                Feedback Summary
              </h2>
              {/* <div className="bg-gray-100 p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
                <p className="text-lg">
                  <span className="font-semibold text-indigo-700">Score:</span>{" "}
                  <span className="font-bold">{feedback.score} / 10</span>
                </p>
              </div> */}

             {feedback.question && (
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                  <p className="font-semibold text-green-700 mb-2">Question:</p>
                  <ul className="list-disc pl-6 text-green-800 space-y-1">
                    <ReactMarkdown >{feedback.question}</ReactMarkdown>
                  </ul>
                </div>
            )}
             {feedback.userAnswer && (
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                  <p className="font-semibold text-green-700 mb-2">Your Answer:</p>
                  <ul className="list-disc pl-6 text-green-800 space-y-1">
                    {feedback.userAnswer}
                  </ul>
                </div>
              )}
              
              {/* {feedback.strengths && (
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                  <p className="font-semibold text-green-700 mb-2">Strengths:</p>
                  <ul className="list-disc pl-6 text-green-800 space-y-1">
                    {feedback.strengths}
                  </ul>
                </div>
              )} */}

              {/* {feedback.improvements && (
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                  <p className="font-semibold text-red-700 mb-2">Improvements:</p>
                  <ul className="list-disc pl-6 text-red-800 space-y-1">
                    {feedback.improvements}
                  </ul>
                </div>
              )} */}

              {/* {feedback.missed_points && (
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-700 mb-2">
                    Missed Points:
                  </p>
                  <ul className="list-disc pl-6 text-yellow-800 space-y-1">
                    {feedback.missed_points}
                  </ul>
                </div>
              )} */}

              {feedback.sarcastic_feedback && (
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-700 mb-2">
                    Feedback:
                  </p>
                  <p className="text-blue-800">{feedback.sarcastic_feedback}</p>
                </div>
              )}

              {/* {feedback.final_feedback && (
                <div className="bg-purple-50 p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-700 mb-2">
                    Final Feedback:
                  </p>
                  <p className="text-purple-800">{feedback.final_feedback}</p>
                </div>
              )} */}
              {feedback.actual_answer && (
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-gray-400">
                  <p className="font-semibold mb-2">
                    Suggested Answer:
                  </p>
                  <div className="md:prose-base max-w-none  max-h-60 overflow-y-auto pr-2">
                    <ReactMarkdown >{feedback.actual_answer}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
    )
}
export default Feedbackpg