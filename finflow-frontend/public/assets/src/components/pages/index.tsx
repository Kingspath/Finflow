import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center bg-finflow-light text-center p-8">
        <h1 className="text-4xl md:text-6xl font-bold text-finflow-primary">
          Welcome to FinFlow
        </h1>
        <p className="mt-4 text-lg text-finflow-dark max-w-2xl">
          Your AI-powered accountant. Automate bookkeeping, analyze transactions, and
          generate SARS-ready tax records in minutes.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 px-6 py-3 bg-finflow-primary text-white rounded-lg hover:bg-teal-700 transition"
        >
          Go to Dashboard
        </Link>
      </main>
      <Footer />
    </div>
  );
}
