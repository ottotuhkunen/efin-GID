const atcToKmlMapping = [
    [["EFRO_TWR", "EFRO__TWR"], ["EFRO CTR"]],
    [["EFRO_R_TWR", "EFRO_APP", "EFRO__APP"], ["EFRO TMA"]],
    [["EFHK_E_TWR", "EFHK_TWR", "EFHK_E__TWR"], ["EFHK CTR", "ORTH", "EFHK CTR SOUTH"]],
    [["EFHK_E_APP", "EFHK_E__APP", "EFHK_APP", "EFHK__APP"], ["EFHK TMA UPPER", "EFHK TMA LOWER", "EFHK CTA WEST", "EFHK CTA EAST"]],
    [["EFHA_TWR", "EFHA__TWR"], ["EFHA CTR"]],
    [["EFHA_R_TWR", "EFHA_APP", "EFHA__APP"], ["EFHA TMA"]],
    [["EFJY_TWR", "EFJY__TWR"], ["EFJY CTR"]],
    [["EFJY_R_TWR", "EFJY_APP", "EFJY__APP"], ["EFJY TMA", "EFJY CTA"]],
    [["EFKU_TWR", "EFKU__TWR"], ["EFKU CTR"]],
    [["EFKU_R_TWR", "EFKU_APP", "EFKU__APP"], ["EFKU TMA"]],
    [["EFOU_TWR", "EFOU__TWR"], ["EFOU CTR"]],
    [["EFOU_R_TWR", "EFOU_APP", "EFOU__APP"], ["EFOU TMA", "EFOU CTR"]],
    [["EFPO_TWR", "EFPO__TWR"], ["EFPO CTR"]],
    [["EFPO_R_TWR", "EFPO_APP", "EFPO__APP"], ["EFPO TMA EAST", "EFPO TMA WEST"]],
    [["EFTP_TWR", "EFTP__TWR"], ["EFTP CTR"]],
    [["EFTP_R_TWR", "EFTP_APP", "EFTP__APP"], ["EFTP TMA EAST", "EFTP TMA WEST"]],
    [["EFTU_TWR", "EFTU__TWR"], ["EFTU CTR"]],
    [["EFTU_R_TWR", "EFTU_APP", "EFTU__APP"], ["EFTU TMA", "EFTU CTA"]],
    [["EFVA_TWR", "EFVA__TWR"], ["EFVA CTR"]],
    [["EFVA_R_TWR", "EFVA_APP", "EFVA__APP"], ["EFVA TMA", "EFVA CTA"]],
    [["EFIV_R_TWR", "EFIV_R__TWR", "EFIV_TWR", "EFIV_I_TWR", "EFIV_I__TWR"], ["EFIV TMA", "EFIV CTR"]],
    [["EFKT_R_TWR", "EFKT_R__TWR", "EFKT_TWR", "EFKT_I_TWR", "EFKT_I__TWR"], ["EFKT TMA", "EFKT CTR"]],
    [["EFMA_R_TWR", "EFMA_R__TWR", "EFMA_TWR", "EFMA__TWR"], ["EFMA TMA", "EFMA CTR"]],
    [["EFKS_P_TWR", "EFKS_P__TWR", "EFKS_TWR", "EFKS_I_TWR", "EFKS_I__TWR"], ["EFKS TMA", "EFKS CTR"]],
    [["EFJO_P_TWR", "EFJO_P__TWR", "EFJO_TWR", "EFJO__TWR"], ["EFJO TMA", "EFJO CTR"]],
    [["EFKE_P_TWR", "EFKE_P__TWR", "EFKE_TWR", "EFKE__TWR"], ["EFKE TMA", "EFKE CTR"]],
    [["EFKK_P_TWR", "EFKK_P__TWR", "EFKK_TWR", "EFKK__TWR"], ["EFKK TMA", "EFKK CTR"]],
    [["EFLP_P_TWR", "EFLP_P__TWR", "EFLP_TWR", "EFLP__TWR"], ["EFLP TMA", "EFLP CTR"]],
    [["EFUT_P_TWR", "EFUT_P__TWR", "EFUT_TWR", "EFUT__TWR"], ["EFUT TMA", "EFUT CTR"]],
    [["EFET_I_TWR", "EFET_I__TWR"], ["EFET FIZ LOWER", "EFET FIZ UPPER"]],
    [["EFKI_I_TWR", "EFKI_I__TWR"], ["EFKI FIZ LOWER", "EFKI FIZ UPPER"]],
    [["EFMI_I_TWR", "EFMI_I__TWR"], ["EFMI FIZ LOWER", "EFMI FIZ UPPER"]],
    [["EFSA_I_TWR", "EFSA_I__TWR"], ["EFSA FIZ LOWER", "EFSA FIZ UPPER"]],
    [["EFSI_I_TWR", "EFSI_I__TWR"], ["EFSI FIZ LOWER", "EFSI FIZ UPPER"]]
];


