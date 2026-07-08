import type { Metadata } from "next";
import "./globals.css";
import { DataProvider } from "@/context/DataProvider";
import { AuthProvider } from "@/context/AuthContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "Badan Penanggulangan Bencana Daerah Kota Probolinggo",
  description: "Aplikasi manajemen logistik dan inventaris Badan Penanggulangan Bencana Daerah",
  icons: {
    icon: "/pd.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>
          <DataProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </DataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
