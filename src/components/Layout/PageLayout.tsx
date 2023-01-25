import Head from "next/head";
import Navbar from "../Navbar";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      <Head>
        <title>Business card generator</title>
        <meta name="description" content="As seen in The Office" />
      </Head>
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] bg-purple-600 bg-gradient-to-br from-rose-500 p-6">
        {children}
      </div>
    </main>
  );
};

export default PageLayout;
