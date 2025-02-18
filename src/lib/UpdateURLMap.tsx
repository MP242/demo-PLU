export function updateURLMap(key:string, value: string, router: any, searchParams: any) {
    const params = new URLSearchParams(searchParams?.toString());
    if (key === "region") {
        params.set('region', value);
        params.delete('departement');
        params.delete('arrondissement');
        params.delete('city');
        params.delete('quartier');
        if (value === "La Réunion") {
            params.set('departement', "La Réunion");
        }
    }
    if (key === "departement") {
        params.set('departement', value);
        params.delete('arrondissement');
        params.delete('city');
        params.delete('quartier');
    }
    if (key === "arrondissement") {
        params.set('arrondissement', value);
        params.delete('city');
        params.delete('quartier');
    }
    if (key === "city") {
        params.set('city', value);
        params.delete('quartier');
    }
    router.replace('?' + params.toString());
}
