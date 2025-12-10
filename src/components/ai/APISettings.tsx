"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  Column,
  Text,
  Button,
  Select,
  PasswordInput,
  Heading,
  IconButton,
} from "@/once-ui/components";
import { aiService, AIProvider, AIConfig } from "@/app/utils/aiService";

interface APISettingsProps {
  onConfigured: () => void;
}

const PROVIDERS = [
  { value: "openai", label: "OpenAI (GPT-3.5 Turbo)" },
  { value: "grok", label: "Grok (X.AI)" },
  { value: "groq", label: "Groq (Mixtral 8x7b)" },
] as const;

export const APISettings: React.FC<APISettingsProps> = ({ onConfigured }) => {
  const [provider, setProvider] = useState<AIProvider>("openai");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const config = aiService.getConfig();
    if (config) {
      setProvider(config.provider);
      setIsOpen(false);
      setIsEditing(false);
    }
  }, []);

  const handleSave = () => {
    setError("");
    setSuccess(false);

    if (!apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    try {
      aiService.setConfig(provider, apiKey);
      setSuccess(true);
      setApiKey("");
      setIsOpen(false);
      setIsEditing(false);
      onConfigured();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    }
  };

  const handleClear = () => {
    aiService.clearConfig();
    setApiKey("");
    setProvider("openai");
    setIsOpen(true);
    setIsEditing(false);
    setError("");
    setSuccess(false);
  };

  const config = aiService.getConfig();
  const hasConfig = !!config;

  if (!isOpen && hasConfig && !isEditing) {
    return (
      <Flex
        background="surface"
        border="neutral-medium"
        radius="m"
        padding="m"
        gap="12"
        vertical="center"
        justifyContent="space-between"
        fillWidth
      >
        <Flex vertical="center" gap="8">
          <Text variant="body-default-s" onBackground="neutral-weak">
            Active Provider:
          </Text>
          <Text variant="body-strong-m">
            {PROVIDERS.find((p) => p.value === config.provider)?.label}
          </Text>
        </Flex>
        <IconButton
          icon="settings"
          variant="ghost"
          size="s"
          onClick={() => setIsEditing(true)}
          tooltip="Edit settings"
        />
      </Flex>
    );
  }

  if (isEditing && !isOpen) {
    return (
      <Flex
        background="surface"
        border="neutral-medium"
        radius="m"
        padding="m"
        gap="12"
        vertical="center"
        justifyContent="space-between"
        fillWidth
      >
        <Text variant="body-default-s">Ready to change provider?</Text>
        <Flex gap="8">
          <Button
            variant="secondary"
            size="s"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            size="s"
            onClick={handleClear}
          >
            Change Provider
          </Button>
        </Flex>
      </Flex>
    );
  }

  return (
    <Column
      background="surface"
      border="neutral-medium"
      radius="m"
      padding="m"
      gap="m"
      fillWidth
      marginBottom="m"
    >
      <Heading variant="heading-default-s">AI Configuration</Heading>

      <Column gap="12">
        <Flex direction="column" gap="8">
          <Text variant="label-default-s">Select AI Provider</Text>
          <Flex
            as="select"
            background="surface"
            border="neutral-medium"
            radius="m"
            padding="12"
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            style={{
              appearance: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "inherit",
              color: "inherit",
            }}
          >
            {PROVIDERS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Flex>
        </Flex>

        <PasswordInput
          id="api-key"
          label="API Key"
          placeholder={
            provider === "openai"
              ? "sk-..."
              : provider === "grok"
                ? "xai-..."
                : "gsk_..."
          }
          value={apiKey}
          onChange={(e) => {
            setApiKey(e.target.value);
            setError("");
          }}
          helpText={
            provider === "openai"
              ? "Get your key at https://platform.openai.com/api-keys"
              : provider === "grok"
                ? "Get your key at https://console.x.ai"
                : "Get your key at https://console.groq.com"
          }
        />
      </Column>

      {error && (
        <Flex
          background="danger-alpha-weak"
          border="danger-medium"
          radius="m"
          padding="12"
        >
          <Text variant="body-default-s" onBackground="danger-strong">
            {error}
          </Text>
        </Flex>
      )}

      {success && (
        <Flex
          background="success-alpha-weak"
          border="success-medium"
          radius="m"
          padding="12"
        >
          <Text variant="body-default-s" onBackground="success-strong">
            Configuration saved successfully! ✓
          </Text>
        </Flex>
      )}

      <Flex gap="8">
        <Button variant="primary" onClick={handleSave} fillWidth>
          Save Configuration
        </Button>
        {hasConfig && (
          <Button variant="secondary" onClick={handleClear}>
            Clear
          </Button>
        )}
      </Flex>
    </Column>
  );
};
