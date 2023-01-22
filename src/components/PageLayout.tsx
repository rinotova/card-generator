import Head from "next/head";
import NavBar from "./Navbar";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-yellow-200">
      <NavBar />
      <main className="mx-auto max-w-screen-md">{children}</main>
    </div>
  );
};

export default PageLayout;
