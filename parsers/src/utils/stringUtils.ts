import { token_set_ratio } from 'fuzzball'

export function simplifyString(str: string): string {
    const symplifyedString = str
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

    return symplifyedString;
}

export function wordCount(str: string): number {
    const count = str.split(' ').length;
    return count;
    
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

