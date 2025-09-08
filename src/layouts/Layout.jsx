import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Phone, Home, MessageCircle, BarChart3, BookOpen, Music, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

const navigationItems = [
  { title: "Home", url: createPageUrl("Homepage"), icon: Home },
  { title: "Chat", url: createPageUrl("Chat"), icon: MessageCircle },
  { title: "Mood", url: createPageUrl("MoodTracker"), icon: BarChart3 },
  { title: "Sound", url: createPageUrl("SoundTherapy"), icon: Music },
  { title: "Community", url: createPageUrl("CommunityWall"), icon: Users },
  { title: "Resources", url: createPageUrl("Resources"), icon: BookOpen }
];

const helplineNumbers = [
  { name: "KIRAN (24/7)", number: "+91-18005990019" },
  { name: "NIMHANS", number: "+91-8046110007" },
  { name: "iCall", number: "+91-9152987821" }
];

export default function Layout({ children }) {
  const location = useLocation();
  const [showHelplines, setShowHelplines] = React.useState(false);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-xl animate-blob"></div>
          <div className="absolute top-60 right-20 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-xl animate-blob animation-delay-4000"></div>
        </div>

        <nav className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <Link to={createPageUrl("Homepage")} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Wellspring
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      location.pathname === item.url
                        ? "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold"
                        : "text-gray-600 hover:bg-white/60 hover:text-purple-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelplines(!showHelplines)}
                className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hidden md:flex"
              >
                <Phone className="w-4 h-4 mr-2" />
                Crisis Help
              </Button>
            </div>
          </div>
        </nav>

        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm border-t border-white/20">
          <div className="flex justify-around py-2">
            {navigationItems.slice(0, 5).map((item) => (
              <Link
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 w-1/5 ${
                  location.pathname === item.url ? "text-purple-600" : "text-gray-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              onClick={() => setShowHelplines(!showHelplines)}
              className="fixed bottom-20 md:bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            >
              <Phone className="w-6 h-6 text-white" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Emergency Helplines</p>
          </TooltipContent>
        </Tooltip>

        {showHelplines && (
          <div className="fixed bottom-36 md:bottom-20 right-6 z-40 bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 w-72 border border-white/20">
            <div className="text-center mb-3">
              <h3 className="font-bold text-gray-800 mb-1">🆘 Crisis Helplines</h3>
              <p className="text-xs text-gray-600">You're not alone. Reach out for support.</p>
            </div>
            <div className="space-y-2">
              {helplineNumbers.map((helpline) => (
                <a
                  key={helpline.name}
                  href={`tel:${helpline.number}`}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                >
                  <span className="font-medium text-gray-700">{helpline.name}</span>
                  <span className="text-blue-600 font-mono text-sm">{helpline.number}</span>
                </a>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowHelplines(false)} className="w-full mt-3 text-gray-500">
              Close
            </Button>
          </div>
        )}

        <main className="relative z-10 pb-20 md:pb-6">
          {children}
        </main>
      </div>
    </TooltipProvider>
  );
}
