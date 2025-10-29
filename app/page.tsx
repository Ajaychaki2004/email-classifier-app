"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { MdCategory } from "react-icons/md";
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const { data: session } = useSession();
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedApiKey = localStorage.getItem("openai-api-key");
    if (savedApiKey) {
      setIsApiKeySaved(true);
    }

    // const savedEmails = localStorage.getItem("emails");
    // if (savedEmails) {
    //   setEmails(JSON.parse(savedEmails));
    // }
  }, []);

  const handleSaveApiKey = () => {
    const apiKeyPattern = /^sk-[a-zA-Z0-9_-]+$/;
    if (apiKey.trim() && apiKeyPattern.test(apiKey)) {
      localStorage.setItem("openai-api-key", apiKey);
      setIsApiKeySaved(true);
      toast.success("API key saved!");
    } else {
      toast.error("Please enter a valid OpenAI API key (e.g., sk-proj-...).");
    }
  };

  const handleFetch = async (count: number = selectedCount) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/emails?count=${count}`);
      const data = await res.json();
      setLoading(false);

      if (data.emails) {
        setEmails(data.emails);
        //localStorage.setItem("emails", JSON.stringify(data.emails));
      } else {
        toast.error(data.error || "Failed to fetch emails");
      }
    } catch (err) {
      console.error("Error fetching emails:", err);
      setLoading(false);
      toast.error("Error fetching emails. Check the console for details.");
    }
  };

  const handleClassify = async () => {
    const openaiKey = localStorage.getItem("openai-api-key");
    if (!openaiKey) {
      alert("Please save your OpenAI key first.");
      return;
    }

    setLoading(true);
    const res = await fetch("http://localhost:5000/classify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails, openaiKey }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.classified) {
      setEmails(data.classified);
      localStorage.setItem("emails", JSON.stringify(data.classified));
    } else {
      alert("Failed to classify emails");
    }
  };


  const handleSignOut = () => {
    localStorage.removeItem("openai-api-key");
    signOut();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Promotions':
        return 'text-blue-500';
      case 'Marketing':
        return 'text-orange-500';
      case 'General':
        return 'text-slate-500';
      case 'Important':
        return 'text-green-500';
      case 'Spam':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mb-4"></div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">Loading...</h1>
              <p className="text-slate-600">Please wait while we set things up.</p>
            </div>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to access your dashboard</p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="api-key" className="block text-sm font-semibold text-slate-700 mb-2">
                OpenAI API Key
              </label>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleSaveApiKey}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Save API Key
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">then sign in with Google</span>
            </div>
          </div>

          <button
            onClick={() => signIn("google")}
            disabled={!isApiKeySaved}
            className={`w-full bg-white border-2 text-slate-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 mb-6 hover:shadow-md ${
              isApiKeySaved
                ? "border-slate-200 hover:border-slate-300"
                : "border-slate-100 cursor-not-allowed opacity-50"
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">{session.user?.name}</p>
                <p className="text-xs text-slate-500">{session.user?.email}</p>
              </div>
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-slate-200"
                />
              )}
              <button
                onClick={() => handleSignOut()}
                className="bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-lg transition-all duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Email Management</h2>
            <p className="text-slate-600">Fetch and manage your emails efficiently</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <select
                value={selectedCount}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value);
                  setSelectedCount(newCount);
                  if (newCount > 0) {
                    handleFetch(newCount);
                  }
                }}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <option value={0}>Select No of mails</option>
                <option value={15}>15</option>
                <option value={30}>30</option>
                <option value={45}>45</option>
              </select>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              )}
            </div>
            <button
              disabled={loading}
              className={`bg-slate-300 hover:bg-white text-slate-700 font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md inline-flex items-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleClassify}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-700"></div>
              ) : (
                <MdCategory className="w-5 h-5" />
              )}
              Classify Emails
            </button>
          </div>

          {emails.length > 0 && (
            <div className="mt-8 grid gap-4">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="group relative border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                >
                  {/* Header Section */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {email.subject}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">{email.from}</p>
                    </div>
                    {/* <span className="text-xs text-slate-500">{email.date}</span> */}
                    <span className={`text-xs ${getCategoryColor(email.category)}`}>{email.category}</span>
                  </div>

                  {/* Snippet Section */}
                  <p className="mt-3 text-sm text-slate-700 leading-relaxed line-clamp-2">
                    {email.snippet}
                  </p>

                  {/* Subtle divider */}
                  <div className="absolute bottom-0 left-0 w-full h-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-2xl"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
