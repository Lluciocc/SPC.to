export function getRandomPhrase(): string {
    const phrases: string[] = [
      "Crois en toi, sauf pour les maths sans calculatrice.",
      "Chaque effort te rapproche de tes rêves, même si ça passe par des devoirs barbants.",
      "Ne remets pas à demain ce que tu peux réussir aujourd’hui… ou du moins essaye.",
      "Révise un peu chaque jour, ton cerveau te dira merci au bac.",
      "Les grands leaders ont tous commencé par finir leurs devoirs.",
      "Si tu n’apprends pas aujourd’hui, prépare-toi à googler toute ta vie.",
      "Un échec n’est pas la fin du monde, sauf si tu renverses ton café sur ta copie.",
      "Sois fier de tes efforts, même si ça ressemble à du gribouillage pour l’instant.",
      "Le succès, c’est 1% d’inspiration et 99% de sueur (ou de café).",
      "Ton futur est brillant… mais peut-être nettoie ta chambre d’abord."
    ];
  
    const randomIndex = Math.floor(Math.random() * phrases.length);
    return phrases[randomIndex];
  }