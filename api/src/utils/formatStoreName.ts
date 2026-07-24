import { StoreName } from "@api/types/StoreName.js";

export function formatStoreName(storeName: StoreName): string {
    switch(storeName) {
        //symbol here is invisible space - for telegram to not treat it as link
        case StoreName.Eva: return 'eva.&#8203;ua';
        case StoreName.Makeup: return 'Makeup.&#8203;ua';
        case StoreName.Notino: return 'Notino.&#8203;ua';
    }
}
