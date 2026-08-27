'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Controlliamo se l'utente è già loggato
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push('/dashboard'); // Se loggato, salta la vetrina
      } else {
        setIsLoading(false); // Altrimenti mostra la vetrina
      }
    };
    checkUser();
  }, [router]);

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Caricamento...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
      
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          I Tuoi <span className="text-blue-600">QR Code</span>, Sempre Aggiornati.
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Crea QR code dinamici per i tuoi menù, documenti o immagini. 
          Carica la tua risorsa, stampa il QR e aggiorna il file in futuro senza dover mai cambiare il codice stampato.
        </p>
        
        <Link 
          href="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:scale-105 text-lg"
        >
          Inizia Gratis / Accedi
        </Link>
      </div>

    </div>
  );
}