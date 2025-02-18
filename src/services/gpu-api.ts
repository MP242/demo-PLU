const API_BASE = "https://www.geoportail-urbanisme.gouv.fr/api";

const REGION_NAMES: Record<string, string> = {
  "84": "Auvergne-Rhône-Alpes",
  "32": "Hauts-de-France",
  // Ajouter toutes les régions...
};

const REGION_MAPPING: Record<string, string> = {
  "01": "Auvergne-Rhône-Alpes",
  "02": "Hauts-de-France",
  // Ajouter toutes les correspondances...
};

export interface GPUFeature {
  properties: {
    du_type?: string;
    legalStatus?: string;
    approbationDate?: string;
    // Autres propriétés selon la réponse API
  };
}

export async function searchUrbanismDocuments(params: {
  documentType?: string;
  inseeCode?: string;
  bbox?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params.documentType) query.set("documentType", params.documentType);
  if (params.inseeCode) query.set("grid", params.inseeCode);
  if (params.bbox) query.set("bbox", params.bbox);
  if (params.page) query.set("page", params.page.toString());

  const response = await fetch(`${API_BASE}/document?${query}`);
  console.log(response);
  return await response.json();
}

export async function getFeaturesByLocation(lat: number, lng: number) {
  const response = await fetch(
    `${API_BASE}/feature-info/du?lon=${lng}&lat=${lat}`
  );
  return await response.json();
}

export async function getDocumentDetails(id: string) {
  const response = await fetch(`${API_BASE}/document/${id}/details`);
  return await response.json();
}

export async function getRegions() {
  const response = await fetch(`${API_BASE}/grid/departments`);
  const departments = await response.json();
  console.log(departments);

  const regionsMap = departments.reduce((acc: any, dept: any) => {
    // Utiliser le code INSEE complet du département
    const regionCode = dept.code.slice(0, 2); // Les 2 premiers caractères du code département
    if (!acc[regionCode]) {
      acc[regionCode] = {
        code: regionCode,
        name: REGION_MAPPING[regionCode] || `Région ${regionCode}`,
        departments: [],
      };
    }
    acc[regionCode].departments.push(dept);
    return acc;
  }, {});

  return Object.values(regionsMap);
}
