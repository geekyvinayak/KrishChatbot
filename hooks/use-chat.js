"use client"

import { useState, useCallback, useRef, useEffect } from "react"


export function useChat() {
    // Function to process the API response and enhance links
    const processResponse = (responseHtml) => {
      // Remove any raw HTML backticks and tags
      let cleanedHtml = responseHtml;
  
      // Remove ```html and ``` tags that might be in the response
      cleanedHtml = cleanedHtml.replace(/```html/g, "");
      cleanedHtml = cleanedHtml.replace(/```/g, "");
  
      // Also remove any <userStyle> tags or other unwanted tags
      cleanedHtml = cleanedHtml.replace(/<userStyle>.*?<\/userStyle>/g, "");
  
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleanedHtml, "text/html");
  
      // Find all links and enhance them
      const links = doc.querySelectorAll("a");
      links.forEach((link) => {
        // Make sure all links have target="_blank" and rel attributes
        if (!link.getAttribute("target")) {
          link.setAttribute("target", "_blank");
        }
        if (!link.getAttribute("rel")) {
          link.setAttribute("rel", "noopener noreferrer");
        }
      });
  
      // Return the processed HTML
      return doc.body.innerHTML;
    };

  const [messages, setMessages] = useState([
    // {
    //   id: "welcome",
    //   content: "Hello! How can I assist you today?",
    //   isUser: false,
    //   timestamp: new Date(),
    // },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const response = await fetch("https://krish-chatbot-api-abrt.vercel.app/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input.trim() }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: processResponse(data.response), // Use parsed content
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), content: "Sorry, I couldn't process your request.", isUser: false, error: true, timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  return {
    input,
    setInput,
    messages,
    setMessages,
    isLoading, 
    setIsLoading,
    messagesEndRef,
    messagesContainerRef,
    inputRef,
    handleSubmit
  }
}
