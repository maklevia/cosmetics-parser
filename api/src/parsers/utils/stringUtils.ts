import { token_set_ratio } from 'fuzzball'

/**
 * Simplifies string by removing accents and lower casing it to optimize search
 * Example: L'Oréal  will be returned as l'oreal 
 */
export function simplifyString(str: string): string {
    const simplifiedString = str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

    return simplifiedString;
}

export function wordCount(str: string): number {
    const count = str.split(' ').length;
    return count;
    
}

/**
 * Normalizes a variant value for cross-store comparison.
 * Example: "100 мл" and "100ml" become "100ml".
 */
export function normalizeVariantValue(value: string): string {
    return simplifyString(value)
        .replace(/\s+/g, '')
        .replace(/,/g, '.')
        .replace(/мл\./g, 'ml')
        .replace(/гр\./g, 'g')
        .replace(/мл/g, 'ml')
        .replace(/гр/g, 'g')
        .replace(/г/g, 'g');
}

function checkStringSimilarity(str1: string, str2: string): boolean {
    str1 = simplifyString(str1);
    str2 = simplifyString(str2);
    const stringSimilarityCoef: number  = token_set_ratio(str1, str2);

    if (stringSimilarityCoef > 90) {
        return true;
    } else {
        return false;
    }
}

export function checkProductNamesSimilarity(productName1: string, productName2: string, brandName1: string, brandName2: string): boolean {
    const brandSimilarity: boolean = checkStringSimilarity(brandName1, brandName2);
    if (!brandSimilarity) {
        return false;
    }

    const nameSimilarity: boolean = checkStringSimilarity(productName1, productName2);
    if (!nameSimilarity) {
        return false;
    }

    return true;
}

const CATEGORY_SUFFIXES = [
    'парфумована вода жіноча',
    'парфумована вода чоловіча',
    'парфюмерна вода жіноча',
    'парфюмерна вода чоловіча',
    'туалетна вода жіноча',
    'туалетна вода чоловіча',
    'парфумована вода',
    'парфюмерна вода',
    'туалетна вода',
    'помада для губ',
];

/**
 * Removes trailing store-specific category words from a product name.
 * Example: "CK Eternity for Women Парфумована вода жіноча" becomes
 * "CK Eternity for Women".
 */
export function stripCategorySuffix(productName: string): string {
    const simplifiedName = simplifyString(productName);

    for (const suffix of CATEGORY_SUFFIXES) {
        if (simplifiedName.endsWith(suffix)) {
            return productName
                .slice(0, productName.length - suffix.length)
                .trim();
        }
    }

    return productName;
}

/**
 * Returns a 0-100 similarity score for two products.
 * Returns 0 when brands do not match.
 */
export function productNamesSimilarityScore(productName1: string, productName2: string, brandName1: string, brandName2: string): number {
    const brandScore: number = token_set_ratio(
        simplifyString(brandName1),
        simplifyString(brandName2),
    );

    if (brandScore <= 90) {
        return 0;
    }

    return token_set_ratio(
        simplifyString(productName1),
        simplifyString(productName2),
    );
}
