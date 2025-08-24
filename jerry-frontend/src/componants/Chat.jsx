import React, { useState } from "react";
import axios from "axios";
import { FaRobot, FaUser } from "react-icons/fa";

const Chat = () => {
     const [messages, setMessages] = useState([]); // stores [{prompt, output}]
     const [input, setInput] = useState("");
     const [loading, setLoading] = useState(false);

     const sendMessage = async () => {
          if (!input.trim()) return;

          const newMessage = { prompt: input, output: null };
          setMessages([...messages, newMessage]);
          setInput("");
          setLoading(true);

          try {
               const res = await axios.post("http://localhost:5000/ai/ask", {
                    prompt: input,
               });

               setMessages((prev) =>
                    prev.map((msg, i) =>
                         i === prev.length - 1 ? { ...msg, output: res.data.output } : msg
                    )
               );
          } catch (err) {
               console.error("Error fetching AI response:", err);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-r from-black via-blue-900 to-black animate-gradient-x">
               <h1 className="text-5xl font-extrabold mb-6 text-cyan-400 drop-shadow-glow">
                    ⚡ Cyberpunk AI Chat
               </h1>

               {/* Chat window */}
               <div className="w-full max-w-2xl bg-black bg-opacity-70 p-6 rounded-2xl shadow-2xl border border-cyan-700 overflow-y-auto h-[70vh] backdrop-blur-md">
                    {messages.map((msg, index) => (
                         <div key={index} className="mb-6">
                              {/* User bubble */}
                              <div className="flex items-center gap-2 text-blue-300">
                                   <FaUser /> <span className="font-semibold">You:</span>
                              </div>
                              <div className="ml-6 bg-gradient-to-r from-blue-800 to-cyan-700 text-white p-3 rounded-xl shadow-md max-w-lg">
                                   {msg.prompt}
                              </div>

                              {/* AI bubble */}
                              {msg.output && (
                                   <>
                                        <div className="mt-3 flex items-center gap-2 text-cyan-400">
                                             <FaRobot /> <span className="font-semibold">AI:</span>
                                        </div>
                                        <div className="ml-6 bg-gradient-to-r from-black to-blue-900 text-green-300 p-3 rounded-xl shadow-md border border-cyan-600 max-w-lg">
                                             {msg.output}
                                        </div>
                                   </>
                              )}
                         </div>
                    ))}

                    {loading && (
                         <p className="text-yellow-400 animate-pulse">⚡ AI is thinking...</p>
                    )}
               </div>

               {/* Input section */}
               <div className="flex w-full max-w-2xl mt-4">
                    <input
                         className="flex-1 p-3 rounded-l-xl bg-black text-green-300 border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400"
                         placeholder="Type your message..."
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                         onClick={sendMessage}
                         className="px-6 py-3 bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-blue-900 hover:to-cyan-600 rounded-r-xl text-white font-bold transition transform hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                         Send
                    </button>
               </div>
          </div>
     );
};

export default Chat;
