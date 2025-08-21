import { Nunito } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Card, CardContent } from "./_components/ui/card";
import AuthProvider from "./_providers/auth";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Barber Hair",
  description: "A modern barber shop experience - Barber Hair",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${nunito.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "hsl(228, 9%, 23%)",
                color: "#fff",
                borderRadius: "9999px",
                padding: "8px 13px",
                fontSize: "14px",
              },
            }}
          />
          <footer className="w-full mt-10">
            <Card className="rounded-none">
              <CardContent className="px-5 py-6">
                <p className="text-sm text-gray-400">
                  © 2023 Copyright <span className="font-bold">FSW Barber</span>
                </p>
              </CardContent>
            </Card>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
