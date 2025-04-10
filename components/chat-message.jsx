"use client"

import { motion } from "framer-motion"
import DOMPurify from "dompurify";
export default function ChatMessage({ message }) {
  const isUser = message.isUser
  const createMarkup = (htmlContent) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={`flex ${isUser ? "justify-end user-message" : "justify-start bot-message"} mb-4`}
    >
      <motion.div
        initial={{ x: isUser ? 20 : -20 }}
        animate={{ x: 0 }}
        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
          isUser ? "bg-black text-white rounded-tr-none" : "bg-gray-200 text-black rounded-tl-none"
        }`}
      >
      { isUser ? message.content :  <div
                    dangerouslySetInnerHTML={createMarkup(message.content)}
                  ></div>}
      </motion.div>
    </motion.div>
  )
}
