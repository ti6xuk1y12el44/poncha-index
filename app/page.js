import { supabase } from './lib/supabase'

export default async function Home() {
  const { data, error } = await supabase.from('poncha_types').select('*')

  return (
    <div>
      <h1>Poncha Index</h1>
      <p>Tipos de poncha na base de dados:</p>
      <ul>
        {data?.map(type => (
          <li key={type.id}>{type.name}</li>
        ))}
      </ul>
    </div>
  )
}