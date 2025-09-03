import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center p-8">
      <h1 className="text-5xl font-bold text-finflow-primary">Welcome to FinFlow</h1>
      <p className="mt-4 text-lg max-w-xl">
        Your AI-powered accountant. Automate bookkeeping, analyze transactions,
        and generate SARS-ready tax records in minutes.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 px-6 py-3 bg-finflow-primary text-white rounded-lg hover:bg-teal-700 transition"
      >
        Go to Dashboard
      </Link>
    </main>
  );
}
