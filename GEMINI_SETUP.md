# 🚀 Gemini API Integration Setup Guide

## 📋 **Step-by-Step Instructions**

### **Step 1: Get Your Google Gemini API Key**

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/
   - Sign in with your Google account

2. **Create API Key**
   - Click "Get API Key" or "Create API Key"
   - Choose "Create API Key in new project" or select existing project
   - **Copy the API key immediately** (you won't see it again!)

3. **Enable Gemini API**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Go to "APIs & Services" > "Library"
   - Search for "Gemini API"
   - Click "Enable"

### **Step 2: Configure Your API Key**

1. **Open the configuration file:**
   ```
   src/config/gemini.js
   ```

2. **Replace the placeholder:**
   ```javascript
   API_KEY: 'your_gemini_api_key_here', // Replace this with your actual API key
   ```

3. **With your actual API key:**
   ```javascript
   API_KEY: 'AIzaSyC...', // Your actual Gemini API key
   ```

### **Step 3: Test the Integration**

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the chat page:**
   - Navigate to the Chat component
   - Check the connection status indicator
   - Try sending a test message

3. **Verify it's working:**
   - You should see "AI Connected" status
   - Messages should generate responses from Gemini
   - Check browser console for any errors

### **Step 4: Customize Mental Health Prompts (Optional)**

You can customize the mental health prompts in:
```
src/config/gemini.js
```

Look for the `MENTAL_HEALTH_PROMPT` variable and modify it to suit your needs.

## 🔧 **Configuration Options**

### **Model Settings**
```javascript
MODEL: 'gemini-1.5-flash', // Available models: gemini-1.5-flash, gemini-1.5-pro
MAX_TOKENS: 1000,          // Maximum response length
TEMPERATURE: 0.7,          // Creativity level (0.0-1.0)
```

### **Safety Settings**
The API includes built-in safety filters for:
- Harassment
- Hate speech
- Sexually explicit content
- Dangerous content

## 🛡️ **Security Best Practices**

1. **Never commit your API key to version control**
2. **Use environment variables in production**
3. **Monitor API usage and costs**
4. **Implement rate limiting if needed**
5. **Add user authentication for production use**

## 🚨 **Crisis Detection**

The system automatically detects crisis keywords and provides:
- Immediate crisis response
- Emergency contact information
- Professional resource recommendations
- Safety protocols

## 📊 **Usage Limits**

- **Free Tier**: 15 requests per minute
- **Paid Tier**: Higher limits available
- **Cost**: Free for basic usage, paid for higher volumes

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"API Key Invalid"**
   - Check your API key is correct
   - Ensure Gemini API is enabled in Google Cloud Console

2. **"Rate Limit Exceeded"**
   - Wait a minute before sending more messages
   - Consider upgrading to paid tier

3. **"Connection Failed"**
   - Check internet connection
   - Verify API key is valid
   - Check browser console for errors

### **Debug Mode:**
Open browser console (F12) to see detailed error messages and API responses.

## 📞 **Support**

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correct
3. Ensure Gemini API is enabled
4. Check your internet connection

## 🎯 **Next Steps**

Once integration is working:
1. Test with various mental health scenarios
2. Customize prompts for your specific needs
3. Add additional safety measures if needed
4. Consider adding user authentication
5. Monitor usage and performance

---

**Remember:** Keep your API key secure and never share it publicly!curl 
