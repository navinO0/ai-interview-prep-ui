"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import HistoryCard from "@/components/historyCard";
import ErroToaster from "@/utils/errorToaster";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import clearToken from "@/utils/removeToken";
import { getDeviceInfo } from "@/utils/getDeviceInfo";
import registerUser from "@/utils/registerUser";
import { useSession } from "next-auth/react";
import useProtectedRoute from "@/utils/protectedRoute";
import Artyom from "artyom.js";
import removeMd from "remove-markdown";
import CodePlayground from "./testpage/page";
import Feedbackpg from "@/utils/feedbackpg";
import InterviewForm from "@/utils/interviewForm";
import AiLoader from "@/utils/aiLoader";


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
  const [questionType, setQuestionType] = useState("General");

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
    return () => {
      stopSpeaking()
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
    if (!artyomRef.current && questionType.toLowerCase() === "coding") return;
    setIsSpeaking(true);
    artyomRef.current.say(removeMd(text), {
      onEnd: () => setIsSpeaking(false),
    });
  };
  const stopSpeaking = () => {
    if (!artyomRef.current) return;

    artyomRef.current.fatality();

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
  };


  const getQuestion = async () => {
    try {
      setLoadingQuestion(true);
      setError(null)
      stopSpeaking()
      // window.speechSynthesis.cancel();
      const res = await axios.post(`${apiUrl}/question`, {
        role, difficulty, topic, jobDescription: jd, company, have_jd: useJD, question_type: questionType
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

        if (questionType.toLowerCase() !== "coding") {
          speakQuestion(removeMd(res.data.data.question))
        }

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
      stopSpeaking();
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

  const onClickNexQns = () => {
    setFeedback(null);
    getQuestion();
  }


  return (
    <div className="flex flex-col  overflow-y-auto h-[92vh] ">
      <div className=" h-full h-auto w-full bg-gray-100 flex flex-col lg:flex-row gap-4 p-4 md:p-6 overflow-y-auto ">
        <div className="flex-1 bg-white shadow-lg rounded-2xl p-6 overflow-y-auto min-h-[80vh]">
          <h1 className="text-2xl font-bold text-center mb-6">
            AI Interview Coach
          </h1>

          {!feedback ? (<InterviewForm
            useJD={useJD}
            setUseJD={setUseJD}
            role={role}
            setRole={setRole}
            topic={topic}
            setTopic={setTopic}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            questionType={questionType}
            setQuestionType={setQuestionType}
            company={company}
            setCompany={setCompony}
            jd={jd}
            setJd={setJd}
            answer={answer}
            setAnswer={setAnswer}
            question={question}
            loadingQuestion={loadingQuestion}
            getQuestion={getQuestion}
            isSpeaking={isSpeaking}
            stopSpeaking={stopSpeaking}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
            submitAnswer={submitAnswer}
            loadingSubmit={loadingSubmit}
          />) :

            (
              <>
                <Feedbackpg feedback={feedback} question_type={questionType}/>
                <div className="flex gap-4 flex-end mt-4">
                  <button
                    onClick={onClickNexQns}
                    className={`flex-1 rounded-lg px-4 py-2 !transition button !text-white cursor-pointer ${loadingQuestion
                        ? "!bg-blue-400 !cursor-not-allowed"
                        : "!bg-blue-600 !hover:bg-blue-700"
                      }`}
                  >
                    Next Question
                  </button>
                </div>
              </>
            )}
        </div>


        <div className="w-full  lg:w-1/3 bg-white shadow-lg rounded-2xl overflow-y-auto w-[100%] min-h-[80vh]">

          {loadingHistory ? (
            <div className="flex items-center justify-center  py-10 h-[80vh]">
              {/* <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div> */}
              <AiLoader />
            </div>
          ) : (
            questionType.toLowerCase() !== "coding" ? <div> <h1 className="text-xl font-bold text-gray-800 mb-4 text-center m-3">History</h1>
              <HistoryCard history={history} />
            </div> :
              <CodePlayground code={answer} setCode={setAnswer} />
          )}
        </div>
      </div>
      <ErroToaster message={error} />
    </div>
  );
}

export default App;
