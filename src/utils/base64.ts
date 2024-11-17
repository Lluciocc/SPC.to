export function decodeBase64(str: string): string {
  try {
    const binaryString = atob(str);
    const decoded = new TextDecoder('utf-8').decode(new Uint8Array([...binaryString].map(char => char.charCodeAt(0))));
    return decoded;
  } catch (e) {
    console.error('Erreur de décodage base64:', e);
    return str;
  }
}

/* old function
export function decodeBase64(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    console.error('Erreur de décodage base64:', e);
    return str;
  }
}
*/