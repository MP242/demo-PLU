export function getColor(d: number): string {
    // Clampe la valeur entre 0 et 10
    const clamped = Math.max(0, Math.min(d, 5));
    
    // Couleurs de départ (rouge) et d'arrivée (vert)
    const startColor = { r: 0xf2, g: 0x07, b: 0x07 }; // #f20707
    const endColor = { r: 0x49, g: 0xff, b: 0x33 };   // #49ff33
    
    // Calcule le ratio de progression
    const ratio = clamped / 10;
    
    // Interpole chaque composante RGB
    const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);
    
    // Convertit en hexadécimal
    const toHex = (c: number) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// export function getColor(d: number): string {
//     switch (true) {
//         case d > 10:
//             return "#49ff33";
//         case d > 9:
//             return "#33ffe3";
//         case d > 8:
//             return "#3396ff";
//         case d > 7:
//             return "#FC4E2A";
//         case d > 6:
//             return "#FD8D3C";
//         case d > 5:
//             return "#FEB24C";
//         case d > 4:
//             return "#FED976";
//         case d > 3:
//             return "#FFEDA0";
//         case d > 2:
//             return "#FFEDA0";
//         case d > 1:
//             return "#f20707";
//         case d > 0:
//             return "#f20707";
//         default:
//             return "#FFFFFF";
//     }
// }
// export function getColor(d: number): string {
//     switch (true) {
//         case d > 1000:
//             return "#800026";
//         case d > 500:
//             return "#BD0026";
//         case d > 200:
//             return "#E31A1C";
//         case d > 100:
//             return "#FC4E2A";
//         case d > 50:
//             return "#FD8D3C";
//         case d > 20:
//             return "#FEB24C";
//         case d > 10:
//             return "#FED976";
//         case d > 0:
//             return "#FFEDA0";
//         default:
//             return "#FFFFFF";
//     }
// }
