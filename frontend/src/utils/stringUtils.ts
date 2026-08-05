import { StoreName } from "@fe/types/store.typedefs";

export function formatStoreName(storeName: StoreName): string {
    switch (storeName) {
        case StoreName.Eva: return 'eva.ua';
        case StoreName.Makeup: return 'Makeup.ua';
        case StoreName.Notino: return 'Notino.ua';
    }
}

export function decodeHtmlEntities(text: string): string {
    if (!text) return text;
    return text
      .replace(/&amp;/g, '&')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
}