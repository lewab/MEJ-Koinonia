/**
 * app/layout.tsx
 * ───────────────
 * Layout racine de l'application MEJ Connect.
 *
 * ORDRE DES PROVIDERS (important — chacun dépend du précédent) :
 *   AuthProvider            → user disponible partout (login/logout)
 *   NotificationProvider    → notifications admin en temps réel
 *   EventProvider           → événements page accueil ↔ dashboard admin
 *   EcodimProvider          → École des Disciples ↔ dashboard admin
 *   MediaProvider           → médiathèque ↔ dashboard admin
 *
 * POLICES : chargées via <link> dans <head> (pas de @import CSS)
 *   - Inter      : texte courant
 *   - Poppins    : titres h1-h6
 *   - Material Icons Round : icônes complémentaires
 *
 * MAINTENANCE :
 *   - Ajouter un contexte global : wrapper ici + ajouter le Provider dans l'ordre logique
 *   - Changer les polices : modifier les href dans <head>
 */
import type { Metadata } from 'next';
import './globals.css';

// ── Providers ────────────────────────────────────────────
import { AuthProvider }         from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { EventProvider }        from '@/context/EventContext';
import { EcoDiscipleProvider } from '@/context/EcoleDeDiscipleContext';
import { MediaProvider }        from '@/context/MediaContext';

// ── Layout ───────────────────────────────────────────────
import Header             from '@/components/Header';
import ConditionalFooter  from '@/components/ConditionalFooter';

export const metadata: Metadata = {
  title: 'MEJ Connect',
  description: 'Plateforme numérique du Mouvement Eucharistique des Jeunes',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@500;600;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Round"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        <AuthProvider>
          <NotificationProvider>
            <EventProvider>
              <EcoDiscipleProvider>
                <MediaProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex-1 w-full">
                      {children}
                    </main>
                    <ConditionalFooter />
                  </div>
                </MediaProvider>
              </EcoDiscipleProvider>
            </EventProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}