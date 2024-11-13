export function decodeBase64(str: string): string {
  try {
    return decodeURIComponent(atob(str));
  } catch (e) {
    console.error('Erreur de décodage base64:', e);
    return str;
  }
}
