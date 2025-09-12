"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import { FormControl, FormControlLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import HistoryCard from "@/components/historyCard";
import ReactMarkdown from "react-markdown";
import ErroToaster from "@/utils/errorToaster";
import Header from "@/utils/header";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import clearToken from "@/utils/removeToken";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import registerUser from "@/utils/registerUser";
import { useSession } from "next-auth/react";
import useProtectedRoute from "@/utils/protectedRoute";
import ReactCodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import Artyom from "artyom.js";
import removeMd from "remove-markdown";
// import { cookies } from "next/headers";


function App() {
  const [role, setRole] = useState("node.js backend developer");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [qunsId, setQnsId] = useState(0);
  const [topic, setTopic] = useState("");
  const [history, setHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [useJD, setUseJD] = useState(false);
  const [jd, setJd] = useState("");
  const [company, setCompony] = useState("");
  const { data: session } = useSession();

  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [error, setError] = useState(null)
  const [deviceInfo, setDeviceInfo] = useState(null);

  const recognitionRef = useRef(null);
  const apiUrl = process.env.NEXT_PUBLIC_AI_INTERVIEW_HOST;
  const router = useRouter();
  const artyomRef = useRef(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      artyomRef.current = new Artyom();
    }
  }, []);
  useProtectedRoute()
  useMemo(() => {
    const init = async () => {

      if (!session?.user?.token || session?.user?.token === "undefined") return;
      const Dinfo = await getDeviceInfo();
      setDeviceInfo(Dinfo);

      await registerUser(session.user, ['username', 'email', 'first_name'], Dinfo);


      // const token = Cookies.get("jwt_token");
      // if (token) {
      //   setUserData(parseToken(token));
      // }

      // const redirect = Cookies.get("redirect");
      // if (redirect) {
      //   Cookies.remove("redirect");
      //   router.push(redirect);
      // }
    };

    init();
  }, []);
  useEffect(() => {
    getHistory();
    return () => {
      // window.speechSynthesis.cancel();
      setError(null)
    };
  }, []);

   const speakQuestion = (text) => {
          if (!artyomRef.current) return;
          setIsSpeaking(true);
          artyomRef.current.say(removeMd(text), {
            onEnd: () => setIsSpeaking(false),
          });
  };
  
   const stopSpeaking = () => {
          if (!artyomRef.current) return;
          artyomRef.current.fatality(); // stops speaking immediately
          setIsSpeaking(false);
        };

  const getQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setError(null)
      // window.speechSynthesis.cancel();
      const res = await axios.post(`${apiUrl}/question`, {
        role, difficulty, topic, jobDescription: jd, company, have_jd: useJD
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`
        }
      });
      setQuestion(res.data.data.question);
      setQnsId(res.data.data.qns_id);
      setFeedback("");
      setAnswer("");

      if (process.env.NEXT_PUBLIC_AI_READ_QNS === "true" || false) {
        // artyom.say(removeMd(res.data.data.question));

       
        speakQuestion(removeMd(res.data.data.question))
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch question");
      if (err.response && err.response.status === 401 || err.response.status === 401) {
        Cookies.remove('jwt_token');
        router.push("/session-expired");
        clearToken()
      }
    } finally {
      setLoadingQuestion(false);
    }
  };

  // const stopSpeaking = () => {
  //   window.speechSynthesis.cancel();
  //   setIsSpeaking(false);
  // };

  const submitAnswer = async () => {
    try {
      setLoadingSubmit(true);
      setError(null)
      // stopSpeaking();
      const res = await axios.post(`${apiUrl}/feedback`, {
        role,
        answer,
        question,
        qns_id: qunsId,
      }, {
        headers: {
          Authorization: `Bearer ${Cookies.get("jwt_token")}`
        }
      });
      setFeedback(res.data.data.feedback);
    } catch (err) {
      console.error(err);
      setError("Failed to get feedback");
      if (err.response && err.response.status === 401 || err.response.status === 401) {
        Cookies.remove('jwt_token');
        router.push("/session-expired");
        clearToken()
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

const startRecording = () => {
  if (!artyomRef.current) return;

  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    setError("Speech recognition not supported in this browser. Try Chrome.");
    return;
  }

  artyomRef.current.fatality(); // stop previous sessions
  artyomRef.current.initialize({
    lang: "en-GB",
    continuous: false,
    listen: true,
    debug: true,
    speed: 1,
  });

  artyomRef.current.say("Start speaking now!");

  artyomRef.current.addCommands({
    indexes: ["*"], // catch everything
    smart: true,
    action: (i, spokenText) => {
      setAnswer(spokenText);
      // stopRecording(); // auto stop after speaking
    },
  });

  setIsRecording(true);
};

const stopRecording = () => {
  if (!artyomRef.current) return;
  artyomRef.current.fatality(); // stops listening
  setIsRecording(false);
};


  const getHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);

      setTimeout(async () => {
        try {
          const res = await axios.post(`${apiUrl}/history`, {}, {
            headers: {
              Authorization: `Bearer ${Cookies.get('jwt_token')}`
            }
          });

          if (res?.data?.data?.history) {
            const historyData = res.data.data.history.map((item) => ({
              id: item.question_id,
              label: item.question,
              children: [
                { id: `${item.id}-answer`, label: `Answer : ${item.answer}` },
                { id: `${item.id}-actual-answer`, label: `Actual Answer : ${item.actual_answer}` },
              ],
            }));
            setHistory(historyData);
          }
        } catch (err) {
          console.error(err);
          setError("Failed to get history");

          if (err.response && err.response.status === 401) {
            Cookies.remove("jwt_token");
            clearToken();
            router.push("/session-expired");
          }
        } finally {
          setLoadingHistory(false);
        }
      }, 3000);

    } catch (err) {
      console.error("Unexpected error in getHistory wrapper:", err);
      setError("Unexpected error occurred");
      setLoadingHistory(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen overflow-auto">
      <div className=" min-h-screen h-auto w-full bg-gray-100 flex flex-col lg:flex-row gap-4 p-4 md:p-6 h-screen">
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto min-h-screen">
          <h1 className="text-2xl font-bold text-center mb-6">
            AI Interview Coach
          </h1>

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
            <div className="mb-4 flex gap-3 flex-wrap">
              <TextField
                label="company"
                variant="outlined"
                value={company}
                onChange={(e) => setCompony(e.target.value)}
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
              className={`flex-1 rounded-lg px-4 py-2 transition text-white ${loadingQuestion
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {loadingQuestion ? "Loading..." : "Get Question"}
            </button>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
              >
                Stop Speech
              </button>
            )}
          </div>

          {question && (
            <div className="mt-6">
              <h2 className="font-semibold">Question:</h2>
              <div className="bg-gray-100 p-3 rounded-lg">
                <ReactMarkdown >
                  {question || "Loading..."}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {question && (
            <div className="mt-4">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Type or record your answer..."
              ></textarea>
              {/* <ReactCodeMirror
        value={answer}
        height="200px"
        extensions={[javascript()]}
        theme="dark"
        onChange={(value) => setCode(value)}
      /> */}
              <div className="flex gap-2 mt-3">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={loadingSubmit}
                    className={`w-1/2 rounded-lg px-4 py-2 text-white transition ${loadingSubmit
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                      }`}
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="w-1/2 bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 transition"
                  >
                    Stop Recording
                  </button>
                )}

                <button
                  onClick={submitAnswer}
                  disabled={loadingSubmit}
                  className={`w-1/2 rounded-lg px-4 py-2 text-white transition ${loadingSubmit
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {loadingSubmit ? "Submitting..." : "Submit Answer"}
                </button>
              </div>
            </div>
          )}



          {feedback && (
            <div className="mt-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                Feedback Summary
              </h2>
              <div className="bg-gray-100 p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
                <p className="text-lg">
                  <span className="font-semibold text-indigo-700">Score:</span>{" "}
                  <span className="font-bold">{feedback.score} / 10</span>
                </p>
              </div>

              {/* Strengths */}
              {feedback.strengths && (
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                  <p className="font-semibold text-green-700 mb-2">Strengths:</p>
                  <ul className="list-disc pl-6 text-green-800 space-y-1">
                    {feedback.strengths}
                  </ul>
                </div>
              )}

              {feedback.improvements && (
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border-l-4 border-red-500">
                  <p className="font-semibold text-red-700 mb-2">Improvements:</p>
                  <ul className="list-disc pl-6 text-red-800 space-y-1">
                    {feedback.improvements}
                  </ul>
                </div>
              )}

              {feedback.missed_points && (
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border-l-4 border-yellow-500">
                  <p className="font-semibold text-yellow-700 mb-2">
                    Missed Points:
                  </p>
                  <ul className="list-disc pl-6 text-yellow-800 space-y-1">
                    {feedback.missed_points}
                  </ul>
                </div>
              )}

              {feedback.sarcastic_feedback && (
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <p className="font-semibold text-blue-700 mb-2">
                    Extra Feedback:
                  </p>
                  <p className="text-blue-800">{feedback.sarcastic_feedback}</p>
                </div>
              )}

              {feedback.final_feedback && (
                <div className="bg-purple-50 p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
                  <p className="font-semibold text-purple-700 mb-2">
                    Final Feedback:
                  </p>
                  <p className="text-purple-800">{feedback.final_feedback}</p>
                </div>
              )}
              {feedback.actual_answer && (
                <div className="bg-gray-50 p-4 rounded-xl shadow-sm border-l-4 border-gray-400">
                  <p className="font-semibold mb-2">
                    Suggested Answer:
                  </p>
                  <div className="prose prose-sm md:prose-base max-w-none  max-h-60 overflow-y-auto pr-2">
                    <ReactMarkdown>{feedback.actual_answer}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>


        <div className="w-full h-screen lg:w-1/3 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-4">History</h1>
          {loadingHistory ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <HistoryCard history={history} />
          )}
        </div>
      </div>
      <ErroToaster message={error} />
    </div>
  );
}

export default App;
