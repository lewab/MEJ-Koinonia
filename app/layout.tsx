import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';


export const metadata: Metadata = {
  title: 'MEJ Connect',
  description: 'Une plateforme numérique moderne pour le Mouvement Eucharistique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}