export type AIProvider = "openai" | "grok" | "groq";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
}

class AIService {
  private config: AIConfig | null = null;

  setConfig(provider: AIProvider, apiKey: string) {
    if (!apiKey.trim()) {
      throw new Error("API key cannot be empty");
    }
    this.config = { provider, apiKey };
    localStorage.setItem("ai_config", JSON.stringify(this.config));
  }

  getConfig(): AIConfig | null {
    if (this.config) return this.config;

    const stored = localStorage.getItem("ai_config");
    if (stored) {
      try {
        this.config = JSON.parse(stored);
        return this.config;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  clearConfig() {
    this.config = null;
    localStorage.removeItem("ai_config");
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    const config = this.getConfig();
    if (!config) {
      throw new Error("API configuration not set. Please add your API key.");
    }

    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      switch (config.provider) {
        case "openai":
          return await this.callOpenAI(formattedMessages, config.apiKey);
        case "grok":
          return await this.callGrok(formattedMessages, config.apiKey);
        case "groq":
          return await this.callGroq(formattedMessages, config.apiKey);
        default:
          throw new Error("Unknown AI provider");
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API Error: ${error.message}`);
      }
      throw error;
    }
  }

  private async callOpenAI(
    messages: any[],
    apiKey: string,
  ): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGrok(
    messages: any[],
    apiKey: string,
  ): Promise<string> {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Grok API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callGroq(
    messages: any[],
    apiKey: string,
  ): Promise<string> {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Groq API error");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

export const aiService = new AIService();
