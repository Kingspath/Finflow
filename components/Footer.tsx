import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-finflow-dark text-gray-300 py-10 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo / About */}
        <div>
          <h3 className="text-white text-xl font-bold">FinFlow</h3>
          <p className="mt-2 text-sm">
            AI-powered accounting for modern businesses. Automate financial
            workflows and generate SARS-ready reports.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#features" className="hover:text-white">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="text-white font-semibold mb-3">Connect</h4>
          <div className="flex gap-4 text-xl">
            <a href="#" aria-label="Twitter" className="hover:text-white">
              🐦
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              💼
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              📸
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
        © {new Date().getFullYear()} FinFlow. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
