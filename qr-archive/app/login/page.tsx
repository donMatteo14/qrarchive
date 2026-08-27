'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react'; // Aggiungi questo in cima al file tra gli import

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Controllo se l'utente è già loggato
    useEffect(() => {
        const controllaSeLoggato = async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
            router.push('/dashboard'); // Se sei già dentro, vai alla dashboard!
        }
        };
        controllaSeLoggato();
    }, [router]);
  // Funzione per REGISTRARSI
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      alert(`Errore di registrazione: ${error.message}`);
    } else {
      alert('Registrazione completata! Ora sei dentro.');
      router.push('/dashboard/create'); // Ti manda alla pagina di creazione QR
    }
    setIsLoading(false);
  };

  // Funzione per ACCEDERE
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert(`Errore di accesso: credenziali errate.`);
    } else {
      router.push('/dashboard/create'); // Ti manda alla pagina di creazione QR
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Benvenuto</h1>
        <p className="text-gray-500 mb-6 text-sm">Accedi o registrati per gestire i tuoi QR Code.</p>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="La tua password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Accedi
            </button>
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Registrati
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}