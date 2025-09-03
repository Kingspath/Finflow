"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-finflow-light flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 shadow-finflow-card bg-white">
        <h1 className="text-2xl font-bold text-finflow-primary">FinFlow</h1>
        <div className="flex gap-4">
          <Link href="/signin" className="btn-outline">Sign In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20 bg-finflow-gradient text-white">
        <div className="max-w-xl">
          <h2 className="text-5xl font-bold mb-6">Smart Accounting, Simplified</h2>
          <p className="text-lg mb-6">
            FinFlow helps South African businesses stay compliant with SARS by
            automatically analyzing bank statements and preparing tax-ready reports.
          </p>
          <Link href="/signup" className="btn-secondary text-lg">
            Try FinFlow Free →
          </Link>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="/dashboard-preview.png"
            alt="FinFlow Dashboard"
            className="rounded-finflow shadow-finflow-hover"
            width={500}
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-12 py-16 grid md:grid-cols-3 gap-8">
        <div className="card-hover">
          <h3 className="text-xl font-bold mb-2">📊 Automated Bookkeeping</h3>
          <p>Upload bank statements and let FinFlow do the hard work for you.</p>
        </div>
        <div className="card-hover">
          <h3 className="text-xl font-bold mb-2">💡 Tax Compliance</h3>
          <p>Generate SARS-compliant reports effortlessly with accurate records.</p>
        </div>
        <div className="card-hover">
          <h3 className="text-xl font-bold mb-2">📈 Real-Time Insights</h3>
          <p>Track your business health with dashboards, analytics and charts.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-12 py-16 text-center bg-finflow-dark text-white">
        <h2 className="text-3xl font-bold mb-4">Start your free trial today</h2>
        <p className="mb-6">Join thousands of businesses streamlining finances with FinFlow</p>
        <Link href="/signup" className="btn-primary text-lg">
          Get Started Now →
        </Link>
      </section>

      <footer className="py-6 text-center text-finflow-gray">
        © {new Date().getFullYear()} FinFlow. All rights reserved.
      </footer>
    </div>
  );
}
