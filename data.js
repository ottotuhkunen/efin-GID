const atcToKmlMapping = [
    [["EFRO_TWR", "EFRO__TWR"], ["EFRO CTR"]],
    [["EFRO_R_TWR", "EFRO_APP", "EFRO__APP"], ["EFRO TMA"]],
    [["EFHK_E_TWR", "EFHK_TWR", "EFHK_E__TWR"], ["EFHK CTR NORTH", "EFHK CTR SOUTH"]],
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