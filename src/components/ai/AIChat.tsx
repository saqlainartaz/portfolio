"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Column,
  Flex,
  Text,
  Button,
  Input,
  IconButton,
  Spinner,
  Avatar,
} from "@/once-ui/components";
import { aiService, ChatMessage } from "@/app/utils/aiService";
import { APISettings } from "./APISettings";
import styles from "./AIChat.module.scss";

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI assistant. Configure your API key above to get started.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);
  const [hasCheckedConfig, setHasCheckedConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const config = aiService.getConfig();
    setIsConfigured(!!config);
    setHasCheckedConfig(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!isConfigured) {
      setError("Please configure your API key first");
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const response = await aiService.sendMessage([...messages, userMessage]);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
      setMessages((prev) => prev.slice(0, -1)); // Remove the user message
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Chat cleared. Ready for a new conversation!",
        timestamp: new Date(),
      },
    ]);
    setError("");
  };

  if (!hasCheckedConfig) {
    return (
      <Flex fillWidth horizontal="center" paddingY="xl">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Column fillWidth paddingY="l" gap="m">
      {/* Settings Section */}
      <APISettings onConfigured={() => setIsConfigured(true)} />

      {/* Chat Container */}
      <Column
        className={styles.chatContainer}
        background="surface"
        border="neutral-medium"
        radius="m"
        fillWidth
        padding="m"
        gap="m"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "600px",
        }}
      >
        {/* Messages */}
        <Column
          className={styles.messagesArea}
          fillWidth
          gap="m"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "8px",
          }}
        >
          {messages.map((message) => (
            <Flex
              key={message.id}
              gap="12"
              horizontal={message.role === "user" ? "end" : "start"}
              fillWidth
            >
              {message.role === "assistant" && (
                <Avatar
                  size="m"
                  style={{
                    background: "var(--color-brand-on-background-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  initials="AI"
                />
              )}

              <Flex
                background={message.role === "user" ? "brand-alpha-weak" : "neutral-alpha-weak"}
                border="neutral-medium"
                radius="m"
                padding="12"
                maxWidth={message.role === "user" ? 80 : 85}
                className={styles.messageBubble}
              >
                <Text
                  variant="body-default-m"
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {message.content}
                </Text>
              </Flex>

              {message.role === "user" && (
                <Avatar
                  size="m"
                  style={{
                    background: "var(--color-accent-on-background-strong)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  initials="You"
                />
              )}
            </Flex>
          ))}

          {isLoading && (
            <Flex gap="12" horizontal="start" fillWidth>
              <Avatar
                size="m"
                style={{
                  background: "var(--color-brand-on-background-strong)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                initials="AI"
              />
              <Flex
                background="neutral-alpha-weak"
                border="neutral-medium"
                radius="m"
                padding="12"
                vertical="center"
                gap="8"
              >
                <Spinner size="s" />
                <Text variant="body-default-s" onBackground="neutral-weak">
                  Thinking...
                </Text>
              </Flex>
            </Flex>
          )}

          <div ref={messagesEndRef} />
        </Column>

        {error && (
          <Flex
            background="danger-alpha-weak"
            border="danger-medium"
            radius="m"
            padding="12"
            gap="8"
          >
            <Text variant="body-default-s" onBackground="danger-strong">
              {error}
            </Text>
            <IconButton
              icon="close"
              size="s"
              variant="ghost"
              onClick={() => setError("")}
            />
          </Flex>
        )}

        {/* Input Area */}
        <Flex gap="8" fillWidth>
          <Input
            id="message-input"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !isConfigured}
            style={{
              flex: 1,
            }}
          />
          <IconButton
            icon="arrowUp"
            onClick={handleSendMessage}
            disabled={isLoading || !isConfigured || !input.trim()}
            variant="primary"
          />
          <IconButton
            icon="trash"
            onClick={clearChat}
            disabled={isLoading}
            variant="secondary"
            tooltip="Clear chat"
          />
        </Flex>
      </Column>

      {/* Info Footer */}
      <Flex
        horizontal="center"
        padding="12"
        background="neutral-alpha-weak"
        radius="m"
        fillWidth
      >
        <Text variant="body-default-xs" onBackground="neutral-weak">
          Note: Your API keys are stored locally in your browser. Never share your API keys.
        </Text>
      </Flex>
    </Column>
  );
};
