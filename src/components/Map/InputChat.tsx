"use client";

import React, { useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";

interface InputChatProps {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: (input: string) => Promise<void>;
  loading: boolean;
  audioActivated: boolean;
}

const InputChat = ({
  loading,
  input,
  setInput,
  sendMessage,
  audioActivated,
}: InputChatProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: any) => {
    const inputCleaned = input.trim();
    if (e.key === "Enter" && !e.shiftKey && inputCleaned.length > 0) {
      sendMessage(input);
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (textAreaRef.current) {
          textAreaRef.current.style.height = "24px";
          textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
      });

      resizeObserver.observe(textAreaRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="bg-white w-full h-10 flex gap-2 rounded-2xl border-2 border-gray-200 items-center p-1">
      <textarea
        disabled={loading}
        ref={textAreaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={handleKeyPress}
        rows={1}
        placeholder="Votre message..."
        className="text-sm text-black bg-white focus:ring-0 outline-none ring-0 focus-visible:ring-0 flex-1 resize-none text-left align-middle p-1 max-h-52 overflow-hidden"
        tabIndex={0}
      />
      {/* <MicrophoneButton sendMessage={sendMessage} /> */}
      <IoIosSend
        className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700 transition-all duration-300 mr-2"
        onClick={() => sendMessage(input)}
      />
    </div>
  );
};

export default InputChat;
