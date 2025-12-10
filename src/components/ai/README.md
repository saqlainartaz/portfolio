# AI Chat Assistant

A full-featured AI chat interface integrated into your portfolio with support for multiple AI providers.

## Features

✨ **Multiple AI Provider Support:**
- OpenAI (GPT-3.5 Turbo and GPT-4)
- Grok (X.AI)
- Groq (Mixtral 8x7b)

🔒 **Security:**
- API keys stored locally in browser localStorage only
- No backend storage of sensitive credentials
- Keys are never sent to third parties except to the respective AI providers

💬 **Chat Interface:**
- Clean, modern ChatGPT/Grok-inspired UI
- Real-time message streaming
- Message history within a session
- Clear chat functionality
- Responsive design for mobile and desktop

⚙️ **Configuration:**
- Easy API key setup
- Switch between providers
- Edit or update configuration anytime

## How to Use

### 1. Get Your API Key

**For OpenAI:**
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy the key (starts with `sk-`)

**For Grok (X.AI):**
1. Visit https://console.x.ai
2. Create a new API key
3. Copy the key (starts with `xai-`)

**For Groq:**
1. Visit https://console.groq.com
2. Create a new API key
3. Copy the key (starts with `gsk_`)

### 2. Configure in Chat

1. Click on the "AI" navigation in the header
2. Select your preferred AI provider from the dropdown
3. Paste your API key in the "API Key" field
4. Click "Save Configuration"
5. Start chatting!

### 3. Switch Providers

- Click the settings icon next to your active provider
- Click "Change Provider" to switch to a different AI service
- Select a new provider and save your new API key

## Technical Details

### File Structure

```
src/
├── app/
│   ├── ai/
│   │   └── page.tsx          # Main AI page
│   └── utils/
│       └── aiService.ts      # AI API service
├── components/
│   └── ai/
│       ├── AIChat.tsx        # Main chat component
│       ├── APISettings.tsx   # API configuration component
│       └── AIChat.module.scss # Styling
```

### API Service (`aiService.ts`)

The `AIService` class handles:
- Configuration management (get, set, clear)
- Message formatting and sending
- Multi-provider support with specific API endpoints and models

**Available Models:**
- OpenAI: `gpt-3.5-turbo` (change to `gpt-4` if needed)
- Grok: `grok-beta`
- Groq: `mixtral-8x7b-32768`

### Local Storage

Configuration is stored in browser localStorage under the key `ai_config`:

```javascript
{
  "provider": "openai",
  "apiKey": "your-api-key-here"
}
```

**Note:** This persists your API key in browser storage. Clear it manually if using a shared device.

## Environment Variables (Optional)

For production deployment, you can optionally use environment variables:

Create a `.env.local` file:

```
# NEXT_PUBLIC_DEFAULT_PROVIDER=openai
# This would allow setting a default provider
```

## Customization

### Changing Default Model

Edit `src/app/utils/aiService.ts` in the respective provider methods:

```typescript
// For OpenAI - change gpt-3.5-turbo to gpt-4
model: "gpt-4"

// For Grok
model: "grok-beta"

// For Groq
model: "mixtral-8x7b-32768"
```

### Adjusting Temperature and Max Tokens

All providers are configured with:
- `temperature: 0.7` - Controls creativity (0-1, higher = more creative)
- `max_tokens: 1000` - Maximum response length

Modify these in `aiService.ts` to adjust response behavior.

### Adding a New AI Provider

1. Add the provider to the `AIProvider` type in `aiService.ts`
2. Create a new private method (e.g., `callNewProvider`)
3. Add it to the switch statement in `sendMessage`
4. Update `PROVIDERS` array in `APISettings.tsx`

Example:

```typescript
private async callNewProvider(messages: any[], apiKey: string): Promise<string> {
  const response = await fetch("https://api-endpoint.com/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });
  // ... handle response
}
```

## Security Best Practices

1. **Never commit API keys** - Always use `.gitignore` for `.env` files
2. **Rotate keys regularly** - Especially if accidentally exposed
3. **Monitor API usage** - Check your provider's dashboard for unusual activity
4. **Use specific API scopes** - If your provider offers limited-scope keys, use them
5. **Clear on public devices** - Remove stored keys before leaving shared computers

## Troubleshooting

### "API Configuration not set"
- Ensure you've saved your API key in the settings
- Check that the key is not empty

### "API Error: Invalid API key"
- Verify your API key is correct
- Make sure you copied the entire key
- Check that the key hasn't expired or been revoked

### CORS Errors
- This shouldn't occur as API calls go directly from your browser to the provider
- If you see CORS errors, it might be a provider-specific issue
- Check the provider's API documentation

### Slow Responses
- Check your internet connection
- The provider might be experiencing high load
- Try a different, simpler question

## Future Enhancements

Potential features to add:
- [ ] Voice input/output
- [ ] File upload support for context
- [ ] Conversation export
- [ ] Dark/light theme toggle
- [ ] Custom system prompts
- [ ] Message editing
- [ ] Conversation history across sessions
- [ ] Rate limiting and usage stats

## Support

For issues or feature requests:
1. Check the provider's API documentation
2. Verify your API key is valid
3. Test with a different provider to isolate issues