let activeKmlNames = [];

fetch('https://data.vatsim.net/v3/vatsim-data.json')
    .then(response => response.json())
    .then(data => {
        const activeAtcCodes = data.controllers.map(controller => controller.callsign);

        // Process the mapping to find which KML names correspond to active ATC codes
        activeKmlNames = [];
        Object.entries(atcToKmlMapping).forEach(([atcCode, kmlNames]) => {
            if (activeAtcCodes.some(activeCode => activeCode.startsWith(atcCode))) {
                // If the ATC code is active, add its corresponding KML names to the active list
                activeKmlNames.push(...kmlNames);
            }
        });
    })
    .catch(error => console.error('Error fetching VATSIM data:', error));


var vfrPoints = [
    // EFHK
    { name: "HAGIP", dmsCoords: ["601231N", "0245400E"], direction: "bottom-left" },
    { name: "LILJA", dmsCoords: ["601926N", "0251231E"], direction: "top-right" },
    { name: "LINTU", dmsCoords: ["602247N", "0244104E"], direction: "top-left" },
    { name: "OGELI", dmsCoords: ["601351N", "0245916E"], direction: "bottom-right" },
    { name: "OLBIB", dmsCoords: ["602704N", "0250107E"], direction: "top-right" },
    // EFTU
    { name: "EVEKE", dmsCoords: ["602356N", "0223023E"], direction: "bottom-right" },
    { name: "JUTKI", dmsCoords: ["602254N", "0220707E"], direction: "bottom-right" },
    { name: "NOUSU", dmsCoords: ["603745N", "0220317E"], direction: "top-right" },
    { name: "OJANE", dmsCoords: ["603905N", "0223309E"], direction: "top-right" },
    // EFMA
    { name: "BROON", dmsCoords: ["601307N", "0194236E"], direction: "top-left" },
    { name: "PRAST", dmsCoords: ["601235N", "0201450E"], direction: "bottom-right" },
    { name: "WINHA", dmsCoords: ["600420N", "0200737E"], direction: "bottom-right" },
    // EFPO
    { name: "MALOP", dmsCoords: ["611458N", "0215806E"], direction: "bottom-left" },
    { name: "MORHI", dmsCoords: ["612836N", "0221158E"], direction: "top-right" },
    { name: "OMULE", dmsCoords: ["613719N", "0214643E"], direction: "top-right" },
    { name: "RAUTU", dmsCoords: ["612134N", "0213859E"], direction: "bottom-left" },
    // EFTP
    { name: "LIMPU", dmsCoords: ["611303N", "0232104E"], direction: "bottom-right" },
    { name: "PUPPA", dmsCoords: ["613509N", "0234511E"], direction: "top-left" },
    { name: "PURSO", dmsCoords: ["612917N", "0231934E"], direction: "top-left" },
    { name: "ROINE", dmsCoords: ["612225N", "0240200E"], direction: "bottom-right" },
    { name: "VIILA", dmsCoords: ["611805N", "0234303E"], direction: "bottom-right" },
    // EFHA
    { name: "HIRLE", dmsCoords: ["615759N", "0242122E"], direction: "top-right" },
    { name: "PIHLA", dmsCoords: ["614442N", "0251426E"], direction: "bottom-right" },
    { name: "TALVI", dmsCoords: ["614305N", "0242345E"], direction: "bottom-right" },
    { name: "VORJO", dmsCoords: ["615938N", "0251232E"], direction: "top-right" },
    // EFUT
    { name: "HERMU", dmsCoords: ["610223N", "0271446E"], direction: "top-right" },
    { name: "LINJA", dmsCoords: ["604714N", "0263504E"], direction: "top-left" },
    { name: "OMOKI", dmsCoords: ["605919N", "0263351E"], direction: "top-left" },
    { name: "PULJU", dmsCoords: ["605053N", "0271936E"], direction: "top-right" },
    // EFLP
    { name: "KONTU", dmsCoords: ["610306N", "0283344E"], direction: "top-right" },
    { name: "ORAHO", dmsCoords: ["610520N", "0274235E"], direction: "top-left" },
    { name: "PINHO", dmsCoords: ["605427N", "0275119E"], direction: "top-left" },
    { name: "TONLE", dmsCoords: ["611248N", "0282516E"], direction: "top-right" },
    // EFMI
    { name: "LASHO", dmsCoords: ["614800N", "0271830E"], direction: "top-right" },
    { name: "LINKI", dmsCoords: ["614510N", "0273250E"], direction: "top-right" },
    { name: "NORRE", dmsCoords: ["613515N", "0270108E"], direction: "bottom-left" },
    { name: "SIRWO", dmsCoords: ["613206N", "0271702E"], direction: "bottom-left" },
    // EFSA
    { name: "APAJA", dmsCoords: ["620106N", "0283444E"], direction: "top-left" },
    { name: "HANHI", dmsCoords: ["620343N", "0290245E"], direction: "top-right" },
    { name: "IKOIN", dmsCoords: ["614637N", "0285856E"], direction: "bottom-left" },
    { name: "KUONA", dmsCoords: ["615900N", "0291639E"], direction: "top-right" },
    { name: "ROTPE", dmsCoords: ["615427N", "0283540E"], direction: "bottom-left" },
    // EFJY
    { name: "JUSPE", dmsCoords: ["623054N", "0261944E"], direction: "top-right" },
    { name: "POHJA", dmsCoords: ["623607N", "0253642E"], direction: "top-right" },
    { name: "RUOKE", dmsCoords: ["621523N", "0253641E"], direction: "bottom-left" },
    { name: "SANJA", dmsCoords: ["622511N", "0251439E"], direction: "bottom-left" },
    { name: "TAPPI", dmsCoords: ["624757N", "0254116E"], direction: "top-right" },
    { name: "TARVA", dmsCoords: ["622417N", "0260307E"], direction: "top-right" },
    { name: "TELHU", dmsCoords: ["622518N", "0244928E"], direction: "bottom-left" },
    { name: "UPULU", dmsCoords: ["620521N", "0251722E"], direction: "top-right" },
    // EFJO
    // EFKU
];   

