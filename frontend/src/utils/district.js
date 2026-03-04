export const districtName = {
  av: "Aveiro",
  ac: "Açores",
  be: "Beja",
  br: "Braga",
  bg: "Bragança",
  cb: "Castelo Branco",
  co: "Coimbra",
  ev: "Évora",
  fa: "Faro",
  gu: "Guarda",
  le: "Leiria",
  li: "Lisboa",
  po: "Portalegre",
  pr: "Porto",
  sa: "Santarém",
  se: "Setúbal",
  vc: "Viana do Castelo",
  vr: "Vila Real",
  vi: "Viseu",
  az: "Açores",
  ma: "Madeira",
};

export const getDistrictName = (uf) => districtName[uf] || uf;

const ufName = {
  aveiro: "av",
  açores: "ac",
  beja: "be",
  braga: "br",
  bragança: "bg",
  "castelo branco": "cb",
  coimbra: "co",
  évora: "ev",
  faro: "fa",
  guarda: "gu",
  leiria: "le",
  lisboa: "li",
  portalegre: "po",
  porto: "pr",
  santarém: "sa",
  setúbal: "se",
  "viana do castelo": "vc",
  "vila real": "vr",
  viseu: "vi",
  açores: "az",
  madeira: "ma",
};

export const getUfByDistrictName = (distName) =>
  ufName[distName.toLowerCase()] || distName;
