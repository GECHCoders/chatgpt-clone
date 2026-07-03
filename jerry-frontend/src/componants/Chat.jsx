import React, { useState } from "react";
import axios from "axios";
import { FaRobot, FaUser, FaImage, FaPaperPlane } from "react-icons/fa";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const newMessage = {
      prompt: input,
      image: selectedImage, // full file object
      output: null,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/ai/ask", {
        prompt: input,
      });

      setMessages((prev) =>
        prev.map((msg, i) =>
          i === prev.length - 1
            ? { ...msg, output: res.data.output }
            : msg
        )
      );
    } catch (err) {
      console.error("AI Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      
      {/* Header */}
      <div className="p-5 border-b border-cyan-700 bg-gradient-to-r from-black via-blue-900 to-black">
        <h1 className="text-4xl font-bold text-cyan-400 text-center">
          ⚡ Cyberpunk AI Assistant
        </h1>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {messages.map((msg, index) => (
          <div key={index} className="mb-8">

            {/* User */}
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <FaUser />
              <span>You</span>
            </div>

            <div className="ml-6 bg-blue-900 p-4 rounded-2xl max-w-xl shadow-lg">
              {msg.image && (
                <img
                  src={URL.createObjectURL(msg.image)}
                  alt="upload"
                  className="w-40 rounded-xl mb-3 border border-cyan-500"
                />
              )}
              {msg.prompt && <p>{msg.prompt}</p>}
            </div>

            {/* AI */}
            {msg.output && (
              <>
                <div className="flex items-center gap-2 text-cyan-400 mt-4 mb-2">
                  <FaRobot />
                  <span>AI</span>
                </div>

                <div className="ml-6 bg-gray-900 border border-cyan-700 p-4 rounded-2xl max-w-xl shadow-lg">
                  {msg.output}
                </div>
              </>
            )}
          </div>
        ))}

        {loading && (
          <p className="text-yellow-400 animate-pulse ml-6">
            ⚡ AI is analyzing...
          </p>
        )}
      </div>

      {/* Selected Preview */}
      {selectedImage && (
        <div className="max-w-4xl mx-auto w-full px-6 mb-3">
          <div className="flex items-center gap-3 bg-gray-900 border border-cyan-700 p-3 rounded-xl">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="preview"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <p className="text-cyan-300">Ready to send</p>
              <p className="text-green-400 text-sm">{selectedImage.name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-4 border-t border-cyan-700 bg-black sticky bottom-0">
        <div className="max-w-4xl mx-auto flex gap-3">

          <label className="px-5 py-3 bg-purple-700 rounded-xl cursor-pointer hover:bg-purple-600 transition">
            <FaImage />
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files[0])}
            />
          </label>

          <input
            className="flex-1 p-3 rounded-xl bg-gray-900 border border-cyan-600 text-green-300 focus:outline-none"
            placeholder="Ask anything or upload image..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-cyan-700 rounded-xl hover:bg-cyan-600 transition"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;