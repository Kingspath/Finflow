import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/assets/favicon.ico" />
        <meta name="theme-color" content="#00695C" />
        <meta
          name="description"
          content="FinFlow - AI-powered Accounting & tax assistant for South African businesses."
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
