'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut(); // Chiude la sessione su Supabase
    router.push('/'); // Ti rimanda alla Vetrina
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* LA BARRA IN ALTO */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center mb-0">
        <Link href="/dashboard" className="font-bold text-xl text-blue-600 hover:opacity-80">
          QRArchive
        </Link>
        
        {/* Il cerchietto di Logout */}
        <button 
          onClick={handleLogout}
          title="Disconnetti"
          className="w-10 h-10 rounded-full bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 flex items-center justify-center font-bold transition-colors text-sm"
        >
          Esci
        </button>
      </nav>

      {/* IL CONTENUTO DELLA PAGINA (Lista o Creazione) */}
      <main>
        {children}
      </main>
      
    </div>
  );
}