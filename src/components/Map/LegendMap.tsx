"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L, { Control } from "leaflet";
import "./LegendMap.css";
import { getColor } from "@/lib/GetColorLegend";

const LegendMap = () => {
  const map = useMap();

  useEffect(() => {
    const legend: Control = new L.Control({ position: "bottomleft" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const grades = [0, 0.5, 1, 2, 3, 4, 5];
      let labels = [];
      let from, to;

      labels.push(
        // "<h1>Indice de confiance</h1>"
        "<h1>Rapport PLU <br> Photovoltaïque<br> Accepté/refusé</h1>"
      );
      labels.push('<i style="background:' + getColor(0) + '"></i> 0');

      for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
          '<i style="background:' +
            getColor(from + 1) +
            '"></i> ' +
            from +
            (to ? "&ndash;" + to : "+")
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);

    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
};

export default LegendMap;
