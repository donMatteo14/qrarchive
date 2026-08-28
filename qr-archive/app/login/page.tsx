'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // 👈 Nuovo stato per l'errore
  const router = useRouter();

  // Controllo iniziale se già loggato
  useEffect(() => {
    const controllaSeLoggato = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push('/dashboard');
      }
    };
    controllaSeLoggato();
  }, [router]);

  // Funzione per REGISTRARSI
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // Puliamo vecchi errori

    // Controllo client-side sulla lunghezza
    if (password.length < 6) {
      setErrorMsg('La password deve avere almeno 6 caratteri.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      // Se l'utente esiste già, Supabase restituisce un errore specifico
      if (error.message.includes('already registered')) {
        setErrorMsg('Questa email è già registrata. Prova ad accedere.');
      } else {
        setErrorMsg('Errore durante la registrazione. Riprova.');
      }
    } else {
      router.push('/dashboard'); 
    }
    setIsLoading(false);
  };

  // Funzione per ACCEDERE
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); // Puliamo vecchi errori

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setErrorMsg('Email o password non corretti. Riprova.');
    } else {
      router.push('/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Benvenuto</h1>
        <p className="text-gray-500 mb-6 text-sm">Accedi o registrati per gestire i tuoi QR Code.</p>

        {/* Messaggio di errore elegante */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg border border-red-200">
            {errorMsg}
          </div>
        )}

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="La tua email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Se c'è un errore, il bordo diventa rosso!
            className={`w-full p-3 border rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errorMsg ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
            required
          />
          
          <div className="text-left w-full">
            <input
              type="password"
              placeholder="La tua password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                errorMsg ? 'border-red-400 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {/* Piccolo suggerimento visivo per l'utente */}
            <p className="text-xs text-gray-400 mt-1 ml-1">Minimo 6 caratteri</p>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleLogin}
              disabled={isLoading || !email || !password} // Disabilita se i campi sono vuoti
              className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : 'Accedi'}
            </button>
            <button
              onClick={handleSignUp}
              disabled={isLoading || !email || !password}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : 'Registrati'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}