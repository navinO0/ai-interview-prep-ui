import React from "react";
import ReactMarkdown from "react-markdown";
import {
    TextField,
    FormControl,
    MenuItem,
    Select,
    Switch,
    FormControlLabel,
} from "@mui/material";

const InterviewForm = ({
    useJD,
    setUseJD,
    role,
    setRole,
    topic,
    setTopic,
    difficulty,
    setDifficulty,
    questionType,
    setQuestionType,
    company,
    setCompany,
    jd,
    setJd,
    answer,
    setAnswer,
    question,
    loadingQuestion,
    getQuestion,
    isSpeaking,
    stopSpeaking,
    isRecording,
    startRecording,
    stopRecording,
    submitAnswer,
    loadingSubmit,
}) => {
    return (
        <div>
            <div className="mb-4">
                <FormControlLabel
                    control={
                        <Switch
                            checked={useJD}
                            onChange={(e) => setUseJD(e.target.checked)}
                        />
                    }
                    label="Have job Description ?"
                />
            </div>

            {!useJD ? (
                <div className="mb-4 flex gap-3 flex-wrap">
                    <TextField
                        label="Enter Job Role"
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
                                <em>Select Difficulty</em>
                            </MenuItem>
                            <MenuItem value="easy">Easy</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="hard">Hard</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 160 }}>
                        <Select
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                        >
                            <MenuItem value="General">
                                <em>Select question Type</em>
                            </MenuItem>
                            <MenuItem value="coding">Coding</MenuItem>
                            <MenuItem value="situational">Situational</MenuItem>
                            <MenuItem value="theory">General</MenuItem>
                            <MenuItem value="technical">Technical</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            ) : (
                <div className="mb-4 flex gap-3 flex-wrap">
                    <TextField
                        label="Company"
                        variant="outlined"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                    />
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

            <div className="flex gap-2">
                <button
                    onClick={getQuestion}
                    disabled={loadingQuestion}
                    className={`flex-1 rounded-lg button px-4 py-2 transition !text-white ${loadingQuestion
                            ? "!bg-blue-400 !cursor-not-allowed"
                            : "!bg-blue-600 !hover:bg-blue-700"
                        }`}
                >
                    {loadingQuestion ? "Loading..." : "Get Question"}
                </button>

                {isSpeaking && (
                    <button
                        onClick={stopSpeaking}
                        className="!bg-red-600 !text-white button rounded-lg px-4 py-2 !hover:bg-red-700 transition"
                    >
                        Stop Speech
                    </button>
                )}
            </div>

            {/* Question */}
            {question && (
                <div className="mt-6">
                    <h2 className="font-semibold">Question:</h2>
                    <div className="bg-gray-100 overflow-x-auto p-3 rounded-lg">
                        <ReactMarkdown>{question || "Loading..."}</ReactMarkdown>
                    </div>
                </div>
            )}

            {question && (
                <div className="mt-4">
                    {questionType.toLowerCase() !== "coding" && (
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                            placeholder="Type or record your answer..."
                        ></textarea>
                    )}

                    <div className="flex gap-2 mt-3">
                        {questionType.toLowerCase() !== "coding" && (
                            !isRecording ? (
                                <button
                                    onClick={startRecording}
                                    disabled={loadingSubmit}
                                    className={`w-1/2 rounded-lg px-4 py-2 button !text-white transition ${loadingSubmit
                                            ? "!bg-purple-400 !cursor-not-allowed"
                                            : "!bg-purple-600 !hover:bg-purple-700"
                                        }`}
                                >
                                    Start Recording
                                </button>
                            ) : (
                                <button
                                    onClick={stopRecording}
                                    className="w-1/2 !bg-red-600 !text-white rounded-lg button px-4 py-2 hover:bg-red-700 transition"
                                >
                                    Stop Recording
                                </button>
                            )
                        )}

                        <button
                            onClick={submitAnswer}
                            disabled={loadingSubmit}
                            className={`w-1/2 rounded-lg px-4 button py-2 !text-white transition ${loadingSubmit
                                    ? "!bg-green-400 !cursor-not-allowed"
                                    : "!bg-green-600 !hover:bg-green-700"
                                }`}
                        >
                            {loadingSubmit ? "Submitting..." : "Submit Answer"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InterviewForm;
