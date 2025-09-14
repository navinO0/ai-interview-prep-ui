import ReactMarkdown from "react-markdown";

const Feedbackpg = ({ feedback }) => {
  return (
    <div className="mt-10 space-y-8">
      {/* Main Feedback + Score */}
      {feedback.sarcastic_feedback && (
        <div className="text-center space-y-4">
          {/* Score Highlight */}
          <div className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-lg text-2xl font-extrabold tracking-wide">
            {feedback.score} / 10
          </div>

          {/* Feedback Heading */}
          <h2 className="text-3xl font-extrabold text-gray-900 mt-4">
            Feedback
          </h2>

          {/* Feedback Text */}
          <p className="text-xl text-gray-700 italic leading-relaxed max-w-3xl mx-auto">
            {feedback.sarcastic_feedback}
          </p>
        </div>
      )}

      {/* Section Title */}
      <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-gray-200 pb-3">
        Feedback Summary
      </h2>

      {/* Question */}
      {feedback.question && (
        <div className="bg-green-50 p-5 rounded-2xl shadow-md border border-green-200">
          <p className="font-semibold text-green-700 mb-3 text-lg">
            Question
          </p>
          <div className="prose prose-green max-w-none text-green-900">
            <ReactMarkdown>{feedback.question}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* User Answer */}
      {feedback.userAnswer && (
        <div className="bg-emerald-50 p-5 rounded-2xl shadow-md border border-emerald-200">
          <p className="font-semibold text-emerald-700 mb-3 text-lg">
            Your Answer
          </p>
          <p className="text-emerald-900 leading-relaxed">
            {feedback.userAnswer}
          </p>
        </div>
      )}

      {/* Suggested Answer */}
      {feedback.actual_answer && (
        <div className="bg-gray-50 p-5 rounded-2xl shadow-md border border-gray-300">
          <p className="font-semibold text-gray-800 mb-3 text-lg">
            Suggested Answer
          </p>
          <div className="  max-w-none max-h-60 overflow-y-auto pr-2">
            <ReactMarkdown>{feedback.actual_answer}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbackpg;
