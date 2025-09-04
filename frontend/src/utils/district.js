export const districtName = {
    av: "Aveiro",
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
    ma: "Madeira"         
  };
  
  export const getDistrictName = (uf) => districtName[uf] || uf;
  