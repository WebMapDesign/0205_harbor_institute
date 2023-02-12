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

function stylePartner1(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_1),
    ...styleCommon,
  };
}

function stylePartner2(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_2),
    ...styleCommon,
  };
}

function stylePartner3(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_3),
    ...styleCommon,
  };
}

function stylePartner4(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_4),
    ...styleCommon,
  };
}

function stylePartner5(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_5),
    ...styleCommon,
  };
}

function stylePartner6(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_6),
    ...styleCommon,
  };
}

function stylePartner7(feature) {
  return {
    fillColor: colorByCoverage(feature.properties.partner_7),
    ...styleCommon,
  };
}

function onEachFeatureCity(feature, layer) {
  let popupContent =
    '<p class="popup-text">' + feature.properties.CITY + "</p>";
  layer.bindPopup(popupContent, { closeButton: true });
}

const layerCities = L.Proj.geoJson(test, {
  style: styleDefault,
  onEachFeature: onEachFeatureCity,
}).addTo(map);

const layerCitiesPartner1 = L.Proj.geoJson(test, {
  style: stylePartner1,
  onEachFeature: onEachFeatureCity,
});

const layerCitiesPartner2 = L.Proj.geoJson(test, {
  style: stylePartner2,
  onEachFeature: onEachFeatureCity,
});

const layerCitiesPartner3 = L.Proj.geoJson(test, {
  style: stylePartner3,
  onEachFeature: onEachFeatureCity,
});

const layerCitiesPartner4 = L.Proj.geoJson(test, {
  style: stylePartner4,
  onEachFeature: onEachFeatureCity,
});

const layerCitiesPartner5 = L.Proj.geoJson(test, {
  style: stylePartner5,
  onEachFeature: onEachFeatureCity,
});
const layerCitiesPartner6 = L.Proj.geoJson(test, {
  style: stylePartner6,
  onEachFeature: onEachFeatureCity,
});

const layerCitiesPartner7 = L.Proj.geoJson(test, {
  style: stylePartner7,
  onEachFeature: onEachFeatureCity,
});

const baseLayers = {
  VietRISE: layerCitiesPartner1,
  "Orange County Justice Fund": layerCitiesPartner2,
  "UCI Law Immigrant Rights Clinic": layerCitiesPartner3,
  "UCI Law Workers, Law, and Organzing Clinic": layerCitiesPartner4,
  "El Centro Cultural De Mexico": layerCitiesPartner5,
  "National Day Laborer Organizing Network": layerCitiesPartner6,
  "Tenayuca Labor Project": layerCitiesPartner7,
};

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
