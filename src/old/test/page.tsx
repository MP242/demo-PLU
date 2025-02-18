import ReactMarkdown from "react-markdown";
import { TypeAnimation } from "react-type-animation";
import remarkGfm from "remark-gfm";

export default function Test() {
  const TEST_MARKDONW = `**À Cannes et ses alentours**, la pose de panneaux photovoltaïques est encadrée par le Plan Local d'Urbanisme (PLU). Voici les points clés :

### Zones concernées
- Interdiction dans les secteurs sauvegardés (Vieux Cannes) et sites classés (ex: îles de Lérins)
- Autorisation sous conditions en zones urbaines et agricoles

### Visibilité et intégration
- Installations non visibles depuis l'espace public
- Panneaux doivent épouser la pente et couleur des toitures

### Hauteur et emprise
- Ne pas dépasser la hauteur maximale autorisée
- Pas d'empiètement sur les éléments architecturaux

### Procédures
- Déclaration préalable ou permis de construire requis
- Étude d'impact visuel possible pour zones sensibles

*Pour plus de détails, consultez le [PLU de Cannes](https:www.cannes.com) ou contactez le service urbanisme.*`;
  return (
    <div className="p-4">
      <ReactMarkdown className="prose lg:prose-xl">
        {TEST_MARKDONW}
      </ReactMarkdown>
    </div>
  );
}
