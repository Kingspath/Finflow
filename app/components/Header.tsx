import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-finflow-primary">FinFlow</span>
        </Link>
        <nav className="space-x-6 text-finflow-dark">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/about">About</Link>
        </nav>
      </div>
    </header>
  );
}
