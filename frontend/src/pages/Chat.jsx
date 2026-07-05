// Chat.jsx
// Ask the AI questions about your expenses.
// Backend endpoint: POST /chat
// Expects: { message: "your question" }
// Returns: { reply: "AI answer" }

import { useState } from "react";
import client from "@/api/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Chat() {
  // messages — the conversation history
  // Each message has a role ("user" or "ai") and text
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! Ask me anything about your expenses." },
  ]);

  // what the user is currently typing
  const [input, setInput] = useState("");

  // true while waiting for the AI response
  const [loading, setLoading] = useState(false);

  // runs when user clicks Send or presses Enter
  const handleSend = async () => {
    if (!input.trim()) return; // ignore empty messages

    const userMessage = input.trim();

    // add the user's message to the conversation
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput(""); // clear the input box
    setLoading(true);

    try {
      const res = await client.post("/chat", { message: userMessage });

      // add the AI's reply to the conversation
      setMessages((prev) => [...prev, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="max-w-xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-medium">Chat</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ask questions about your expenses
          </p>
        </div>

        {/* Messages */}
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3 min-h-64">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {/*
                  User messages appear on the RIGHT (justify-end)
                  AI messages appear on the LEFT (justify-start)
                */}
                <div
                  className={`text-sm px-3 py-2 rounded-lg max-w-xs ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading indicator while waiting for AI */}
            {loading && (
              <div className="flex justify-start">
                <div className="text-sm px-3 py-2 rounded-lg bg-muted text-muted-foreground">
                  Thinking...
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Input box + send button */}
        <div className="flex gap-2">
          <Input
            placeholder="Ask something about your expenses..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            // pressing Enter sends the message
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={loading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
