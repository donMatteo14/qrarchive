import { supabase } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function ViewQRPage(props: any) {
  // 1. Catturiamo l'ID dall'indirizzo web (es. dall'URL /view/1234...)
  const params = await props.params;
  const id = params.id;

  // 2. Cerchiamo il link del file nel database usando questo ID
  const { data, error } = await supabase
    .from('qr_codes')
    .select('file_url')
    .eq('id', id)
    .single();

  // 3. Se l'ID non esiste (o è sbagliato), mostriamo una pagina di errore gentile
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">File non trovato</h1>
        <p className="text-gray-500">Questo QR code potrebbe essere stato disattivato o non esiste.</p>
      </div>
    );
  }

  // 4. Se il file esiste, facciamo un REDIRECT ISTANTANEO!
  // L'utente non vedrà nemmeno questa pagina, verrà lanciato subito al PDF o all'immagine.
  redirect(data.file_url);
}