"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer } from "react-leaflet";
import { getRegionCache } from "@/utils/get-region";
import { getDepartementbyRegionCache } from "@/utils/get-departement";
import { getArrondissementDepartementCache } from "@/utils/get-arrondissement";
import {
  getQuartiersbyArrondissementCache,
  getQuatierbyCityCache,
} from "@/utils/get-quartier";
import LegendMap from "./LegendMap";
import MapContent from "./MapContent";
import Loading from "./Loading";
import InputChat from "./InputChat";
import { Loader2 } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import ReactMarkdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";

interface MapPrors {}

interface Message {
  id: string;
  role: string;
  content: string;
  createdAt: Date;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const Map = ({}: MapPrors) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [geo, setGeo] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const DEFAULT_CENTER: [number, number] = [46.6031, 1.8883]; // Coordonnées de la France
  const DEFAULT_ZOOM = 6;

  useEffect(() => {
    async function getGeo() {
      setIsLoading(true);
      var newGeo = await getRegionCache();
      const region = searchParams?.get("region");
      const departement = searchParams?.get("departement");
      const arrondissement = searchParams?.get("arrondissement");
      const city = searchParams?.get("city");

      if (region !== null && region !== undefined && region !== "Tout") {
        newGeo = newGeo.concat(await getDepartementbyRegionCache(region));
      }
      if (
        departement !== null &&
        departement !== undefined &&
        departement !== "Tout"
      ) {
        newGeo = newGeo.concat(
          await getArrondissementDepartementCache(departement)
        );
      }
      if (
        arrondissement !== null &&
        arrondissement !== undefined &&
        arrondissement !== "Tout"
      ) {
        newGeo = newGeo.concat(
          await getQuartiersbyArrondissementCache(arrondissement)
        );
      }
      if (city !== null && city !== undefined && city !== "Tout") {
        newGeo = newGeo.concat(await getQuatierbyCityCache(city));
      }

      setGeo(newGeo);
      setIsLoading(false);
    }
    getGeo();
  }, [searchParams]);

  const [input, setInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [audioActivated, setAudioActivated] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [IAStatus, setIAStatus] = useState("L'agent IA réfléchit...");
  const REP_MARKDONW = `**À Cannes et ses alentours**, la pose de panneaux photovoltaïques est encadrée par le Plan Local d'Urbanisme (PLU). Voici les points clés :

### Zones concernées
- **Interdiction** dans les secteurs sauvegardés (Vieux Cannes), sites classés (ex : îles de Lérins) et dans la zone UAa du PLU, qui protège le patrimoine architectural et interdit toute modification des toitures visibles
- **Autorisation** sous conditions en zones urbaines et agricoles

### Visibilité et intégration
- Installations non visibles depuis l'espace public
- Panneaux doivent épouser la pente et couleur des toitures

### Hauteur et emprise
- Ne pas dépasser la hauteur maximale autorisée
- Pas d'empiètement sur les éléments architecturaux

### Procédures
- Déclaration préalable ou permis de construire requis
- Étude d'impact visuel possible pour zones sensibles

*Pour plus de détails, consultez le [PLU de Cannes](https://www.cannes.com) ou contactez le service urbanisme.*`;

  // const [zoom, setZoom] = useState<number>(6);
  // const [posMap, setPosMap] = useState<[number, number]>([46.6031, 1.8883]);

  const DELAY_ANIMATION = 4000;

  const sendMessage = async (input: string) => {
    setIsLoadingChat(true);
    setInput("");
    setMessages([
      ...messages,
      { id: "1", role: "user", content: input, createdAt: new Date() },
    ]);
    setIsChatOpen(true);
    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA recherche la localisation...");
    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA a detecter la ville de Cannes...");
    // Remplacer setView par flyTo pour une transition animée
    mapRef.current.flyTo([43.549999, 7.01667], 11, {
      duration: 2, // Durée de l'animation en secondes
    });

    // Mise à jour de l'URL avec les nouveaux paramètres
    const newParams = new URLSearchParams(searchParams?.toString() ?? "");
    newParams.set("region", "Provence-Alpes-Côte d'Azur");
    newParams.set("departement", "Alpes-Maritimes");
    newParams.set("arrondissement", "Grasse");

    router.replace(`?${newParams.toString()}`, { scroll: false });

    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA recherche dans sa base de connaissances...");
    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA analyse les informations...");
    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA prépare sa réponse...");
    await delay(DELAY_ANIMATION);
    setIAStatus("L'agent IA répond...");
    setMessages([
      ...messages,
      { id: "1", role: "user", content: input, createdAt: new Date() },
      {
        id: "2",
        role: "assistant",
        content: REP_MARKDONW,
        createdAt: new Date(),
      },
    ]);
    setIsLoadingChat(false);
  };

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="relative h-full w-full"
      >
        <TileLayer
          attribution='&copy; <div className="bg-black">PLU AI - Austral Groupe Energie</div>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapContent geo={geo} mapRef={mapRef} />
        <AnimatePresence>
          {!isChatOpen && (
            <motion.div
              initial={{ width: 700 }}
              transition={{ duration: 0.5 }}
              exit={{ opacity: 0, width: 0 }}
              className="absolute bottom-4 left-4 right-4 w-1/2 mx-auto z-[1000]"
            >
              <InputChat
                loading={isLoadingChat}
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                audioActivated={audioActivated}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <LegendMap />
        <Loading isLoading={isLoading} />
      </MapContainer>
      {isChatOpen && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 700 }}
          transition={{ duration: 0.5 }}
          className=" relative w-1/2"
        >
          <div className="flex-grow h-full p-3 pb-20 overflow-y-auto">
            {messages.length > 0
              ? messages.map((m) => (
                  <div
                    key={m.id}
                    className={`mx-4 my-2 pt-0 flex chat ${
                      m.role === "user"
                        ? "justify-end chat-end"
                        : "justify-start chat-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col gap-1 py-0 ${m.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                      <div className="flex flex-row gap-1">
                        <span className="text-xs font-semibold first-letter:uppercase text-gray-800">
                          {m.role === "user" ? "Vous" : "Agent IA"}
                        </span>
                        <span className="text-xs text-gray-800">
                          {m.createdAt?.toLocaleTimeString()}
                        </span>
                      </div>
                      <p
                        className={`py-2 px-4 max-w-md text-sm ${
                          m.role === "user"
                            ? "bg-gray-800 text-white rounded-l-xl rounded-br-xl rounded-tr-sm"
                            : "bg-white text-black rounded-bl-sm rounded-tl-xl rounded-r-xl"
                        }`}
                      >
                        {m.role === "user" ? (
                          m.content
                        ) : (
                          <ReactMarkdown className="prose text-sm">
                            {m.content}
                          </ReactMarkdown>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              : null}
            {isLoadingChat && (
              <div className="flex flex-row gap-1">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs text-gray-800">{IAStatus}</span>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 left-0 right-4 w-full px-3 z-[1000]">
            <InputChat
              loading={isLoadingChat}
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              audioActivated={audioActivated}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Map;
