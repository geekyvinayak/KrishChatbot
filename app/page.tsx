"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Send, Mic, Loader2 } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import TypingIndicator from "@/components/typing-indicator"
import FeatureCard from "@/components/feature-card"
import { useChat } from "@/hooks/use-chat"

export default function ChatInterface() {
  const {input,  setInput,
  messages,
  setMessages,
  isLoading, 
  setIsLoading,
  messagesEndRef,
  messagesContainerRef,
  inputRef,
  handleSubmit } = useChat()
  const [mounted, setMounted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
    console.log("messages",messages);
    
  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true)
  }, [])

  const hasMessages = messages.length > 0

  const handleCardClick = (message: string) => {
    setInput(message)
    // Use setTimeout to ensure the input is updated before submitting
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
      }
    }, 100)
  }

  const featureCards = [
    {
      icon: "Krish Technolabs",
      title: "Know more about us",
      description: "Get a overview of us as an orginasition",
      message: "Tell me something about Krish technolabs",
    },
    {
      icon: "Awards",
      title: "Awards won by Krish Technolabs",
      description: "How many and what are the awards won by krish",
      message: "How many and what are the awards won by krish?",
    },
    {
      icon: "Projects",
      title: "Projects by krish Technolabs",
      description: "An overview to Projects by krishtechnolabs.",
      message: "Take me through Projects done by krishtechnolabs",
    },
  ]

  return (
    <div className="flex items-center p-2 justify-center h-screen bg-white text-black chatbot-container ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl p-6 rounded-xl h-full justify-between flex flex-col shadow-lg"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-2"
          >
            <div className="w-12 h-12  bg-white rounded-full border border-black flex items-center justify-center mb-4">
            <svg className="logo-char char-animate " xmlns="http://www.w3.org/2000/svg" width="17.9"
    height="27.2"
    viewBox="0 0 17.9 27.2"
>
    <path id="Path_44568" data-name="Path 44568"
        d="M9.4,14.2c1.8-2.6,6-8.8,7.3-10.9.1-.2.2-.4.5-.4h3.5c.3-.1.3.1.3.3-1.6,2.3-6.2,8.9-8.2,11.6-.4.6-.4.8-.4,1a1.854,1.854,0,0,0,.4,1c2.1,2.9,7.7,11.2,8.6,12.8,0,.3-.1.4-.3.4H17.6c-.3,0-.6-.2-.6-.4-1.3-2.1-5.7-9.1-7.6-11.9-.3-.5-.6-.5-1.6-.5-.2,0-.2.1-.2.2V29.5c-.2.4-.3.5-.6.5H3.9a.43.43,0,0,1-.4-.4V3.2a.43.43,0,0,1,.4-.4H7a.43.43,0,0,1,.4.4v11c0,.2.2.2.4.2C8.9,14.5,9.3,14.4,9.4,14.2Z"
        transform="translate(-3.5 -2.8)"></path>
</svg>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-center"
          >
            How can I help you today?
          </motion.h1>

          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-600 text-center mt-2 max-w-md"
          >
            Ask me anything or select an option below.
          </motion.p>
        </div>

        <LayoutGroup>
          <AnimatePresence mode="wait">
            {mounted && !hasMessages ? (
              <motion.div
                key="feature-cards"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50, height: 0 }}
                transition={{
                  duration: 0.5,
                  staggerChildren: 0.1,
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              >
                {featureCards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <FeatureCard
                      icon={card.icon}
                      title={card.title}
                      description={card.description}
                      onClick={() => handleCardClick(card.message)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="message-history"
                initial={{ opacity: 0, height: 0, y: 50 }}
                animate={{ opacity: 1, height: "300px", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -50 }}
                transition={{
                  duration: 0.5,
                  height: { type: "spring", stiffness: 100, damping: 15 },
                }}
                className="bg-gray-50 rounded-lg flex-1 p-4 mb-4 h-full overflow-y-auto border-2 border-gray"
              >
                <AnimatePresence>
                  {messages.map((message,index) => (
                    <ChatMessage key={index} message={message} />
                  ))}
                </AnimatePresence>

                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

       

        <motion.form
          ref={formRef}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me something..."
              className="w-full px-4 py-3 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-full bg-black text-white disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}
