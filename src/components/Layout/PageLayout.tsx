import Head from "next/head";
import Navbar from "../Navbar";
import CookieConsent from "react-cookie-consent";
import Link from "next/link";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Head>
        <title>Business card generator</title>
        <meta name="description" content="As seen in The Office" />
      </Head>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-purple-600 bg-gradient-to-br from-rose-500 p-4">
        {children}
      </div>
      <CookieConsent>
        This website uses cookies to enhance the user experience. By continue
        navigating you accept our{" "}
        <Link className="underline" href={"/tc"}>
          Terms and Conditions
        </Link>{" "}
        and{" "}
        <Link className="underline" href={"/privacy"}>
          Privacy Policy
        </Link>
        .
      </CookieConsent>
    </main>
  );
};

export default PageLayout;
