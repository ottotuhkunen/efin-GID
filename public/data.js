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

        activeKmlNames = [];
        Object.entries(atcToKmlMapping).forEach(([atcCode, kmlNames]) => {
            if (activeAtcCodes.some(activeCode => activeCode.startsWith(atcCode))) {
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
    { name: "ADNEX", dmsCoords: ["623321N", "0292706E"], direction: "bottom-left" },
    { name: "LOPJU", dmsCoords: ["624514N", "0295057E"], direction: "top-right" },
    { name: "POLVI", dmsCoords: ["625040N", "0291901E"], direction: "top-right" },
    { name: "SUHMU", dmsCoords: ["622931N", "0294941E"], direction: "bottom-left" },
    // EFKU
    { name: "KARJU", dmsCoords: ["624622N", "0274304E"], direction: "bottom-left" },
    { name: "KOKKO", dmsCoords: ["630809N", "0275835E"], direction: "top-right" },
    { name: "KURPI", dmsCoords: ["625540N", "0281001E"], direction: "top-right" },
    { name: "LAIVO", dmsCoords: ["625838N", "0273138E"], direction: "bottom-left" },
    { name: "UNOJE", dmsCoords: ["630525N", "0272518E"], direction: "bottom-left" },
    // EFSI
    { name: "JOKIP", dmsCoords: ["623317N", "0224435E"], direction: "bottom-left" },
    { name: "KOSSU", dmsCoords: ["624115N", "0222755E"], direction: "bottom-left" },
    { name: "KUORA", dmsCoords: ["623850N", "0231757E"], direction: "top-right" },
    { name: "TUPKU", dmsCoords: ["624951N", "0225504E"], direction: "top-right" },
    // EFVA
    { name: "LEPPE", dmsCoords: ["625933N", "0220511E"], direction: "top-right" },
    { name: "VASSO", dmsCoords: ["630928N", "0215840E"], direction: "top-right" },
    { name: "VIRJE", dmsCoords: ["625648N", "0213243E"], direction: "top-left" },
    // EFKK
    { name: "EMMET", dmsCoords: ["633729N", "0232318E"], direction: "top-right" },
    { name: "LOLHO", dmsCoords: ["635206N", "0232938E"], direction: "top-right" },
    { name: "SUNDI", dmsCoords: ["634828N", "0225340E"], direction: "bottom-left" },
    { name: "UMESE", dmsCoords: ["633546N", "0224824E"], direction: "bottom-left" },
    // EFKI
    { name: "MAINU", dmsCoords: ["640814N", "0272527E"], direction: "bottom-right" },
    { name: "NATPO", dmsCoords: ["641058N", "0280003E"], direction: "bottom-right" },
    { name: "OLULO", dmsCoords: ["642525N", "0275041E"], direction: "top-left" },
    { name: "PEHKO", dmsCoords: ["642249N", "0271758E"], direction: "top-left" },
    // EFOU
    { name: "HAURU", dmsCoords: ["644406N", "0253253E"], direction: "bottom-left" },
    { name: "SIIKA", dmsCoords: ["645047N", "0250638E"], direction: "bottom-left" },
    { name: "TASKI", dmsCoords: ["650507N", "0251857E"], direction: "top-right" },
    { name: "UNILO", dmsCoords: ["645652N", "0254044E"], direction: "top-right" },
    // EFKE
    { name: "HAKKE", dmsCoords: ["655649N", "0245358E"], direction: "top-right" },
    { name: "HAPIS", dmsCoords: ["654958N", "0241733E"], direction: "top-left" },
    { name: "OUKKI", dmsCoords: ["654029N", "0245110E"], direction: "top-right" },
    // EFKS
    { name: "AVELA", dmsCoords: ["655402N", "0290106E"], direction: "bottom-left" },
    { name: "KITKA", dmsCoords: ["661333N", "0290251E"], direction: "top-right" },
    { name: "POUSU", dmsCoords: ["654821N", "0291630E"], direction: "bottom-left" },
    { name: "RAITO", dmsCoords: ["660236N", "0283837E"], direction: "bottom-left" },
    { name: "SUINI", dmsCoords: ["660514N", "0292522E"], direction: "top-right" },
    // EFRO
    { name: "HEINU", dmsCoords: ["663032N", "0260701E"], direction: "bottom-right" },
    { name: "JERJO", dmsCoords: ["664054N", "0253916E"], direction: "top-left" },
    { name: "NILJA", dmsCoords: ["662254N", "0255224E"], direction: "bottom-right" },
    { name: "TEMMO", dmsCoords: ["663427N", "0252639E"], direction: "top-left" },
    // EFKT
    { name: "KENUS", dmsCoords: ["673611N", "0243435E"], direction: "bottom-left" },
    { name: "KUMPU", dmsCoords: ["673641N", "0251434E"], direction: "top-right" },
    { name: "LOUKI", dmsCoords: ["675316N", "0250426E"], direction: "top-right" },
    { name: "VAARA", dmsCoords: ["675151N", "0242435E"], direction: "bottom-left" },
    { name: "VENHE", dmsCoords: ["672917N", "0243858E"], direction: "bottom-left" },
    // EFIV
    { name: "HAMPI", dmsCoords: ["683817N", "0265959E"], direction: "top-left" },
    { name: "LAANI", dmsCoords: ["682610N", "0272421E"], direction: "bottom-right" },
    { name: "SILHO", dmsCoords: ["684910N", "0273148E"], direction: "top-left" },
    { name: "VASKI", dmsCoords: ["683100N", "0264906E"], direction: "bottom-left" },
    // EFET
    { name: "HIRVA", dmsCoords: ["682306N", "0230325E"], direction: "top-left" },
    { name: "JOHKA", dmsCoords: ["682450N", "0235603E"], direction: "bottom-right" },
    { name: "KATKA", dmsCoords: ["680712N", "0232248E"], direction: "bottom-right" },
    { name: "OUNAS", dmsCoords: ["681612N", "0233943E"], direction: "bottom-right" },
    { name: "TOSSA", dmsCoords: ["683105N", "0231819E"], direction: "top-left" }
];   

var tmaPoints = [
    { name: "ABKEM", dmsCoords: ["642855N", "0254841E"], direction: "top" },
    { name: "ABLOP", dmsCoords: ["680856N", "0244518E"], direction: "top-right" },
    { name: "ABMAX", dmsCoords: ["614325N", "0284117E"], direction: "top" },
    { name: "ADEDO", dmsCoords: ["624616N", "0250336E"], direction: "top" },
    { name: "ADIVO", dmsCoords: ["601751N", "0235853E"], direction: "top" },
    { name: "ADSEB", dmsCoords: ["605410N", "0281559E"], direction: "top" },
    { name: "AMASU", dmsCoords: ["622243N", "0232115E"], direction: "top" },
    { name: "AMULU", dmsCoords: ["672249N", "0242242E"], direction: "top" },
    { name: "AMUPO", dmsCoords: ["610957N", "0223817E"], direction: "top" },
    { name: "ARBEV", dmsCoords: ["613737N", "0242940E"], direction: "top" },
    { name: "ARFUT", dmsCoords: ["661902N", "0262209E"], direction: "top" },
    { name: "ARLOM", dmsCoords: ["604725N", "0274353E"], direction: "top" },
    { name: "ARVEP", dmsCoords: ["601458N", "0262357E"], direction: "top" },
    { name: "ASLUP", dmsCoords: ["652355N", "0250741E"], direction: "top-right" },
    { name: "ASPEM", dmsCoords: ["621150N", "0290603E"], direction: "top" },
    { name: "ASTUX", dmsCoords: ["623325N", "0272715E"], direction: "top" },
    { name: "ATLUL", dmsCoords: ["623357N", "0274617E"], direction: "top-right" },
    { name: "ATPEL", dmsCoords: ["632358N", "0223208E"], direction: "top" },
    { name: "ATSEN", dmsCoords: ["620437N", "0251900E"], direction: "top" },
    { name: "AXUTI", dmsCoords: ["625302N", "0210425E"], direction: "top" },
    { name: "BALTI", dmsCoords: ["595415N", "0251506E"], direction: "top" },
    { name: "BAPTU", dmsCoords: ["631704N", "0225759E"], direction: "top" },
    { name: "BEGSU", dmsCoords: ["623657N", "0214657E"], direction: "top" },
    { name: "BEVNA", dmsCoords: ["655721N", "0282256E"], direction: "top" },
    { name: "BEXUL", dmsCoords: ["653534N", "0240914E"], direction: "top" },
    { name: "BUPEG", dmsCoords: ["624711N", "0211334E"], direction: "top" },
    { name: "BURJA", dmsCoords: ["652228N", "0245631E"], direction: "top" },
    { name: "DOBAN", dmsCoords: ["594758N", "0242709E"], direction: "top" },
    { name: "DODAM", dmsCoords: ["600240N", "0191806E"], direction: "top-left" },
    { name: "DOPUD", dmsCoords: ["680829N", "0231918E"], direction: "top" },
    { name: "EBEBU", dmsCoords: ["600542N", "0202716E"], direction: "top" },
    { name: "ELSOV", dmsCoords: ["624815N", "0252107E"], direction: "top-right" },
    { name: "EMDUR", dmsCoords: ["635934N", "0233431E"], direction: "top" },
    { name: "EMPOM", dmsCoords: ["601252N", "0214240E"], direction: "top" },
    { name: "ENETI", dmsCoords: ["610429N", "0233420E"], direction: "top" },
    { name: "ERKOM", dmsCoords: ["611335N", "0274253E"], direction: "top" },
    { name: "EROKU", dmsCoords: ["620136N", "0261656E"], direction: "top" },
    { name: "ERTOP", dmsCoords: ["620138N", "0252535E"], direction: "top-right" },
    { name: "ETENA", dmsCoords: ["624944N", "0284550E"], direction: "top" },
    { name: "ETROD", dmsCoords: ["635705N", "0274819E"], direction: "top" },
    { name: "EVIMI", dmsCoords: ["671506N", "0245502E"], direction: "top" },
    { name: "EVLAK", dmsCoords: ["692150N", "0284256E"], direction: "top-right" },
    { name: "EVLIT", dmsCoords: ["610247N", "0230429E"], direction: "top" },
    { name: "EVRIG", dmsCoords: ["643337N", "0281131E"], direction: "top" },
    { name: "EXUPA", dmsCoords: ["602313N", "0230638E"], direction: "top" },
    { name: "EXUTI", dmsCoords: ["680638N", "0242059E"], direction: "top" },
    { name: "GEMKU", dmsCoords: ["613903N", "0232551E"], direction: "top" },
    { name: "GIDKI", dmsCoords: ["631718N", "0231507E"], direction: "top-right" },
    { name: "GISUX", dmsCoords: ["630212N", "0224836E"], direction: "top" },
    { name: "GOMAV", dmsCoords: ["683958N", "0231854E"], direction: "top" },
    { name: "GUBTU", dmsCoords: ["623855N", "0221157E"], direction: "top" },
    { name: "IBEVU", dmsCoords: ["654134N", "0285742E"], direction: "top" },
    { name: "IBOSU", dmsCoords: ["613712N", "0251743E"], direction: "top" },
    { name: "IBSAN", dmsCoords: ["664230N", "0250105E"], direction: "top" },
    { name: "IDEPI", dmsCoords: ["604239N", "0254739E"], direction: "top" },
    { name: "IDNIS", dmsCoords: ["610527N", "0220436E"], direction: "top-left" },
    { name: "INLEK", dmsCoords: ["651939N", "0241443E"], direction: "top" },
    { name: "IPMOT", dmsCoords: ["602711N", "0231035E"], direction: "top" },
    { name: "IXONO", dmsCoords: ["643530N", "0244107E"], direction: "top" },
    { name: "KEFFA", dmsCoords: ["611807N", "0211133E"], direction: "top" },
    { name: "KOIVU", dmsCoords: ["595041N", "0243955E"], direction: "top" },
    { name: "KUVEM", dmsCoords: ["601126N", "0235614E"], direction: "top" },
    { name: "LAPMU", dmsCoords: ["692445N", "0283156E"], direction: "top" },
    { name: "LEDUN", dmsCoords: ["595830N", "0260642E"], direction: "top" },
    { name: "LIVLU", dmsCoords: ["602035N", "0212750E"], direction: "top" },
    { name: "LUMME", dmsCoords: ["623837N", "0244957E"], direction: "top" },
    { name: "LUSAG", dmsCoords: ["682039N", "0262137E"], direction: "top" },
    { name: "MAMOP", dmsCoords: ["603430N", "0255904E"], direction: "top" },
    { name: "MAROM", dmsCoords: ["602652N", "0240237E"], direction: "top" },
    { name: "MARXO", dmsCoords: ["663617N", "0264456E"], direction: "top" },
    { name: "MIKNU", dmsCoords: ["642639N", "0252614E"], direction: "top" },
    { name: "MOHNI", dmsCoords: ["595349N", "0253506E"], direction: "top" },
    { name: "NANIP", dmsCoords: ["632146N", "0271936E"], direction: "top" },
    { name: "NAPUN", dmsCoords: ["604941N", "0251622E"], direction: "top" },
    { name: "NAXEP", dmsCoords: ["605910N", "0263230E"], direction: "top" },
    { name: "NEBAB", dmsCoords: ["610634N", "0225048E"], direction: "top" },
    { name: "NEKUX", dmsCoords: ["685834N", "0274720E"], direction: "top" },
    { name: "NEMGU", dmsCoords: ["662024N", "0244139E"], direction: "top" },
    { name: "NEPEK", dmsCoords: ["604433N", "0242908E"], direction: "top" },
    { name: "NEPIX", dmsCoords: ["660630N", "0250727E"], direction: "top" },
    { name: "NESUK", dmsCoords: ["634425N", "0223230E"], direction: "top" },
    { name: "NIFOT", dmsCoords: ["610838N", "0213907E"], direction: "top" },
    { name: "NIRPU", dmsCoords: ["604627N", "0220801E"], direction: "top" },
    { name: "NISPO", dmsCoords: ["624254N", "0270726E"], direction: "top" },
    { name: "NISVI", dmsCoords: ["610734N", "0240255E"], direction: "top" },
    { name: "NUBVU", dmsCoords: ["651204N", "0254511E"], direction: "top" },
    { name: "NUNTO", dmsCoords: ["600501N", "0235337E"], direction: "top" },
    { name: "OBISO", dmsCoords: ["662101N", "0283915E"], direction: "top" },
    { name: "ODRUB", dmsCoords: ["640414N", "0265422E"], direction: "top" },
    { name: "ODUSA", dmsCoords: ["613101N", "0225057E"], direction: "top" },
    { name: "OGLOB", dmsCoords: ["595559N", "0192744E"], direction: "bottom-left" },
    { name: "OLNOP", dmsCoords: ["661119N", "0244219E"], direction: "top" },
    { name: "OSDIL", dmsCoords: ["614251N", "0215737E"], direction: "top" },
    { name: "OSLIT", dmsCoords: ["665145N", "0252423E"], direction: "top" },
    { name: "OTKAP", dmsCoords: ["610446N", "0272323E"], direction: "top" },
    { name: "OTKIL", dmsCoords: ["602830N", "0212204E"], direction: "top" },
    { name: "OTLUD", dmsCoords: ["620939N", "0250211E"], direction: "top" },
    { name: "OTVEM", dmsCoords: ["650819N", "0241322E"], direction: "top" },
    { name: "PEXEN", dmsCoords: ["595447N", "0234928E"], direction: "top" },
    { name: "POKAS", dmsCoords: ["595853N", "0192333E"], direction: "top-left" },
    { name: "RASRU", dmsCoords: ["631401N", "0210002E"], direction: "top" },
    { name: "REBGO", dmsCoords: ["615109N", "0271030E"], direction: "top" },
    { name: "RENVI", dmsCoords: ["660434N", "0253154E"], direction: "top" },
    { name: "RERBU", dmsCoords: ["631356N", "0221513E"], direction: "top" },
    { name: "RERGA", dmsCoords: ["622714N", "0262753E"], direction: "top" },
    { name: "RIDVI", dmsCoords: ["692323N", "0283603E"], direction: "top" },
    { name: "RIKUM", dmsCoords: ["595815N", "0192429E"], direction: "left" },
    { name: "RISEV", dmsCoords: ["623153N", "0303014E"], direction: "top" },
    { name: "RIVUM", dmsCoords: ["614003N", "0285105E"], direction: "top-right" },
    { name: "ROGTU", dmsCoords: ["612931N", "0205811E"], direction: "top" },
    { name: "ROTKO", dmsCoords: ["665738N", "0255740E"], direction: "top" },
    { name: "RUNGA", dmsCoords: ["594459N", "0194327E"], direction: "left" },
    { name: "SIGGE", dmsCoords: ["612221N", "0282529E"], direction: "top" },
    { name: "SOTIT", dmsCoords: ["681411N", "0271140E"], direction: "top" },
    { name: "SOTUP", dmsCoords: ["601720N", "0203726E"], direction: "top" },
    { name: "SUBUG", dmsCoords: ["624129N", "0212229E"], direction: "top" },
    { name: "SUVIB", dmsCoords: ["642555N", "0250744E"], direction: "top" },
    { name: "TEVRU", dmsCoords: ["604916N", "0244929E"], direction: "top" },
    { name: "TUGPU", dmsCoords: ["671726N", "0252004E"], direction: "top" },
    { name: "UBIGA", dmsCoords: ["642305N", "0264818E"], direction: "top" },
    { name: "UGLUM", dmsCoords: ["632455N", "0273827E"], direction: "top" },
    { name: "UGMOR", dmsCoords: ["643940N", "0260830E"], direction: "top" },
    { name: "UMSES", dmsCoords: ["610613N", "0220911E"], direction: "top" },
    { name: "UPAPU", dmsCoords: ["601106N", "0223334E"], direction: "top" },
    { name: "UPEDU", dmsCoords: ["651753N", "0252908E"], direction: "top" },
    { name: "USUPO", dmsCoords: ["613645N", "0250056E"], direction: "top" },
    { name: "UVATI", dmsCoords: ["632329N", "0211204E"], direction: "top" },
    { name: "UVEMO", dmsCoords: ["610533N", "0235058E"], direction: "top" },
    { name: "UVOPA", dmsCoords: ["604625N", "0222611E"], direction: "top" },
    { name: "UVOVO", dmsCoords: ["622257N", "0292401E"], direction: "top" },
    { name: "UXEGA", dmsCoords: ["612803N", "0265633E"], direction: "top" },
    { name: "VABUB", dmsCoords: ["623621N", "0223240E"], direction: "top" },
    { name: "VALOX", dmsCoords: ["594354N", "0240820E"], direction: "top" },
    { name: "VAVED", dmsCoords: ["615040N", "0264339E"], direction: "top" },
    { name: "VAXUN", dmsCoords: ["635903N", "0234218E"], direction: "top-right" },
    { name: "VEHUF", dmsCoords: ["604612N", "0260617E"], direction: "top" },
    { name: "VEPIN", dmsCoords: ["603753N", "0261959E"], direction: "top" },
    { name: "XELMA", dmsCoords: ["615605N", "0253746E"], direction: "top" },
    { name: "XETMU", dmsCoords: ["675224N", "0252155E"], direction: "top" },
    { name: "XEVAP", dmsCoords: ["645013N", "0241836E"], direction: "top" },
    { name: "XORMU", dmsCoords: ["611928N", "0223854E"], direction: "top" }
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

// AIRPORT DATA
function loadAirportData(icao) {
    console.log("Loading data for", icao);

    // variables
    var qnh;

    // todo: remove other data blocks (mainly aircraft flight plans)

    // AIRPORT DATA:

    // airportHeader
    const airport = airports.find(airport => airport.icao === icao);
    if (airport) document.getElementById("airportHeader").textContent = `${icao} - ${airport.name}`;
    
    // metarText and atisText
    fetch(`/airport/${icao}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Airport data not found');
        }
        return response.json();
    })
    .then(data => {
        const textAtis = data.textAtis || "NO ATIS AVBL";
        const atisCode = data.atisCode || "NIL";
        document.getElementById("metarText").textContent = data.metar + "=";
        document.getElementById("atisHeader").textContent = "ATIS " + atisCode + " Q" + data.qnh;
        document.getElementById("atisText").innerHTML = textAtis.replace(/\. /g, "<br>");
    })
    .catch(error => {
        console.error("Error fetching airport data from server:", error);
    });

    // airport information table
    createAirportTable(icao);

    // Open container and display data
    document.getElementById("content").style.display = "block";
    document.getElementById("map").style.width = "55%";
    document.getElementById("header").style.right = "45%";
    document.getElementById("aircraftContainer").style.display = "none";
    document.getElementById("airportDataContainer").style.display = "block";
}


var chartDate = "001-2024_2024_01_25";

function createAirportTable(icao) {
    var airportInfo = airportInformation.find(info => info.icao === icao);
    if (!airportInfo) {
        var table = document.getElementById("airportInformationTable");
        table.innerHTML = ""; // Clear existing content
        
        var headerRow = table.insertRow();
        var headerCell = document.createElement("th");
        headerCell.textContent = "NO DATA";
        headerRow.appendChild(headerCell);
        return;
    }

    var table = document.getElementById("airportInformationTable");
    table.innerHTML = ""; // Clear existing content
    
    // Create Departure and Arrival Charts section
    var depAndArrHeaderRow = table.insertRow();
    var depAndArrHeaderCell = document.createElement("th");
    depAndArrHeaderCell.textContent = "Departure and Arrival Charts";
    depAndArrHeaderRow.appendChild(depAndArrHeaderCell);

    airportInfo.depAndArrCharts.forEach(chart => {
        var row = table.insertRow();
        var cell = row.insertCell();
        var link = document.createElement("a");
        link.href = chart.url.replace("{chartDate}", chartDate);
        link.textContent = chart.name;
        link.target = "_blank";
        cell.appendChild(link);
    });

    // Create Approach Charts section
    var apchHeaderRow = table.insertRow();
    var apchHeaderCell = document.createElement("th");
    apchHeaderCell.textContent = "Instrument Approach Charts";
    apchHeaderRow.appendChild(apchHeaderCell);

    airportInfo.apchCharts.forEach(chart => {
        var row = table.insertRow();
        var cell = row.insertCell();
        var link = document.createElement("a");
        link.href = chart.url.replace("{chartDate}", chartDate);
        link.textContent = chart.name;
        link.target = "_blank";
        cell.appendChild(link);
    });

    // Create Other Data section
    var apchHeaderRow = table.insertRow();
    var apchHeaderCell = document.createElement("th");
    apchHeaderCell.textContent = "Other";
    apchHeaderRow.appendChild(apchHeaderCell);

    airportInfo.otherData.forEach(chart => {
        var row = table.insertRow();
        var cell = row.insertCell();
        var link = document.createElement("a");
        link.href = chart.url.replace("{chartDate}", chartDate);
        link.textContent = chart.name;
        link.target = "_blank";
        cell.appendChild(link);
    });

    airportInfo.serviceType.forEach(data => {
        document.getElementById("serviceType").innerHTML = data.description;
    });
}

var airportInformation = [
    { 
        icao: "EFTP", 
        depAndArrCharts: [
            { name: "SID RWY 06", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_06_SIDR.pdf" },
            { name: "SID RWY 24", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_24_SIDR.pdf" },
            { name: "STAR RWY 06", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_06_STAR.pdf" },
            { name: "STAR RWY 24", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_24_STAR.pdf" }
        ],
        apchCharts: [
            { name: "RNP RWY 06 (2700 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_06_RNP.pdf" },
            { name: "ILS Z RWY 24 (2700 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_24_ILSZ.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 1500 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTP/EF_AD_2_EFTP_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFTP_LOCAL_TRA_18_APR_2024.pdf" },
            { name: "FINNHEMS 30 LOP", url: "https://wiki.vatsim-scandinavia.org/books/special-procedures/page/eftp-finnhems-30" },
            { name: "MILITARY RTF", url: "https://wiki.vatsim-scandinavia.org/books/special-procedures/chapter/military-and-border-guard" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar; or<br>2. Separate tower and radar units based on ATS surveillance systems" }
        ]
    },
    { 
        icao: "EFTU", 
        depAndArrCharts: [
            { name: "SID RWY 08", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_08_SIDR.pdf" },
            { name: "SID RWY 26", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_26_SIDR.pdf" },
            { name: "STAR RWY 08", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_08_STAR.pdf" },
            { name: "STAR RWY 26", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_26_STAR.pdf" }
        ],
        apchCharts: [
            { name: "RNP RWY 08 (2200 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_08_RNP.pdf" },
            { name: "ILS Z RWY 26 (2200 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_26_ILSZ.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 1200 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFTU/EF_AD_2_EFTU_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFTU_LOCAL_TRA_25_MAY_2017.pdf" },
            { name: "FINNHEMS 20 LOP", url: "https://wiki.vatsim-scandinavia.org/books/special-procedures/page/eftu-finnhems-20" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar; or<br>2. Separate tower and radar units based on ATS surveillance systems" }
        ]
    },
    { 
        icao: "EFPO", 
        depAndArrCharts: [
            { name: "SID RWY 12", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_12_SIDR.pdf" },
            { name: "SID RWY 30", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_30_SIDR.pdf" },
            { name: "STAR RWY 12", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_12_STAR.pdf" },
            { name: "STAR RWY 30", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_30_STAR.pdf" }
        ],
        apchCharts: [
            { name: "RNP RWY 12 (2200 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_12_RNP.pdf" },
            { name: "ILS Z RWY 30 (2200 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_30_ILSZ.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 1200 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFPO/EF_AD_2_EFPO_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFPO_LOCAL_TRA_26_APR_2018.pdf" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar; or<br>2. Separate tower and radar units based on ATS surveillance systems" }
        ]
    },
    { 
        icao: "EFHK", 
        depAndArrCharts: [
            { name: "SID 04L", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04L_SIDR.pdf" },
            { name: "SID 04R", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04R_SIDR.pdf" },
            { name: "SID 04R PROP (ROPAM)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04R_SIDRP.pdf" },
            { name: "SID 15", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_15_SIDR.pdf" },
            { name: "SID 22L", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22L_SIDR.pdf" },
            { name: "SID 22L PROP (ROPAM)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22L_SIDRP.pdf" },
            { name: "SID 22R", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22R_SIDR.pdf" },
            { name: "SID 22R Q-DEP", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22R_SIDR2.pdf" },
            { name: "SID 33", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_33_SIDR.pdf" },
            { name: "STAR 04L", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04L_STAR.pdf" },
            { name: "STAR 04L SOIR", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04L_STAR2.pdf" },
            { name: "STAR 04R", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04R_STAR.pdf" },
            { name: "STAR 15", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_15_STAR.pdf" },
            { name: "STAR 22L", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22L_STAR.pdf" },
            { name: "STAR 22R", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22R_STAR.pdf" },
            { name: "STAR 22R SOIR", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22R_STAR2.pdf" },
            { name: "STAR 33", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_33_STAR.pdf" }
        ],
        apchCharts: [
            { name: "ILS RWY 04L (2300 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04L_ILS.pdf" },
            { name: "ILS RWY 04R (3300 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_04R_ILS.pdf" },
            { name: "ILS RWY 15 (2000 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_15_ILS.pdf" },
            { name: "ILS RWY 22L (3000 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22L_ILS.pdf" },
            { name: "ILS RWY 22R (2000 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_22R_ILS.pdf" },
            { name: "RNP RWY 33 (3000 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_33_RNP.pdf" }

        ],
        otherData: [
            { name: "STANDARD DEP HDG", url: "https://wiki.vatsim-scandinavia.org/books/lop-amY/page/en-route-clearance-dep-hdg#bkmrk-list-of-standard-dep" },
            { name: "TWY AND STAND LIMITATIONS", url: "https://wiki.vatsim-scandinavia.org/attachments/102?open=true" },
            { name: "VAC - CTR MAX 1000 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFHK/EF_AD_2_EFHK_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFHK_LOCAL_TRA_22_APR_2021.pdf" },
            { name: "FINNHEMS 10 LOP", url: "https://wiki.vatsim-scandinavia.org/books/special-procedures/page/efhk-finnhems-10" },
        ],
        serviceType: [
            { description: "Air traffic service is provided in the form of aerodrome and approach control services based on the use of ATS surveillance systems" }
        ]
    },
    { 
        icao: "EFMA", 
        depAndArrCharts: [
            { name: "SID RWY 03", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_03_SIDR.pdf" },
            { name: "SID RWY 21", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_21_SIDR.pdf" },
            { name: "STAR RWY 03", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_03_STAR.pdf" },
            { name: "STAR RWY 21", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_21_STAR.pdf" }
        ],
        apchCharts: [
            { name: "RNP RWY 03 (1900 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_03_RNP.pdf" },
            { name: "ILS Z RWY 21 (1900 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_21_ILSZ.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 900 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFMA/EF_AD_2_EFMA_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFMA_LOCAL_TRA_13_NOV_2014.pdf" },
            { name: "RADAR COVERAGE CHART", url: "https://wiki.vatsim-scandinavia.org/link/223#bkmrk--29" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar based on ATS surveillance systems" }
        ]
    },
    { 
        icao: "EFUT", 
        depAndArrCharts: [
            { name: "SID RWY 07", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_07_SIDR.pdf" },
            { name: "SID RWY 25", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_25_SIDR.pdf" },
            { name: "STAR RWY 07", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_07_STAR.pdf" },
            { name: "STAR RWY 25", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_25_STAR.pdf" }
        ],
        apchCharts: [
            { name: "RNP RWY 07 (2300 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_07_RNP.pdf" },
            { name: "ILS RWY 25 (2300 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_25_ILS.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 1300 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFUT/EF_AD_2_EFUT_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFUT_LOCAL_TRA_13_NOV_2014.pdf" },
            { name: "PROCEDURAL INFO", url: "https://wiki.vatsim-scandinavia.org/books/sop/chapter/approach-control-based-on-procedural-separation" },
            { name: "PROC CHART RWY 07", url: "https://wiki.vatsim-scandinavia.org/link/206#bkmrk-runway-07" },
            { name: "PROC CHART RWY 25", url: "https://wiki.vatsim-scandinavia.org/link/206#bkmrk-runway-25" },
            { name: "MILITARY RTF", url: "https://wiki.vatsim-scandinavia.org/books/special-procedures/chapter/military-and-border-guard" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar based on procedural separation<br>- Military aerodrome" }
        ]
    },
    { 
        icao: "EFLP", 
        depAndArrCharts: [
            { name: "SID RWY 06", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_06_SIDR.pdf" },
            { name: "SID RWY 24", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_24_SIDR.pdf" },
            { name: "STAR RWY 06", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_06_STAR.pdf" },
            { name: "STAR RWY 24", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_24_STAR.pdf" }
        ],
        apchCharts: [
            { name: "ILS RWY 06 (2100 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_06_ILS.pdf" },
            { name: "RNP RWY 24 (2100 FT)", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_24_RNP.pdf" }
        ],
        otherData: [
            { name: "VAC - CTR MAX 1100 FT", url: "https://www.ais.fi/eaip/{chartDate}/documents/Root_WePub/ANSFI/Charts/AD/EFLP/EF_AD_2_EFLP_VAC.pdf" },
            { name: "LOCAL TRA CHART", url: "https://www.ais.fi/localtra/Tra/EFLP_LOCAL_TRA_13_NOV_2014.pdf" },
            { name: "PROCEDURAL INFO", url: "https://wiki.vatsim-scandinavia.org/books/sop/chapter/approach-control-based-on-procedural-separation" },
            { name: "PROC CHART RWY 06", url: "https://wiki.vatsim-scandinavia.org/link/206#bkmrk-runway-06" },
            { name: "PROC CHART RWY 24", url: "https://wiki.vatsim-scandinavia.org/link/206#bkmrk-runway-24" }
        ],
        serviceType: [
            { description: "1. Combined tower-radar based on procedural separation<br>" }
        ]
    }
];


var airports = [
    { name: "Enontekiö", icao: "EFET", coords: [68.3625, 23.4244] },
    { name: "Halli", icao: "EFHA", coords: [61.8560, 24.7867] },
    { name: "Helsinki-Vantaa", icao: "EFHK", coords: [60.317222, 24.963333] },
    { name: "Ivalo", icao: "EFIV", coords: [68.6073, 27.4053] },
    { name: "Joensuu", icao: "EFJO", coords: [62.6629, 29.6075] },
    { name: "Jyväskylä", icao: "EFJY", coords: [62.3995, 25.6783] },
    { name: "Kajaani", icao: "EFKI", coords: [64.2855, 27.6924] },
    { name: "Kemi-Tornio", icao: "EFKE", coords: [65.7819, 24.5991] },
    { name: "Kittilä", icao: "EFKT", coords: [67.7008, 24.8468] },
    { name: "Kokkola-Pietarsaari", icao: "EFKK", coords: [63.7212, 23.1431] },
    { name: "Kuopio", icao: "EFKU", coords: [63.0071, 27.7978] },
    { name: "Kuusamo", icao: "EFKS", coords: [65.9876, 29.2394] },
    { name: "Lappeenranta", icao: "EFLP", coords: [61.0446, 28.1447] },
    { name: "Mariehamn", icao: "EFMA", coords: [60.1222, 19.8982] },
    { name: "Mikkeli", icao: "EFMI", coords: [61.6866, 27.2018] },
    { name: "Oulu", icao: "EFOU", coords: [64.9301, 25.3546] },
    { name: "Pori", icao: "EFPO", coords: [61.4617, 21.7999] },
    { name: "Rovaniemi", icao: "EFRO", coords: [66.5648, 25.8304] },
    { name: "Savonlinna", icao: "EFSA", coords: [61.9431, 28.9450] },
    { name: "Seinäjoki", icao: "EFSI", coords: [62.6921, 22.8323] },
    { name: "Tampere-Pirkkala", icao: "EFTP", coords: [61.4141, 23.6044] },
    { name: "Turku", icao: "EFTU", coords: [60.5141, 22.2628] },
    { name: "Utti", icao: "EFUT", coords: [60.8964, 26.9384] },
    { name: "Vaasa", icao: "EFVA", coords: [63.0507, 21.7622] }
];

function aircraftData(cs) {
    // Open container and display data
    document.getElementById("content").style.display = "block";
    document.getElementById("map").style.width = "55%";
    document.getElementById("header").style.right = "45%";
    document.getElementById("aircraftContainer").style.display = "block";
    document.getElementById("airportDataContainer").style.display = "none";
    document.getElementById("fplHeader").innerHTML = cs + " ATC Flight Plan";

    // make ATC FPL
    fetch('/traffic')
    .then(response => response.json())
    .then(data => {
        const aircraft = data.find(pilot => pilot.callsign === cs);
        if (aircraft && aircraft.flight_plan) {
            const fp = aircraft.flight_plan; // Simplify access to flight_plan object
            const atcFlightPlan = {
                arrival: fp.arrival || 'XXXX',
                departure: fp.departure || 'XXXX',
                frules: fp.frules || 'FRUL',
                fplAcft: fp.fplAcft || 'ATYP/EQUIP',
                depTime: fp.depTime || 'EOBT',
                speed: fp.speed || 'TAS',
                rfl: fp.rfl || 'RFL',
                route: fp.route || 'ROUTE',
                eet: fp.eet || 'EET',
                altn: fp.altn || '',
                rmk: fp.rmk || 'FPL18',
                pic: aircraft.pic || 'PIC'
            };

            document.getElementById("atcFpl").innerHTML = `
                (FPL-${cs}-${atcFlightPlan.frules}<br>
                -${atcFlightPlan.fplAcft}<br>
                -${atcFlightPlan.departure}${atcFlightPlan.depTime}<br>
                -N${atcFlightPlan.speed}${formatAltitude(atcFlightPlan.rfl)} ${atcFlightPlan.route}<br>
                -${atcFlightPlan.arrival}${atcFlightPlan.eet} ${atcFlightPlan.altn}<br>
                -${atcFlightPlan.rmk})<br><br>
                PIC ${atcFlightPlan.pic}
            `;

            const skyVectorUrl = `https://skyvector.com/?ll=64.89931801424359,23.022949231465624&chart=301&zoom=11&fpl=${atcFlightPlan.departure}%20${atcFlightPlan.route}%20${atcFlightPlan.arrival}`;
            document.getElementById("skyvectorLink").href = skyVectorUrl;

        } else {
            document.getElementById("atcFpl").innerHTML = "NO FPL";
        }
    })
    .catch(error => console.error('Error fetching aircraft positions:', error));
}
