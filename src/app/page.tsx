"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [activeNav, setActiveNav] = useState("Features");
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<{ original: string; short: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [modal, setModal] = useState<"signup" | "login" | null>(null);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [signupErrors, setSignupErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [signupSubmitted, setSignupSubmitted] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const [signupBackendError, setSignupBackendError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [user, setUser] = useState<{ name: string; sessionId: string; userId: number } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [customLink, setCustomLink] = useState("");
  const [customLinkError, setCustomLinkError] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [domainPrefix, setDomainPrefix] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // const passwordsMatch = signupForm.password === signupForm.confirm;

  const navLinks = [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Resources", href: "#" },
  ];

  // On mount, check for sessionId in localStorage (persist login)
  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");
    const name = localStorage.getItem("name");
    const userId = localStorage.getItem("userId");
    if (sessionId && name && userId) {
      setUser({ name, sessionId, userId: Number(userId) });
    }
  }, []);

  // Set domain prefix on client only
  useEffect(() => {
    setDomainPrefix(window.location.origin + "/");
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  async function handleShorten() {
    setLoading(true);
    setError(null);
    setCustomLinkError("");

    if (!(user?.sessionId && user?.userId)) {
      setShowAuthPanel(true);
      setLoading(false);
      return;
    }

    // Optional: Validate custom link format before sending
    if (customLink && !/^[a-zA-Z0-9_-]{3,20}$/.test(customLink)) {
      setCustomLinkError("Custom link must be 3-20 characters, letters, numbers, - or _ only.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/shorten/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: url, userId: user?.userId, customLink: customLink.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.short) {
        setLinks([{ original: url, short: `${window.location.origin}/${data.short}` }, ...links]);
        setUrl("");
        setCustomLink("");
      } else if (data.error && data.error.toLowerCase().includes("custom link")) {
        setCustomLinkError(data.error);
      } else {
        setError(data.error || "Failed to shorten link.");
      }
    } catch (e) {
      setError("Something went wrong.");
    }
    setLoading(false);
  }

  function handleCopy(shortUrl: string, idx: number) {
    navigator.clipboard.writeText(shortUrl);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  function openModal(type: "signup" | "login") {
    setModal(type);
    setSignupSubmitted(false);
    setSignupErrors({ name: "", email: "", password: "", confirm: "" });
    setSignupForm({ name: "", email: "", password: "", confirm: "" });
    setLoginForm({ email: "", password: "" }); // <-- add this
  }

  function closeModal() {
    setModal(null);
    setSignupForm({ name: "", email: "", password: "", confirm: "" });
    setSignupErrors({ name: "", email: "", password: "", confirm: "" });
    setSignupSubmitted(false);
  }

  function validateSignup(form: typeof signupForm) {
    const errors = { name: "", email: "", password: "", confirm: "" };
    if (!/^[A-Za-z\s]+$/.test(form.name.trim())) {
      errors.name = "Name must contain alphabets and spaces only.";
    }
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[@!*&$#]/.test(form.password)
    ) {
      errors.password =
        "Password must be at least 8 characters, include one uppercase and one special character (@!*&$#).";
    }
    if (form.confirm !== form.password) {
      errors.confirm = "Passwords do not match.";
    }
    return errors;
  }

  function handleSignupChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    if (signupSubmitted) {
      setSignupErrors(validateSignup({ ...signupForm, [e.target.name]: e.target.value }));
    }
  }

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSignupSubmitted(true);
    setSignupBackendError("");
    const errors = validateSignup(signupForm);
    setSignupErrors(errors);

    if (!errors.name && !errors.email && !errors.password && !errors.confirm) {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: signupForm.name,
            email: signupForm.email,
            password: signupForm.password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setSignupBackendError(data.error || "Signup failed. Please try again.");
          return;
        }
        // Show creative success message
        setSignupSuccess(true);
        setSignupForm({ name: "", email: "", password: "", confirm: "" });
        setSignupErrors({ name: "", email: "", password: "", confirm: "" });
        setSignupSubmitted(false);
        setSignupBackendError("");
        // After 2.5s, open login form
        setTimeout(() => {
          setSignupSuccess(false);
          setModal("login");
        }, 5000);
      } catch (err) {
        setSignupBackendError("Network error. Please try again.");
      }
    }
  }

  function validateLoginEmail(email: string) {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email.trim());
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    if (!validateLoginEmail(loginForm.email)) {
      setLoginError("Please enter a valid email address.");
      return;
    }
    setLoggingIn(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Login failed. Please try again.");
        setLoggingIn(false);
        return;
      }
      // Save to localStorage for persistence
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);
      localStorage.setItem("sessionId", data.sessionId);
      // Set user state
      setUser({ name: data.name, sessionId: data.sessionId, userId: data.userId });
      // Optionally, close modal and reset form
      setModal(null);
      setLoginForm({ email: "", password: "" });
      setLoginError("");
      // You can redirect or update UI here as needed
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Network error. Please try again.");
    }
    setLoggingIn(false);
  }

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (res.status === 200) {
        // Only clear local data if backend confirms logout
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.removeItem("sessionId");
        setUser(null);
        setDropdownOpen(false);
      } 
    } catch (err) {
      setLoggingOut(false);
    }
    setLoggingOut(false);
  }

  function handleClearLinks() {
    setLinks([]);
  }

  return (
    <div className="bg-[#f0f1f6] min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white w-full">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-center px-4 py-8">
          <Link href="/" className="flex items-center mb-6 md:mb-0">
            <Image src="/logo.svg" alt="Shortly Logo" width={112} height={32} className="h-8 w-auto" />
          </Link>
          <nav className="flex flex-col md:flex-row gap-6 md:gap-8 text-gray-500 font-medium items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveNav(link.label)}
                className={`transition-colors ${
                  activeNav === link.label
                    ? "text-black font-bold"
                    : "hover:text-black"
                }`}
                style={{
                  borderBottom: activeNav === link.label ? "3px solid #2acfcf" : "none",
                  paddingBottom: activeNav === link.label ? "4px" : "0",
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex gap-4 items-center mt-6 md:mt-0">
            {user && user.sessionId ? (
              <div className="relative flex items-center" ref={dropdownRef}>
                <span
                  className="text-gray-700 font-semibold text-base sm:text-lg mr-2"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  Hi, {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                </span>
                <button
                  className="flex items-center px-3 py-2 rounded-full bg-[#2acfcf] hover:bg-cyan-300 text-white font-bold transition focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-label="User menu"
                  type="button"
                >
                  <svg className={`w-5 h-5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-lg z-50 border border-gray-100 animate-fade-in">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                      style={{ fontFamily: "var(--font-poppins)" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button className="text-gray-500 font-medium hover:text-black" onClick={() => openModal("login")}>Login</button>
                <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-6 py-2 rounded-full transition" onClick={() => openModal("signup")}>
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col-reverse lg:flex-row items-center justify-between px-4 sm:px-8">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black mb-4 leading-tight"
              style={{ fontFamily: "var(--font-poppins)", fontWeight: 700 }}
            >
              More than just <br className="hidden sm:block" /> shorter links
            </h1>
            <p
              className="text-base sm:text-lg text-gray-400 mb-8 max-w-md"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Build your brand’s recognition and get detailed <br className="hidden sm:block" /> insights on how your links are performing.
            </p>
            <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-8 py-3 rounded-full text-lg transition">
              Get Started
            </button>
          </div>
          {/* Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mb-10 lg:mb-0">
            <Image
              src="/illustration-working.svg"
              alt="Working Illustration"
              width={580}
              height={400}
              className="w-full max-w-[580px] h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Shorten Input */}
      <section className="relative z-10 flex justify-center -mt-8 mb-8 px-2 sm:px-4">
        <form
          className="w-full max-w-3xl rounded-xl bg-[#3b3054] shadow-lg px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-2"
          style={{
            backgroundImage: "url('/bg-shorten-desktop.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right top",
            backgroundSize: "cover",
          }}
          onSubmit={e => { e.preventDefault(); handleShorten(); }}
        >
          {/* Main URL input */}
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Shorten a link here..."
              className={`w-full px-4 py-3 rounded-lg text-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-cyan-400 transition border-2 ${
                error ? "border-red-500" : "border-transparent"
              }`}
              style={{ fontFamily: "var(--font-poppins)" }}
            />
            {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
          </div>
          {/* Custom link toggle */}
          <div className="flex items-center gap-3 mb-0 mt-2">
            <label
              htmlFor="custom-link-toggle"
              className="text-sm font-semibold text-gray-200"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Custom link (optional)
            </label>
            {/* Toggle Switch */}
            <button
              type="button"
              aria-label="Toggle custom link"
              className="focus:outline-none"
              onClick={() => setShowCustom(v => !v)}
              tabIndex={0}
            >
              <span className={`inline-block w-10 h-6 rounded-full transition-colors duration-200 ${showCustom ? "bg-[#2acfcf]" : "bg-gray-300"}`}>
                <span
                  className={`block w-6 h-6 bg-white rounded-full shadow transform transition-transform duration-200 ${showCustom ? "translate-x-4" : ""}`}
                />
              </span>
            </button>
          </div>
          {/* Custom link input (collapsible) */}
          <div
            className={`overflow-hidden transition-all duration-300 ${showCustom ? "max-h-20 opacity-100 mt-2" : "max-h-0 opacity-0"} `}
            style={{ willChange: "max-height, opacity" }}
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-300 bg-[#251e38] px-3 py-2 rounded-l-lg text-base select-none" style={{ fontFamily: "var(--font-poppins)" }}>
                {domainPrefix}
              </span>
              <input
                id="custom-link"
                type="text"
                value={customLink}
                onChange={e => setCustomLink(e.target.value)}
                placeholder="your-custom-alias"
                className={`flex-1 px-4 py-2 rounded-r-lg text-base bg-white text-gray-800 placeholder-gray-400 focus:outline-cyan-400 transition border-2 ${
                  customLinkError ? "border-red-500" : "border-transparent"
                }`}
                style={{ fontFamily: "var(--font-poppins)" }}
                maxLength={20}
              />
            </div>
            {customLinkError && <div className="text-red-500 text-xs mt-1">{customLinkError}</div>}
          </div>
          {/* Button */}
          <button
            type="submit"
            className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-8 py-3 rounded-full text-lg transition mt-3"
            disabled={loading || !url}
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {loading ? "Shortening..." : "Shorten It!"}
          </button>
        </form>
      </section>

      {/* Shortened Links List */}
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-4 px-2 sm:px-0 mb-12">
        {links.map((link, idx) => (
          <div
            key={link.short}
            className="bg-white rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 shadow-md"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {/* Make this container flex and allow shrinking */}
            <div className="w-full sm:w-1/2 break-all text-gray-900 text-base sm:text-lg mb-2 sm:mb-0 overflow-x-auto whitespace-pre-wrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
              {link.original}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-0">
              <a
                href={link.short}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 font-medium hover:underline break-all"
                style={{ wordBreak: "break-all" }}
              >
                {link.short}
              </a>
              <button
                className={`px-8 py-2 rounded-lg text-white font-bold transition ${
                  copiedIndex === idx
                    ? "bg-[#3b3054]"
                    : "bg-cyan-400 hover:bg-cyan-300"
                }`}
                onClick={() => handleCopy(link.short, idx)}
              >
                {copiedIndex === idx ? "Copied!" : "Copy"}
              </button>
              <button
                className="ml-2 px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 font-bold transition flex items-center"
                title="Remove this link"
                onClick={() => {
                  setLinks(links => links.filter((_, i) => i !== idx));
                }}
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                <span className="text-xl leading-none">&times;</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Statistics */}
      <section className="text-center mb-20 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto w-full">
          <h2
            className="text-3xl font-extrabold text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Advanced Statistics
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-16" style={{ fontFamily: "var(--font-poppins)" }}>
            Track how your links are performing across the web with <br className="hidden sm:block" /> our advanced statistics dashboard.
          </p>
          <div className="relative flex flex-col lg:flex-row justify-center items-center gap-16 lg:gap-8">
            {/* Vertical line for mobile, horizontal for desktop */}
            <div className="absolute lg:hidden left-1/2 top-[80px] h-[calc(100%-80px)] w-2 bg-[#2acfcf] z-0" style={{ transform: "translateX(-50%)" }} />
            <div className="hidden lg:block absolute top-1/2 left-1/3 w-1/3 h-2 bg-[#2acfcf] z-0" style={{ transform: "translateY(-50%)" }} />
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs w-full h-[320px] flex flex-col justify-between relative z-10">
              <div>
                <div className="bg-[#3b3054] w-16 h-16 flex items-center justify-center rounded-full absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <Image src="/icon-brand-recognition.svg" alt="Brand Recognition" width={32} height={32} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-black mt-10 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>Brand Recognition</h3>
                <p className="text-gray-400 text-base" style={{ fontFamily: "var(--font-poppins)" }}>
                  Boost your brand recognition with each click. Generic links don’t mean a thing. Branded links help instill confidence in your content.
                </p>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs w-full h-[320px] flex flex-col justify-between relative z-10 lg:mt-12">
              <div>
                <div className="bg-[#3b3054] w-16 h-16 flex items-center justify-center rounded-full absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <Image src="/icon-detailed-records.svg" alt="Detailed Records" width={32} height={32} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mt-10 mb-4 text-black" style={{ fontFamily: "var(--font-poppins)" }}>Detailed Records</h3>
                <p className="text-gray-400 text-base" style={{ fontFamily: "var(--font-poppins)" }}>
                  Gain insights into who is clicking your links. Knowing when and where people engage with your content helps inform better decisions.
                </p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs w-full h-[320px] flex flex-col justify-between relative z-10 lg:mt-24">
              <div>
                <div className="bg-[#3b3054] w-16 h-16 flex items-center justify-center rounded-full absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <Image src="/icon-fully-customizable.svg" alt="Fully Customizable" width={32} height={32} className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mt-10 mb-4 text-black" style={{ fontFamily: "var(--font-poppins)" }}>Fully Customizable</h3>
                <p className="text-gray-400 text-base" style={{ fontFamily: "var(--font-poppins)" }}>
                  Improve brand awareness and content discoverability through customizable links, supercharging audience engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boost Section */}
      <section
        className="py-12 sm:py-16 text-center px-2 sm:px-4"
        style={{
          backgroundColor: "#3b3054",
          backgroundImage: "url('/bg-boost-desktop.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          fontFamily: "var(--font-poppins)", // <-- Add this line
        }}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6" style={{ fontFamily: "var(--font-poppins)" }}>
          Boost your links today
        </h2>
        <button
          className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-8 sm:px-10 py-4 rounded-full text-lg transition"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-[#232127] text-white py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">
          <div className="flex-shrink-0 flex justify-center lg:justify-start w-full lg:w-auto">
            {/* Use text logo for white color */}
            <span className="text-3xl font-extrabold tracking-wide text-white" style={{ fontFamily: "var(--font-poppins)" }}>
              <a href="">Shortly</a>
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-12 lg:gap-24 justify-center items-center lg:items-start flex-1">
            <div>
              <div className="font-bold mb-6 text-center sm:text-left">Features</div>
              <ul className="space-y-3 text-gray-400 text-center sm:text-left">
                <li>Link Shortening</li>
                <li>Branded Links</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-6 text-center sm:text-left">Resources</div>
              <ul className="space-y-3 text-gray-400 text-center sm:text-left">
                <li>Blog</li>
                <li>Developers</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-6 text-center sm:text-left">Company</div>
              <ul className="space-y-3 text-gray-400 text-center sm:text-left">
                <li>About</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-6 justify-center lg:justify-end items-start">
            <a href="">
              <Image src="/icon-facebook.svg" alt="Facebook" width={24} height={24} className="w-6 h-6" />
            </a>
            <a href="">
              <Image src="/icon-twitter.svg" alt="Twitter" width={24} height={24} className="w-6 h-6" />
            </a>
            <a href="">
              <Image src="/icon-pinterest.svg" alt="Pinterest" width={24} height={24} className="w-6 h-6" />
            </a>
            <a href="">
              <Image src="/icon-instagram.svg" alt="Instagram" width={24} height={24} className="w-6 h-6" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurry glass background */}
          <div
            className="absolute inset-0 bg-[#232127]/70 backdrop-blur-[16px] transition-all"
            onClick={closeModal}
          />
          {/* Modal content */}
          <div className="relative z-10 w-full max-w-md mx-auto">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 flex flex-col items-center relative animate-fade-in">
              {/* Cut icon */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                onClick={closeModal}
                aria-label="Close"
                tabIndex={0}
              >
                &times;
              </button>
              {modal === "signup" ? (
                signupSuccess ? (
                  <div className="flex flex-col items-center justify-center min-h-[340px] w-full">
                    <div className="bg-gradient-to-br from-[#2acfcf] to-[#3b3054] rounded-full p-6 mb-6 shadow-lg animate-bounce">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-[#3b3054] mb-2 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
                      Account Created!
                    </h2>
                    <p className="text-gray-500 text-lg text-center mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
                      Your account has been created successfully.
                    </p>
                    <p className="text-cyan-500 text-base text-center animate-pulse" style={{ fontFamily: "var(--font-poppins)" }}>
                      Redirecting to login...
                    </p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-extrabold text-[#3b3054] mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
                      Sign Up
                    </h2>
                    <p className="text-gray-400 mb-8 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
                      Create your Shortly account
                    </p>
                    <form className="w-full flex flex-col gap-5" onSubmit={handleSignupSubmit} noValidate>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                        <input
                          type="text"
                          name="name"
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            signupErrors.name && signupSubmitted ? "border-red-500" : "border-transparent"
                          } focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition`}
                          placeholder="Your name"
                          value={signupForm.name}
                          onChange={handleSignupChange}
                          required
                        />
                        {signupErrors.name && signupSubmitted && (
                          <div className="text-red-500 text-xs mt-1">{signupErrors.name}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            signupErrors.email && signupSubmitted ? "border-red-500" : "border-transparent"
                          } focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition`}
                          placeholder="you@email.com"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          required
                        />
                        {signupErrors.email && signupSubmitted && (
                          <div className="text-red-500 text-xs mt-1">{signupErrors.email}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">New Password</label>
                        <input
                          type="password"
                          name="password"
                          className={`w-full px-4 py-3 rounded-lg border-2 border-transparent focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition`}
                          placeholder="Create password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          required
                        />
                        {signupErrors.password && signupSubmitted && (
                          <div className="text-red-500 text-xs mt-1">{signupErrors.password}</div>
                        )}
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-1">Confirm Password</label>
                        <input
                          type="password"
                          name="confirm"
                          className={`w-full px-4 py-3 rounded-lg border-2 ${
                            signupForm.confirm &&
                            signupForm.password &&
                            signupForm.confirm !== signupForm.password
                              ? "border-red-500"
                              : "border-transparent"
                          } focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition`}
                          placeholder="Repeat password"
                          value={signupForm.confirm}
                          onChange={handleSignupChange}
                          required
                        />
                        {signupForm.confirm &&
                          signupForm.password &&
                          signupForm.confirm !== signupForm.password && (
                            <div className="text-red-500 text-xs mt-1">Passwords do not match.</div>
                        )}
                        {signupErrors.confirm && signupSubmitted && signupForm.confirm === signupForm.password && (
                          <div className="text-red-500 text-xs mt-1">{signupErrors.confirm}</div>
                        )}
                      </div>  
                      {signupBackendError && (
                        <div className="text-red-500 text-xs mb-2 text-center">{signupBackendError}</div>
                      )}                                    
                      <button
                        type="submit"
                        className="bg-[#2acfcf] hover:bg-cyan-300 text-white font-bold px-8 py-3 rounded-full text-lg transition mt-2"
                      >
                        Sign Up
                      </button>
                    </form>
                    <div className="mt-6 text-gray-500 text-sm">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#2acfcf] font-semibold hover:underline"
                        onClick={() => {
                          setSignupSubmitted(false);
                          setModal("login");
                          setLoginForm({ email: "", password: "" }); // reset login form
                        }}
                      >
                        Log in
                      </button>
                    </div>
                  </>
                )
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold text-[#3b3054] mb-2" style={{ fontFamily: "var(--font-poppins)" }}>
                    Log In
                  </h2>
                  <p className="text-gray-400 mb-8 text-center" style={{ fontFamily: "var(--font-poppins)" }}>
                    Welcome back! Please enter your details.
                  </p>
                  <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleLoginSubmit}
                    noValidate
                  >
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Email</label>
                      <input
                        type="email"
                        className={`w-full px-4 py-3 rounded-lg border-2 ${
                          loginForm.email.length > 0 && !validateLoginEmail(loginForm.email)
                            ? "border-red-500"
                            : "border-transparent"
                        } focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition`}
                        placeholder="you@email.com"
                        value={loginForm.email}
                        onChange={e => {
                          setLoginForm({ ...loginForm, email: e.target.value });
                          if (e.target.value.length > 0 && !validateLoginEmail(e.target.value)) {
                            setLoginError("Please enter a valid email address.");
                          } else {
                            setLoginError("");
                          }
                        }}
                        required
                      />
                      {/* {loginForm.email.length > 0 && loginError && (
                        <div className="text-red-500 text-xs mt-1">{loginError}</div>
                      )} */}
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-1">Password</label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 rounded-lg border-2 border-transparent focus:outline-cyan-400 bg-[#f0f1f6] text-gray-900 transition"
                        placeholder="Your password"
                        value={loginForm.password}
                        onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>
                    {loginError && (
                      <div className="text-red-500 text-xs mb-2 text-center">{loginError}</div>
                    )}
                    <button
                      type="submit"
                      className="bg-[#2acfcf] hover:bg-cyan-300 text-white font-bold px-8 py-3 rounded-full text-lg transition mt-2"
                      disabled={!loginForm.email || !loginForm.password}
                    >
                      Log In
                    </button>
                  </form>
                  <div className="mt-6 text-gray-500 text-sm">
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      className="text-[#2acfcf] font-semibold hover:underline"
                      onClick={() => {
                        setSignupSubmitted(false);
                        setModal("signup");
                        setSignupForm({ name: "", email: "", password: "", confirm: "" }); // reset signup form
                        setSignupErrors({ name: "", email: "", password: "", confirm: "" });
                      }}
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logging Out Spinner */}
      {loggingOut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#232127]/70 backdrop-blur-[2px]">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#2acfcf] to-[#3b3054] rounded-full p-6 shadow-lg animate-bounce">
              <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="mt-6 text-white text-lg font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
              Logging out...
            </span>
          </div>
        </div>
      )}

      {/* Logging In Spinner */}
      {loggingIn && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#232127]/70 backdrop-blur-[2px]">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-[#2acfcf] to-[#3b3054] rounded-full p-6 shadow-lg animate-bounce">
              <svg className="w-12 h-12 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="mt-6 text-white text-lg font-bold" style={{ fontFamily: "var(--font-poppins)" }}>
              Logging in...
            </span>
          </div>
        </div>
      )}

      {/* Auth Panel */}
      {showAuthPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#232127]/70 backdrop-blur-[2px]">
          <div className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center max-w-xl w-full mx-4 animate-fade-in">
            {/* Cut icon button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-red-700 text-4xl font-bold focus:outline-none"
              onClick={() => setShowAuthPanel(false)}
              aria-label="Close"
              tabIndex={0}
            >
              &times;
            </button>
            <Image
              src="/logo.svg"
              alt="Logo Illustration"
              width={120}
              height={80}
              className="mb-4 w-32 h-auto"
              priority
            />
            <h3
              className="text-xl font-extrabold text-[#3b3054] mb-2 text-center"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Log in or Sign up to shorten links!
            </h3>
            <p
              className="text-gray-500 text-base text-center mb-6"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Please log in or create an account to use the link shortener.
            </p>
            <div className="flex gap-4 w-full">
              <button
                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-4 py-2 rounded-full transition text-base"
                style={{ fontFamily: "var(--font-poppins)" }}
                onClick={() => {
                  setShowAuthPanel(false);
                  openModal("login");
                }}
              >
                Log In
              </button>
              <button
                className="flex-1 bg-[#3b3054] hover:bg-[#51407a] text-white font-bold px-4 py-2 rounded-full transition text-base"
                style={{ fontFamily: "var(--font-poppins)" }}
                onClick={() => {
                  setShowAuthPanel(false);
                  openModal("signup");
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
