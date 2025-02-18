"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { getProspects } from "@/action/ManageProspect";
import { GeoJSON } from "react-leaflet";
import * as L from "leaflet";
import { ProspectsItem } from "@/type";
import { getColor } from "@/lib/GetColorLegend";
import { updateURLMap } from "@/lib/UpdateURLMap";
import "./Marker.css";

interface MapPrors {
  geo: any;
  mapRef: any;
}

const geoJSONStyle = {
  fillColor: "transparent",
  weight: 4,
  opacity: 0.2,
  color: "black",
  dashArray: "4",
  fillOpacity: 0.2,
};

const MapContent = ({ geo, mapRef }: MapPrors) => {
  const searchParams = useSearchParams();
  // const [prospects, setProspects] = useState<ProspectsItem[] | null>(null);
  const router = useRouter();
  const [Currentlevel, setLevel] = useState<string | null>("region");
  const map = useRef<any>(null);
  const [infoControl, setInfoControl] = useState<any>(null);
  const info: any = new L.Control();

  info.onAdd = function (map: any) {
    this._div = L.DomUtil.create("div", "info-control");
    this.update();
    return this._div;
  };
  info.update = function (props: any) {
    let infoContent = "Passer la souris sur une zone";

    if (props) {
      const isCommuneLevel = props?.level === "Quartier";
      const statusContent = isCommuneLevel
        ? `Photovoltaïque : ${props.plu ? "Accepté" : "Refusé"}`
        : `Photovoltaïques acceptés: ${props.plu_accepted || 0}<br/>Photovoltaïques refusés: ${props.plu_refused || 0}`;

      infoContent = `<b>${props.nom}</b><br/>${statusContent}`;
    }

    this._div.innerHTML = `<h4>Information ${props?.level ?? ""}</h4>${infoContent}`;
  };

  useEffect(() => {
    if (mapRef.current) {
      info.addTo(mapRef.current);
    }

    setInfoControl(info);
  }, [mapRef]);

  // useEffect(() => {
  //     async function fetchGeo() {
  //         const prospects = await getProspects();
  //         console.log("prospects fetched");
  //         setProspects(prospects)
  //     }
  //     fetchGeo()
  // }, [])

  useEffect(() => {
    const region = searchParams?.get("region");
    const departement = searchParams?.get("departement");
    const arrondissement = searchParams?.get("arrondissement");
    const city = searchParams?.get("city");
    if (region === null || region === undefined || region === "Tout") {
      setLevel("region");
      return;
    }
    if (region !== null && region !== undefined && region !== "Tout") {
      setLevel("departement");
    }
    if (
      departement !== null &&
      departement !== undefined &&
      departement !== "Tout"
    ) {
      setLevel("arrondissement");
    }
    if (
      arrondissement !== null &&
      arrondissement !== undefined &&
      arrondissement !== "Tout"
    ) {
      if (region === "La Réunion") {
        setLevel("city");
      } else {
        setLevel("iris");
      }
    }
    if (city !== null && city !== undefined && city !== "Tout") {
      setLevel("iris");
    }
  }, [searchParams]);

  function handleClick(feature: any, event: L.LeafletMouseEvent) {
    // Déplacement de la caméra vers la position cliquée
    if (event?.latlng && mapRef.current) {
      const zoomLevel =
        mapRef.current.getZoom() > 8 ? mapRef.current.getZoom() : 8;
      mapRef.current.flyTo(event.latlng, zoomLevel);
    }

    if (feature?.properties?.iris_code || feature?.iris_code) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("draw", "true");
      params.set("iris", feature?.properties?.iris_code || feature?.iris_code);
      router.replace("?" + params.toString());
    } else {
      updateURLMap(
        feature?.properties?.level,
        feature?.properties?.nom,
        router,
        searchParams
      );
    }
  }

  // function getMatchingProspects(feature: any, level: string) {
  //     const matchingProspects = prospects?.filter((prospect) => {
  //         if (level === 'region') {
  //             return prospect.region === feature?.properties?.nom;
  //         }
  //         if (level === 'departement') {
  //             return prospect.departement === feature?.properties?.nom;
  //         }
  //         if (level === 'arrondissement') {
  //             return prospect.arrondissement === feature?.properties?.nom;
  //         }
  //         return prospect.iris === feature?.properties?.iris_code;
  //     });
  //     return matchingProspects;
  // }

  function checkLevel(level: string, feature: any) {
    if (level === Currentlevel) return true;
    else if (Currentlevel === "iris" && feature?.iris_code) return true;
    else return false;
  }

  function randomPluNumber() {
    return Math.floor(Math.random() * 1000);
  }

  function randomPluBoolean() {
    return Math.random() < 0.5;
  }

  return (
    <>
      {/* {geo && prospects && */}
      {geo && (
        <GeoJSON
          ref={map}
          key={geo}
          data={geo}
          style={geoJSONStyle}
          onEachFeature={(feature: any, layer: any) => {
            layer.addEventListener("click", (e: L.LeafletMouseEvent) => {
              handleClick(feature, e);
            });
            console.log(feature);
            if (feature?.iris_type === "commune") {
              console.log("commune c'est good");
            } else {
              console.log("cest pas commune pas good...");
              console.log(feature);
            }
            // const matchingProspects: any = getMatchingProspects(feature, feature?.properties?.level);
            // console.log("matchingProspects");
            // const numProspects = matchingProspects.length;

            // var fillColor: any = "#D5FFF3";
            var fillColor: any = null;
            let pluAccepted = randomPluNumber();
            let pluRefused = randomPluNumber();
            let isPluAccepted = randomPluBoolean();
            if (checkLevel(feature?.properties?.level, feature)) {
              // if(feature?.properties?.level === 'Quartier') {
              //     // fillColor = getColor(pluAccepted);
              //     fillColor = isPluAccepted ? "#D5FFF3" : "#FFD5D5";
              // } else {
              //     fillColor = getColor(pluAccepted);
              // }
              layer.setStyle({
                fillColor:
                  feature?.iris_code !== undefined
                    ? isPluAccepted
                      ? "#86DEB7"
                      : "#B10F0F"
                    : getColor(pluAccepted / pluRefused),
                // fillColor: fillColor, //rouge
                weight: 2,
                opacity: 0.5,
                // opacity: 0.2,
                color: "black",
                dashArray: "4",
                fillOpacity: feature?.iris_code !== undefined ? 1 : 0.4,
                // fillOpacity: 0.4,
              });
            }
            layer.addEventListener("mouseover", () => {
              let info: Record<string, any> = {};

              if (feature?.iris_code !== undefined) {
                info = {
                  nom: feature?.iris_name_lower,
                  level: "Quartier",
                  // plu: feature.properties.plu // Supposé existant
                  plu: isPluAccepted,
                };
              } else {
                info = {
                  nom: feature?.properties?.nom,
                  level: feature?.properties?.level,
                  plu_accepted: pluAccepted,
                  plu_refused: pluRefused,
                  // plu_accepte: feature.properties?.plu_accepte,
                  // plu_refuse: feature.properties?.plu_refuse
                };
              }

              if (info.level === "city") {
                info.plu = isPluAccepted;
                // info.plu = feature.properties.plu;
              } else {
                info.plu_accepted = pluAccepted;
                info.plu_refused = pluRefused;
                // info.plu_accepte = feature.properties?.plu_accepte;
                // info.plu_refuse = feature.properties?.plu_refuse;
              }

              infoControl.update(info);
            });
            // layer.addEventListener('mouseout', () => {
            //     layer.setStyle({
            //         fillColor: fillColor !== null ? fillColor : "#347FC4",
            //         // fillColor: fillColor !== null ? fillColor : "transparent",
            //         weight: 2,
            //         opacity: 0.2,
            //         color: 'black',
            //         dashArray: '4',
            //         fillOpacity: 0.4,
            //     });
            // })
            infoControl.update();
          }}
        />
      )}
    </>
  );
};

export default MapContent;
