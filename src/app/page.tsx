"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [activeNav, setActiveNav] = useState("Features");

  const navLinks = [
    { label: "Features", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "Resources", href: "#" },
  ];

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
            <button className="text-gray-500 font-medium hover:text-black">Login</button>
            <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-6 py-2 rounded-full transition">Sign Up</button>
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
      <section className="relative z-10 flex justify-center -mt-8 mb-12 px-2 sm:px-4">
        <div
          className="w-full max-w-4xl rounded-xl flex flex-col sm:flex-row items-center px-4 sm:px-10 py-6 sm:py-8 shadow-lg gap-4 sm:gap-0"
          style={{
            backgroundColor: "#3b3054",
            backgroundImage: "url('/bg-shorten-desktop.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <input
            type="text"
            placeholder="Shorten a link here..."
            className="flex-1 px-4 py-2 rounded-lg text-lg outline-solid outline-white bg-white text-gray-800 placeholder-gray-400 focus:outline-cyan-400 transition mb-4 sm:mb-0 sm:mr-6"
          />
          <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-5 py-3 rounded-lg text-lg transition w-full sm:w-auto">
            Shorten It!
          </button>
        </div>
      </section>
    
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
        }}
      >
        <div className="w-full max-w-3xl mx-auto rounded-xl flex flex-col items-center px-4 sm:px-10 py-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">Boost your links today</h2>
          <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-8 sm:px-10 py-4 rounded-full text-lg transition">
            Get Started
          </button>
        </div>
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
    </div>
  );
}
