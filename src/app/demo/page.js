"use client";

import { useState } from "react";
import axios from "axios";
import {
  FormControl,
  MenuItem,
  Select,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import HistoryCard from "@/components/historyCard";

export default function Page() {
  const [useJD, setUseJD] = useState(false);
  const [jd, setJd] = useState("");
  const [role, setRole] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  const getQuestion = async () => {
    try {
      let payload = {};
      if (useJD) {
        payload = { jd };
      } else {
        payload = { role, topic, difficulty };
      }

      // Example API call
      const res = await axios.post("/api/question", payload);
      setQuestion(res.data.question);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch question");
    }
  };

  const startRecording = () => setIsRecording(true);
  const stopRecording = () => setIsRecording(false);
  const submitAnswer = () => {};

  return (
    <div className="h-screen w-full bg-gray-100 flex gap-4 p-6">
      {/* AI Interview Section */}
      <div className="flex-1 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          AI Interview Coach
        </h1>

        {/* Toggle */}
        <div className="mb-4">
          <FormControlLabel
            control={
              <Switch
                checked={useJD}
                onChange={(e) => setUseJD(e.target.checked)}
              />
            }
            label="Use Job Description instead of Role/Topic/Difficulty"
          />
        </div>

        {/* Input Controls */}
        {!useJD ? (
          <div className="mb-4 flex gap-3 flex-wrap">
            <TextField
              label="Role"
              variant="outlined"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <TextField
              label="Topic"
              variant="outlined"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />

            <FormControl sx={{ minWidth: 120 }}>
              <Select
                value={difficulty}
                displayEmpty
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
        ) : (
          <div className="mb-4">
            <TextField
              label="Paste Job Description"
              multiline
              rows={6}
              fullWidth
              variant="outlined"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              placeholder="Paste the full JD here..."
            />
          </div>
        )}

        {/* Get Question Button */}
        <button
          onClick={getQuestion}
          className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Get Question
        </button>

        {/* Question */}
        {question && (
          <div className="mt-6">
            <h2 className="font-semibold">Question:</h2>
            <p className="bg-gray-100 p-3 rounded-lg">{question}</p>
          </div>
        )}

        {/* Answer Area */}
        {question && (
          <div className="mt-4">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Type or record your answer..."
            ></textarea>
            <div className="flex gap-2 mt-3">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-1/2 bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition"
                >
                  🎤 Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-1/2 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
                >
                  ⏹ Stop Recording
                </button>
              )}

              <button
                onClick={submitAnswer}
                className="w-1/2 bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition"
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* History Section */}
      <div className="w-1/3 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto">
        <h1 className="text-xl font-bold text-gray-800 mb-4">History</h1>
        <HistoryCard history={history} />
      </div>
    </div>
  );
}
