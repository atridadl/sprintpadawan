import { ClerkProvider } from "@clerk/nextjs";
import Footer from "~/app/_components/Footer";
import Navbar from "~/app/_components/Navbar";
import "~/styles/globals.css";
import Provider from "./_trpc/Provider";

export const metadata = {
  title: "Next.js 13 with Clerk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-[100%] w-[100%] fixed overflow-y-auto">
        <body className="block h-[100%]">
          <Navbar title="Sprint Padawan" />
          <div className="flex flex-row items-center justify-center min-h-[calc(100%-114px)]">
            <Provider>{children}</Provider>
          </div>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}