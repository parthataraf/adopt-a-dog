import { useState } from 'react';
import DogAdoptionContext from './DogAdoptionContext';

export default function DogAdoptionProvider({ children }) {
  const [matchId, setMatchId] = useState(null);

  return (
    <DogAdoptionContext.Provider value={{ matchId, setMatchId }}>
      {children}
    </DogAdoptionContext.Provider>
  );
}