const sectorCoordinates = [
    // EFIN Sector A
    [
        "N059.42.00.000 E023.59.31.000", "N059.54.47.000 E023.49.28.000",
        "N060.01.37.000 E023.52.14.000", "N060.08.13.000 E023.54.55.000",
        "N060.21.04.000 E024.00.12.000", "N060.26.52.000 E024.02.37.000",
        "N060.44.33.000 E024.29.08.000", "N060.47.23.000 E024.39.54.000",
        "N060.49.13.000 E024.46.56.000", "N060.49.51.000 E025.29.09.000",
        "N060.46.24.000 E025.38.04.000", "N060.41.32.000 E025.50.30.000",
        "N060.27.08.000 E026.08.00.000", "N060.20.16.000 E026.30.55.000",
        "N060.19.54.000 E027.37.41.000"
    ],
    // EFIN Sector C
    [
        "N060.01.37.000 E023.52.14.000", "N059.08.46.000 E020.44.30.000"
    ],
    // EFIN Sector D
    [
        "N059.47.22.000 E019.39.54.000", "N059.53.03.000 E019.56.03.000",
        "N059.55.50.000 E020.18.45.000", "N060.06.43.000 E021.53.59.000",
        "N060.13.54.000 E022.57.27.000", "N060.21.04.000 E024.00.12.000",
        "N060.08.13.000 E023.54.55.000", "N059.53.50.000 E022.36.13.000",
        "N059.33.16.000 E019.59.55.000"
    ],
    // EFIN Sector G
    [
    "N063.46.00.000 E021.41.31.000", "N063.26.49.000 E022.25.09.000",
    "N063.18.00.000 E022.46.40.000", "N062.34.39.000 E024.32.05.000",
    "N062.07.24.000 E024.34.25.000", "N062.04.55.000 E024.05.21.000",
    "N061.56.55.000 E024.02.58.000", "N061.43.07.000 E024.07.55.000",
    "N061.36.00.000 E024.35.52.000", "N061.14.43.000 E024.35.24.000",
    "N061.05.48.000 E023.55.02.000", "N061.03.42.000 E023.22.09.000",
    "N061.02.51.000 E023.04.18.000", "N061.05.46.000 E022.53.39.000",
    "N061.10.10.000 E022.37.31.000", "N061.29.19.000 E022.40.23.000",
    "N061.28.57.000 E022.37.28.000", "N061.31.30.000 E022.30.15.000",
    "N061.50.41.000 E021.34.40.000", "N061.46.35.000 E021.10.24.000",
    "N062.11.34.000 E019.43.36.000"
    ],
    // EFIN Sector V
    [
        "N064.41.00.000 E022.55.00.000", "N064.20.17.000 E023.53.25.000",
        "N063.50.03.000 E025.24.21.000", "N065.03.38.000 E029.37.37.000"
    ],
    // EFIN Sector H
    [
        "N066.34.22.000 E023.53.21.000", "N066.35.11.000 E024.46.42.000",
        "N066.46.23.000 E025.08.47.000", "N066.57.51.000 E025.42.42.000",
        "N066.57.18.000 E026.19.30.000", "N066.51.17.000 E026.39.17.000",
        "N066.39.42.000 E026.48.08.000", "N066.57.14.000 E029.02.16.000"
    ],
    // EFIN Sector E
    [
        "N061.14.43.000 E024.35.24.000", "N060.47.23.000 E024.39.54.000"
    ],
    [
        "N060.06.43.000 E021.53.59.000",
        "N060.23.19.000 E021.23.09.000", "N060.33.16.000 E021.21.03.000",
        "N060.43.59.000 E021.35.09.000", "N060.46.27.000 E022.08.01.000",
        "N060.46.26.000 E022.17.07.000", "N061.05.46.000 E022.53.39.000"
    ],
    // EFIN Sector L
    [
        "N060.46.24.000 E025.38.04.000",
        "N061.33.18.000 E026.29.42.000", "N061.54.53.000 E026.50.49.000",
        "N061.42.01.000 E027.57.19.000", "N061.25.28.000 E029.26.39.000"
    ],
    // EFIN Sector", "
    [
        "N061.54.53.000 E026.50.49.000", "N062.07.14.000 E026.34.35.000",
        "N062.24.37.000 E026.33.39.000", "N062.31.26.000 E026.18.34.000",
        "N062.39.50.000 E025.59.43.000", "N063.11.16.000 E026.32.41.000",
        "N063.06.27.000 E027.02.41.000", "N063.11.45.000 E027.01.36.000",
        "N063.21.10.000 E027.16.29.000", "N063.25.02.000 E027.36.40.000",
        "N063.23.50.000 E027.54.58.000", "N063.18.33.000 E028.11.31.000",
        "N063.38.59.000 E029.06.12.000", "N063.44.10.000 E029.36.28.000",
        "N063.45.26.000 E029.58.19.000"
    ],
    // EFIN Sector M
    [
        "N062.34.39.000 E024.32.05.000", "N062.42.51.000 E024.50.07.000",
        "N062.48.03.000 E025.10.41.000", "N062.48.34.000 E025.39.51.000",
        "N062.39.50.000 E025.59.43.000"
    ],
    // EFIN Sector K
    [
        "N061.36.00.000 E024.35.52.000", "N061.37.31.000 E025.30.18.000",
        "N061.33.18.000 E026.29.42.000"
    ]
].map(sector => sector.map(coord => {
    const [lat, lon] = coord.split(' ');
    const latDMS = lat.substring(1).split('.');
    const lonDMS = lon.substring(1).split('.');
    const latDecimal = parseInt(latDMS[0]) + parseInt(latDMS[1])/60 + parseInt(latDMS[2])/3600;
    const lonDecimal = parseInt(lonDMS[0]) + parseInt(lonDMS[1])/60 + parseInt(lonDMS[2])/3600;
    return [latDecimal, lonDecimal];
}));

