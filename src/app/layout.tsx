import { AuthGoogleProvider } from "@/hooks/useAuthGoogle";
import "./globals.css";
import { Inter } from "next/font/google";
import { RafflesProvider } from "@/hooks/useRaffles";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Minha Rifa | EIFOL",
  description: "Nos apoie a ir para o EIFOL.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGoogleProvider>
      <RafflesProvider>
        <html lang="pt-BR">
          <body className={`${inter.className} bg-[url(/bg.png)] bg-no-repeat bg-cover bg-center`}>{children}</body>
        </html>
      </RafflesProvider>
    </AuthGoogleProvider>
  );
}
