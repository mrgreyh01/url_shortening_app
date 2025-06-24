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
        <header className="flex justify-between items-center py-8 bg-white">
          {/* Container for consistent alignment */}
          <div className="max-w-7xl m-auto flex justify-between items-center w-full">
            <Link href="/" className="flex items-center pl-26">
              <Image src="/logo.svg" alt="Shortly Logo" width={112} height={32} className="h-8 w-auto" />
            </Link>
            <nav className="flex gap-8 text-gray-500 font-medium">
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
            <div className="flex gap-6 items-center">
              <button className="text-gray-500 font-medium hover:text-black">Login</button>
              <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-6 py-2 rounded-full transition">Sign Up</button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex justify-between items-center pt-16 pb-24 bg-white">
          <div className="max-w-7xl m-auto flex justify-between items-center w-full">
            {/* Main Content */}
            <div className="pl-25">
              <h1
                className="text-7xl font-extrabold text-black mb-1 leading-tight"
                style={{ fontFamily: "var(--font-poppins)", fontWeight: 700 }}
              >
                More than just <br /> shorter links
              </h1>
              <p
                className="text-lg text-gray-400 mb-8"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Build your brand’s recognition and get detailed <br /> insights on how your links are performing.
              </p>
              <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-8 py-3 rounded-full text-lg transition">
                Get Started
              </button>
            </div>
            <div className="flex-1 flex justify-end">
              <Image
                src="/illustration-working.svg"
                alt="Working Illustration"
                width={580}
                height={400}
                className="w-[580px] lg:max-w-full lg:h-auto block"
                priority
                style={{ marginRight: '-3rem' }} // adjust as needed for flush effect
              />
            </div>
          </div>
        </section>

        {/* Shorten Input */}
        <section className="relative z-10 px-55 flex justify-center -mt-16 mb-12">
          <div
            className="w-full rounded-xl flex items-center px-10 py-8 shadow-lg"
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
              className="flex-1 px-4 py-2 rounded-lg text-lg outline-solid outline-white mr-6 bg-white text-gray-800 placeholder-gray-400 focus:outline-cyan-400 transition"
            />
            <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-5 py-3 rounded-lg text-lg transition">
              Shorten It!
            </button>
          </div>
        </section>
      
      {/* Advanced Statistics */}
      <section className="text-center mb-20">
        <div className="max-w-7xl m-auto w-full">
          <h2
            className="text-3xl font-extrabold text-gray-800 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            Advanced Statistics
          </h2>
          <p className="text-gray-400 text-lg mb-16" style={{ fontFamily: "var(--font-poppins)" }}>
            Track how your links are performing across the web with <br /> our advanced statistics dashboard.
          </p>
          <div className="relative flex justify-center gap-8">
            {/* Connection line between cards */}
            <div
              className="absolute top-2/5 h-2 bg-[#2acfcf] z-0 transform -translate-y-1/2"
              style={{
                left:  "calc(50% - 200px)",    // 200px = half your card’s width (300px/2) + half the gap (32px/2)
                right: "calc(50% - 200px)",
              }}
            />
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs h-[320px] flex flex-col justify-between relative z-10">
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
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs h-[320px] flex flex-col justify-between relative mt-12 z-10">
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
            <div className="bg-white rounded-lg shadow-md p-8 max-w-xs h-[320px] flex flex-col justify-between relative mt-24 z-10">
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
        className="py-16 text-center"
        style={{
          backgroundColor: "#3b3054",
          backgroundImage: "url('/bg-boost-desktop.svg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-full rounded-xl flex flex-col items-center px-10 py-8 shadow-lg">
          <h2 className="text-3xl font-extrabold text-white mb-6">Boost your links today</h2>
          <button className="bg-cyan-400 hover:bg-cyan-300 text-white font-bold px-10 py-4 rounded-full text-lg transition">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#232127] text-white py-16 px-16">
        <div className="flex justify-between max-w-7xl mx-auto">
          <div>
            <div className="text-2xl font-bold mb-8">Shortly</div>
          </div>
          <div className="flex gap-24">
            <div>
              <div className="font-bold mb-6">Features</div>
              <ul className="space-y-3 text-gray-400">
                <li>Link Shortening</li>
                <li>Branded Links</li>
                <li>Analytics</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-6">Resources</div>
              <ul className="space-y-3 text-gray-400">
                <li>Blog</li>
                <li>Developers</li>
                <li>Support</li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-6">Company</div>
              <ul className="space-y-3 text-gray-400">
                <li>About</li>
                <li>Our Team</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-6 items-start">
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