const firCoordinates = [
    [
        "N060.12.01.000 E027.17.35.000", "N060.08.00.000 E026.33.00.000",
        "N059.58.30.000 E026.06.42.000", "N059.53.00.000 E025.52.00.000",
        "N059.54.30.000 E025.20.00.000", "N059.53.00.000 E024.51.00.000",
        "N059.42.00.000 E023.59.31.000", "N059.25.14.000 E022.44.49.000",
        "N059.13.55.000 E021.56.48.000", "N059.00.00.000 E021.00.00.000",
        "N059.15.24.000 E020.32.39.000", "N059.33.46.000 E019.58.59.000",
        "N060.11.30.000 E019.05.12.000"
    ],
    [
        "N060.11.30.000 E019.05.12.000", "N060.18.03.000 E019.07.56.000",
        "N061.00.00.000 E019.19.05.000", "N061.40.00.000 E019.30.00.000",
        "N063.10.00.000 E020.10.00.000", "N063.28.30.000 E020.40.00.000",
        "N063.37.00.000 E021.30.00.000", "N064.41.00.000 E022.55.00.000",
        "N065.31.48.000 E024.08.24.000"
    ],
    // Polygon coordinates
    [
        "N065.31.48.000 E024.08.24.000", "N065.35.41.000 E024.08.59.000", 
        "N065.52.25.000 E024.08.09.000", "N065.58.04.000 E024.02.13.000", 
        "N066.03.49.000 E023.58.16.000", "N066.09.17.000 E023.55.18.000", 
        "N066.10.44.000 E023.48.59.000", "N066.15.51.000 E023.40.39.000", 
        "N066.22.48.000 E023.40.09.000", "N066.26.37.000 E023.38.11.000", 
        "N066.33.40.000 E023.53.00.000", "N066.45.50.000 E023.52.51.000", 
        "N066.49.51.000 E024.00.25.000", "N067.02.11.000 E023.42.47.000", 
        "N067.10.20.000 E023.34.23.000", "N067.16.19.000 E023.36.51.000", 
        "N067.17.28.000 E023.45.16.000", "N067.20.20.000 E023.48.33.000", 
        "N067.26.09.000 E023.46.05.000", "N067.27.33.000 E023.27.58.000", 
        "N067.30.35.000 E023.24.30.000", "N067.37.41.000 E023.32.44.000", 
        "N067.41.38.000 E023.29.07.000", "N067.51.50.000 E023.30.46.000", 
        "N067.53.18.000 E023.38.49.000", "N067.58.03.000 E023.38.50.000", 
        "N068.03.10.000 E023.24.10.000", "N068.09.15.000 E023.17.54.000", 
        "N068.08.16.000 E023.09.50.000", "N068.14.53.000 E023.08.11.000", 
        "N068.18.43.000 E023.03.04.000", "N068.23.42.000 E022.48.44.000", 
        "N068.23.32.000 E022.44.17.000", "N068.24.12.000 E022.40.40.000", 
        "N068.26.12.000 E022.38.02.000", "N068.25.43.000 E022.33.15.000", 
        "N068.27.53.000 E022.23.31.000", "N068.29.13.000 E022.02.06.000", 
        "N068.33.01.000 E021.57.39.000", "N068.35.29.000 E021.49.54.000",
        "N068.35.40.000 E021.42.00.000", "N068.39.31.000 E021.38.42.000", 
        "N068.41.29.000 E021.26.01.000", "N068.45.44.000 E021.22.53.000", 
        "N068.50.09.000 E021.09.52.000", "N068.54.27.000 E021.00.00.000", 
        "N068.57.02.000 E020.53.43.000", "N069.20.03.000 E020.46.37.000", 
        "N069.21.26.000 E020.33.17.000", "N069.28.24.000 E020.42.50.000", 
        "N069.03.07.000 E021.03.16.000", "N069.06.42.000 E021.07.13.000", 
        "N069.10.52.000 E021.01.08.000", "N069.13.33.000 E021.01.08.000", 
        "N069.18.45.000 E021.17.07.000", "N069.16.22.000 E021.38.12.000", 
        "N068.57.59.000 E022.09.51.000", "N068.49.54.000 E022.20.04.000", 
        "N068.43.32.000 E022.22.02.000", "N068.44.47.000 E022.31.06.000", 
        "N068.41.58.000 E023.02.15.000", "N068.38.19.000 E023.10.10.000", 
        "N068.40.10.000 E023.18.24.000", "N068.43.03.000 E023.39.30.000", 
        "N068.49.44.000 E023.45.26.000", "N068.47.49.000 E024.08.20.000", 
        "N068.43.53.000 E024.15.35.000", "N068.38.44.000 E024.46.34.000", 
        "N068.34.03.000 E024.51.21.000", "N068.39.06.000 E025.06.40.000", 
        "N068.48.20.000 E025.09.28.000", "N068.54.27.000 E025.28.16.000", 
        "N068.53.55.000 E025.37.09.000", "N069.01.33.000 E025.46.33.000", 
        "N069.14.24.000 E025.42.26.000", "N069.20.04.000 E025.44.44.000", 
        "N069.24.14.000 E025.50.01.000", "N069.33.19.000 E025.51.10.000", 
        "N069.37.10.000 E025.58.35.000", "N069.41.10.000 E025.54.57.000", 
        "N069.47.47.000 E026.13.25.000", "N069.56.35.000 E026.27.25.000", 
        "N069.57.02.000 E026.50.20.000", "N069.54.56.000 E027.01.02.000", 
        "N069.57.46.000 E027.16.32.000", "N070.04.48.000 E027.34.39.000", 
        "N070.05.29.000 E027.58.23.000", "N069.53.04.000 E028.20.38.000", 
        "N069.49.26.000 E028.25.54.000", "N069.41.58.000 E029.07.46.000", 
        "N069.29.16.000 E029.19.38.000", "N069.24.49.000 E029.13.12.000", 
        "N069.14.03.000 E028.49.09.000", "N069.03.33.000 E028.55.05.000"
    ]


].map(sector => sector.map(coord => {
    const [lat, lon] = coord.split(' ');
    const latDMS = lat.substring(1).split('.');
    const lonDMS = lon.substring(1).split('.');
    const latDecimal = parseInt(latDMS[0]) + parseInt(latDMS[1])/60 + parseInt(latDMS[2])/3600;
    const lonDecimal = parseInt(lonDMS[0]) + parseInt(lonDMS[1])/60 + parseInt(lonDMS[2])/3600;
    return [latDecimal, lonDecimal];
}));

    