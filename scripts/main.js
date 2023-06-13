const urlGoogleSheetCities =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFSUBM7qAvxiUMdVCvQ3LD1pjDjh5mhcQw5_1eobmbdTzni4tOnlfkAyef7k2Vf_HLMFNf4ip-CyXe/pub?gid=0&single=true&output=csv";

let orangeCountyCitiesUpdated;

const getData = () => {
  Papa.parse(urlGoogleSheetCities, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function (results) {
      const sheetData = results.data;

      const updatedFeatures = orangeCountyCities.features.map((featureObj) => {
        const found = sheetData.find(
          (sheetObj) =>
            parseInt(sheetObj.id_city) === featureObj.properties.id_city
        );

        if (found) {
          return {
            ...featureObj,
            properties: { ...featureObj.properties, ...found },
          };
        } else {
          return {
            ...featureObj,
          };
        }
      });

      orangeCountyCitiesUpdated = {
        type: "FeatureCollection",
        name: "orange_counties_cities_simplified_w_data",
        crs: {
          type: "name",
          properties: {
            name: "urn:ogc:def:crs:EPSG::2230",
          },
        },
        features: updatedFeatures,
      };

      drawMap();
    },
  });
};

getData();

const drawMap = () => {
  // EPSG:2230 NAD83 / California zone 6 (ftUS)
  const crs2230 = new L.Proj.CRS(
    "EPSG:2230",
    "+proj=lcc +lat_1=33.88333333333333 +lat_2=32.78333333333333 +lat_0=32.16666666666666 +lon_0=-116.25 +x_0=2000000.0001016 +y_0=500000.0001016001 +ellps=GRS80 +datum=NAD83 +to_meter=0.3048006096012192 +no_defs",
    {
      origin: [0, 0],
      resolutions: [320],
    }
  );

  const map = L.map("map", {
    crs: crs2230,
    fullScreenControl: false,
    dragging: false,
    boxZoom: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    zoomControl: false,
    attributionControl: false,
  }).setView([33.68, -117.75], 0);

  const styleCommon = {
    color: "#ffffff",
    weight: 0.5,
    fillOpacity: 1,
    opacity: 1,
  };

  function colorByCoverage(a) {
    return a === "yes" ? "#8b0303" : "#4e4e50";
  }

  function styleDefault() {
    return {
      fillColor: "#4e4e50",
      ...styleCommon,
    };
  }

  const properties = orangeCountyCitiesUpdated?.features[0]?.properties;

  const listPartners = Object.keys(properties).filter(
    (item) => ["CITY", "OBJECTID", "city", "id_city"].includes(item) === false
  );

  const baseLayers = {};

  function onEachFeatureCity(feature, layer) {
    let popupContent =
      '<p class="popup-text">' + feature.properties.CITY + "</p>";
    layer.bindPopup(popupContent, { closeButton: true });
  }

  const layerCities = L.Proj.geoJson(orangeCountyCitiesUpdated, {
    style: styleDefault,
    onEachFeature: onEachFeatureCity,
  }).addTo(map);

  listPartners.forEach((partner, index) => {
    const styleFunction = function (feature) {
      return {
        fillColor: colorByCoverage(feature.properties[partner]),
        ...styleCommon,
      };
    };

    const layerCitiesPartner = L.Proj.geoJson(orangeCountyCitiesUpdated, {
      style: styleFunction,
      onEachFeature: onEachFeatureCity,
    });

    baseLayers[partner] = layerCitiesPartner;
  });

  const layerControl = L.control
    .layers(baseLayers, {}, { collapsed: false, position: "topright" })
    .addTo(map);

  L.Control.Watermark = L.Control.extend({
    onAdd: function (map) {
      var img = L.DomUtil.create("img");
      img.src = "images/logo_harbor_institute.jpeg";
      img.style.width = "300px";
      return img;
    },
  });

  L.control.watermark = function (opts) {
    return new L.Control.Watermark(opts);
  };

  L.control.watermark({ position: "bottomleft" }).addTo(map);
};
