"use client";

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function CodePlayground() {
    const [code, setCode] = useState("// Write your code here");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [language, setLanguage] = useState("python");
    const [version, setVersion] = useState("3.10.0");

    // Fetch supported languages
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const res = await axios.get("https://emkc.org/api/v2/piston/runtimes");
                setLanguages(res.data);

                // Default to python if available
                const python = res.data.find((lang) => lang.language === "python");
                if (python) {
                    setLanguage(python.language);
                    setVersion(python.version);
                    setCode("print('Hello, World!')");
                }
            } catch (err) {
                console.error("Failed to fetch languages:", err);
            }
        };

        fetchLanguages();
    }, []);

    // Run code
    const runCode = async () => {
        setLoading(true);
        setOutput("");

        try {
            const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language,
                version,
                files: [{ name: `main.${language}`, content: code }],
            });

            setOutput(res.data.run.output || "No output");
        } catch (err) {
            console.error(err);
            setOutput("Error executing code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <div className="p-2 flex gap-2 items-center text-white">
                <label>Select Language: </label>
                <select
                    className="text-white bg-gray-700 p-1 rounded"
                    value={language}
                    onChange={(e) => {
                        const selected = languages.find(
                            (lang) => lang.language === e.target.value
                        );
                        setLanguage(selected.language);
                        setVersion(selected.version);


                        if (selected.language === "python") setCode("print('Hello, World!')");
                        if (selected.language === "javascript")
                            setCode("console.log('Hello, World!')");
                        if (selected.language === "cpp")
                            setCode(`#include <iostream>\nusing namespace std;\nint main(){ cout << "Hello, World!"; return 0; }`);
                        if (selected.language === "java")
                            setCode(`class Main { public static void main(String[] args){ System.out.println("Hello, World!"); } }`);
                    }}
                >
                    {languages.map((lang) => (
                        <option key={lang.language + lang.version} value={lang.language}>
                            {lang.language} ({lang.version})
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-1">
                <Editor
                    height="70vh"
                    language={language}
                    value={code}
                    theme="vs-dark"
                    onChange={(val) => setCode(val || "")}
                />
            </div>

            <div className="flex flex-row">
                <button
                    onClick={runCode}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 p-2 m-2 rounded"
                >
                    {loading ? "Running..." : "Run Code"}
                </button>
                <button
                    onClick={runCode}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-600 p-2 m-2 rounded"
                >
                    {loading ? "Running..." : "Run Code"}
                </button>
            </div>
            <div className="bg-black p-4 m-2 rounded h-40 overflow-y-auto">
                <pre>{output}</pre>
            </div>
        </div>
    );
}
