import React, { useState } from 'react';
import { Heart, Sparkles, Music, Play, Send } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI("AIzaSyDScjqKXlRHRI5TIgosy08PcfgfghxivUE");

interface SupportResponse {
  quote: string;
  selfCareTip: string;
  mediaTitle: string;
  mediaDescription: string;
}

function App() {
  const [mood, setMood] = useState('');
  const [response, setResponse] = useState<SupportResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetSupport = async () => {
    if (!mood.trim()) return;
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `The user is feeling "${mood}". Generate a JSON response with:
      {
        "quote": "...",
        "selfCareTip": "...",
        "mediaTitle": "...",
        "mediaDescription": "..."
      }`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.slice(jsonStart, jsonEnd);

      const parsed: SupportResponse = JSON.parse(jsonString);
      setResponse(parsed);
    } catch (error) {
      console.error("Error fetching support:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGetSupport();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-full shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Wellness Support
          </h1>
          <p className="text-gray-600 text-lg">
            Let's find some support for how you're feeling today
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/50">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label htmlFor="mood" className="block text-lg font-medium text-gray-700 mb-3">
                How are you feeling today?
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., happy, sad, stressed..."
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 placeholder-gray-400"
                  disabled={isLoading}
                />
                <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              </div>
            </div>

            <button
              onClick={handleGetSupport}
              disabled={!mood.trim() || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Finding Support...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Get Support
                </>
              )}
            </button>
          </div>

          {/* Response Section */}
          {response && (
            <div className="mt-8 space-y-6 animate-fade-in">
              <div className="h-px bg-gradient-to-r from-transparent via-purple-200 to-transparent"></div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 rounded-full p-2 flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Inspirational Quote</h3>
                    <p className="text-gray-700 italic leading-relaxed">"{response.quote}"</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500 rounded-full p-2 flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Self-Care Tip</h3>
                    <p className="text-gray-700 leading-relaxed">{response.selfCareTip}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-500 rounded-full p-2 flex-shrink-0">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Recommended for You</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{response.mediaTitle}</p>
                        <p className="text-sm text-gray-600 mt-1">{response.mediaDescription}</p>
                      </div>
                      <button className="bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full transition-colors duration-200 flex-shrink-0">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    setMood('');
                    setResponse(null);
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Remember: You're not alone, and it's okay to seek professional help when needed.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
