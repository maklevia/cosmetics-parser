import { StoreName } from "@fe/types/store.typedefs";

export function formatStoreName(storeName: StoreName): string {
    switch (storeName) {
        case StoreName.Eva: return 'eva.ua';
        case StoreName.Makeup: return 'Makeup.ua';
        case StoreName.Notino: return 'Notino.ua';
    }
}