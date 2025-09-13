import { useState } from "react";
import ReactMarkdown from "react-markdown";

function TruncatedMarkdown({ text }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`${
          expanded ? "" : "line-clamp-3"
        } text-sm sm:text-base overflow-hidden`}
      >
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>

      {/* Read more / Show less */}
      {text.length > 100 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="hover:underline text-sm mt-1"
        >
          {expanded ? "Show less" : "..."}
        </button>
      )}
    </div>
  );
}


export default TruncatedMarkdown