import { Link } from "@tanstack/react-router";
import { Bot, Loader, MessageCircle, Send, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../context/CartContext";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Hi there! Welcome to Swadistchai. I am your tea agent. I can help you find the perfect tea, track your order, or even add products directly to your cart! What can I do for you?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingOrderNumber, setAwaitingOrderNumber] = useState(false);
  const messagesEndRef = useRef(null);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    // Fetch products so the agent knows what we have
    fetch("https://tealeafluxe.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProducts(data.products);
      })
      .catch((err) => console.error(err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const processAgentLogic = async (text) => {
    const lowerText = text.toLowerCase();

    // TRACKING LOGIC
    if (awaitingOrderNumber) {
      setAwaitingOrderNumber(false);
      try {
        const response = await fetch(
          "https://tealeafluxe.onrender.com/api/orders/track",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderNumber: text.trim() }),
          },
        );
        const data = await response.json();

        if (data.success) {
          return `Order ${data.order.orderNumber} is currently **${data.order.status}**.\n\nItems: ${data.order.items}\nTotal: ₹${data.order.total.toLocaleString("en-IN")}`;
        } else {
          return "I couldn't find an order with that number. Please check and try asking to 'track order' again.";
        }
      } catch (error) {
        return "Sorry, I'm having trouble connecting to the tracking system right now.";
      }
    }

    if (lowerText.includes("track") || lowerText.includes("order status")) {
      setAwaitingOrderNumber(true);
      return "Sure! Please enter your Order Number (e.g., ORD-2024...).";
    }

    // ADD TO CART LOGIC
    const isAddIntent =
      lowerText.includes("add") &&
      (lowerText.includes("cart") ||
        lowerText.includes("buy") ||
        lowerText.includes("basket"));
    if (isAddIntent) {
      let bestMatch = null;
      let maxMatchLen = 0;

      for (const p of products) {
        const pNameLower = p.name.toLowerCase();
        if (lowerText.includes(pNameLower)) {
          if (pNameLower.length > maxMatchLen) {
            maxMatchLen = pNameLower.length;
            bestMatch = p;
          }
        }
      }

      if (!bestMatch) {
        let maxScore = 0;
        for (const p of products) {
          let score = 0;
          const words = p.name.toLowerCase().split(" ");
          for (const w of words) {
            if (w.length > 2 && lowerText.includes(w)) {
              score++;
            }
          }
          if (score > maxScore) {
            maxScore = score;
            bestMatch = p;
          }
        }
      }

      if (bestMatch) {
        addToCart(bestMatch, 1);
        return `Done! I've added **${bestMatch.name}** to your cart. 🛒 Would you like me to find anything else for you?`;
      } else {
        return "I'd love to add that to your cart, but I couldn't clearly figure out which tea you meant. Could you provide the exact product name?";
      }
    }

    // SUGGESTION LOGIC
    if (
      lowerText.includes("suggest") ||
      lowerText.includes("recommend") ||
      lowerText.includes("want") ||
      lowerText.includes("need") ||
      lowerText.includes("looking for") ||
      lowerText.includes("best") ||
      lowerText.includes("preference")
    ) {
      let scoredProducts = products
        .map((p) => {
          let score = 0;
          const pDesc = (p.description || "").toLowerCase();
          const pCat = (p.category || "").toLowerCase();
          const pName = (p.name || "").toLowerCase();

          if (
            (lowerText.includes("sleep") ||
              lowerText.includes("relax") ||
              lowerText.includes("calm")) &&
            (pName.includes("chamomile") ||
              pName.includes("lavender") ||
              pCat.includes("herbal"))
          )
            score += 5;
          if (
            (lowerText.includes("energy") ||
              lowerText.includes("morning") ||
              lowerText.includes("wake")) &&
            (pName.includes("matcha") ||
              pName.includes("assam") ||
              pCat.includes("black"))
          )
            score += 5;
          if (
            (lowerText.includes("health") ||
              lowerText.includes("weight") ||
              lowerText.includes("detox")) &&
            (pName.includes("green") ||
              pName.includes("jade") ||
              pCat.includes("green"))
          )
            score += 5;

          const words = lowerText.replace(/[^\\w\\s]/gi, "").split(" ");
          words.forEach((w) => {
            if (
              w.length > 3 &&
              (pDesc.includes(w) || pCat.includes(w) || pName.includes(w))
            ) {
              score++;
            }
          });
          return { ...p, score };
        })
        .filter((p) => p.score > 0)
        .sort((a, b) => b.score - a.score);

      if (scoredProducts.length > 0) {
        const top = scoredProducts[0];
        return `Based on what you're looking for, I highly recommend our **${top.name}**. It's exactly what you need! You can simply tell me to *"add ${top.name} to cart"*.`;
      } else {
        if (products.length > 0) {
          const random = products[Math.floor(Math.random() * products.length)];
          return `I can definitely help with that! A great choice would be our **${random.name}**. Would you like me to add it to your cart?`;
        }
        return "I can suggest some great teas! Are you looking for something for energy, relaxation, health, or maybe just a classic black tea?";
      }
    }

    if (
      lowerText.includes("hello") ||
      lowerText.includes("hi") ||
      lowerText.includes("hey")
    ) {
      return "Hello! I am your Swadistchai smart agent. I can help you find teas based on your preferences, and I can even add them to your cart! What are you looking for today?";
    }

    return "I am your personal tea agent! I can help you track an order, suggest teas based on your specific needs, or add products directly to your cart. Try saying 'suggest tea for sleep' or 'add matcha to cart'.";
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const lowercaseInput = userMessage.text.toLowerCase();

    // Process user input
    setTimeout(async () => {
      const responseText = await processAgentLogic(userMessage.text);
      let botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        text: responseText,
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-colors ${
          isOpen
            ? "bg-amber-600 scale-0 opacity-0 pointer-events-none"
            : "bg-amber-600 hover:bg-amber-700 text-white"
        }`}
      >
        <MessageCircle size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden border border-gray-200 flex flex-col"
            style={{ height: "500px", maxHeight: "80vh" }}
          >
            {/* Header */}
            <div className="bg-amber-600 p-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Bot size={24} />
                <div>
                  <h3 className="font-bold text-sm">Swadistchai Assistant</h3>
                  <p className="text-amber-100 text-xs">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-amber-700 p-1 rounded transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} gap-2`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={16} className="text-amber-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      msg.sender === "user"
                        ? "bg-amber-600 text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none shadow-sm whitespace-pre-wrap"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={16} className="text-amber-600" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0,
                      }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0.2,
                      }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 0.6,
                        delay: 0.4,
                      }}
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              onSubmit={handleSend}
              className="p-3 bg-white border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-gray-100 border-transparent focus:bg-white border focus:border-amber-500 rounded-full text-sm outline-none transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={16} className="ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
