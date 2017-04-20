var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var insertCustomers = function(db, callback) {
    var customers = db.collection('customers');
    customers.drop(function() {
        customers.insertMany([{
                "first_name": "Maisie",
                "last_name": "Mcneil",
                "personal_key": 1646032126699,
                "phone_number": "1-447-855-8848",
                "email": "vitae@ipsumprimis.net",
                "address": "P.O. Box 474, 341 Tincidunt Av.",
                "city": "Ijebu Ode",
                "country": "Northern Mariana Islands",
                "zip_code": "9022ZT"
            }, {
                "first_name": "Kelly",
                "last_name": "Long",
                "personal_key": 1637071218699,
                "phone_number": "1-625-905-5417",
                "email": "mollis.lectus@Nuncullamcorpervelit.net",
                "address": "P.O. Box 280, 325 Arcu. Street",
                "city": "Gisborne",
                "country": "Uganda",
                "zip_code": "5439"
            }, {
                "first_name": "Tatum",
                "last_name": "Wells",
                "personal_key": 1691110167199,
                "phone_number": "188-8821",
                "email": "semper.rutrum.Fusce@Nuncpulvinar.ca",
                "address": "Ap #711-676 Neque St.",
                "city": "Merbes-le-Ch‰teau",
                "country": "Namibia",
                "zip_code": "73981"
            }, {
                "first_name": "Bernard",
                "last_name": "Middleton",
                "personal_key": 1613052731399,
                "phone_number": "573-1047",
                "email": "vel.vulputate@gravidasitamet.edu",
                "address": "P.O. Box 482, 6338 Sit Av.",
                "city": "Surrey",
                "country": "Pitcairn Islands",
                "zip_code": "6924"
            }, {
                "first_name": "Mikayla",
                "last_name": "Harvey",
                "personal_key": 1674072116899,
                "phone_number": "1-727-995-0706",
                "email": "mauris@penatibus.co.uk",
                "address": "3112 Ut, St.",
                "city": "St. David's",
                "country": "Isle of Man",
                "zip_code": "28997-573"
            }, {
                "first_name": "Sybil",
                "last_name": "Johnston",
                "personal_key": 1629022354899,
                "phone_number": "1-451-274-3876",
                "email": "vulputate@lobortis.com",
                "address": "779-6310 Quis Ave",
                "city": "Wolkrange",
                "country": "Monaco",
                "zip_code": "8317"
            }, {
                "first_name": "Signe",
                "last_name": "Morrison",
                "personal_key": 1657031296599,
                "phone_number": "227-8495",
                "email": "ut@aenimSuspendisse.com",
                "address": "365-5379 Enim St.",
                "city": "Independence",
                "country": "Greece",
                "zip_code": "64496"
            }, {
                "first_name": "Nolan",
                "last_name": "Hendricks",
                "personal_key": 1636021447899,
                "phone_number": "1-125-815-9209",
                "email": "et.magnis@ipsum.net",
                "address": "892 Felis Rd.",
                "city": "Orhangazi",
                "country": "Wallis and Futuna",
                "zip_code": "33718"
            }, {
                "first_name": "Dieter",
                "last_name": "Chang",
                "personal_key": 1657093040099,
                "phone_number": "541-1588",
                "email": "est.mollis.non@accumsansedfacilisis.co.uk",
                "address": "122-9097 Euismod Ave",
                "city": "Oostakker",
                "country": "Mauritius",
                "zip_code": "06979"
            }, {
                "first_name": "Cynthia",
                "last_name": "Russo",
                "personal_key": 1636082844899,
                "phone_number": "675-6521",
                "email": "Maecenas@blanditviverra.org",
                "address": "Ap #951-4047 Nisi. Road",
                "city": "Labro",
                "country": "Palestine, State of",
                "zip_code": "03791"
            }, {
                "first_name": "Talon",
                "last_name": "Callahan",
                "personal_key": 1647082894499,
                "phone_number": "807-7458",
                "email": "sapien@ettristiquepellentesque.edu",
                "address": "4650 Lorem, Rd.",
                "city": "Cetara",
                "country": "Guinea",
                "zip_code": "53380"
            }, {
                "first_name": "Margaret",
                "last_name": "Pitts",
                "personal_key": 1618030844099,
                "phone_number": "892-4876",
                "email": "metus@bibendum.ca",
                "address": "P.O. Box 444, 5397 Orci Rd.",
                "city": "Puente Alto",
                "country": "Netherlands",
                "zip_code": "27527"
            }, {
                "first_name": "Donovan",
                "last_name": "Oneal",
                "personal_key": 1695020219899,
                "phone_number": "141-5277",
                "email": "pharetra.sed@nibhPhasellusnulla.co.uk",
                "address": "P.O. Box 118, 7110 Felis Avenue",
                "city": "Lugo",
                "country": "Japan",
                "zip_code": "6786"
            }, {
                "first_name": "Lacota",
                "last_name": "Gonzales",
                "personal_key": 1663071730999,
                "phone_number": "348-1000",
                "email": "fermentum.convallis@varius.org",
                "address": "6411 Cras Ave",
                "city": "Los Andes",
                "country": "Bonaire, Sint Eustatius and Saba",
                "zip_code": "88848-693"
            }, {
                "first_name": "Tatum",
                "last_name": "Willis",
                "personal_key": 1639022240799,
                "phone_number": "1-350-745-2446",
                "email": "Aliquam.erat@ut.co.uk",
                "address": "8988 Sed Road",
                "city": "Isla de Pascua",
                "country": "Tuvalu",
                "zip_code": "28592"
            }, {
                "first_name": "Lara",
                "last_name": "Heath",
                "personal_key": 1695062260599,
                "phone_number": "1-101-106-3244",
                "email": "viverra@ac.net",
                "address": "P.O. Box 898, 4234 Non, St.",
                "city": "Ukkel",
                "country": "Ukraine",
                "zip_code": "832923"
            }, {
                "first_name": "Quail",
                "last_name": "Navarro",
                "personal_key": 1603020666999,
                "phone_number": "1-328-817-4568",
                "email": "primis.in.faucibus@tacitisociosqu.co.uk",
                "address": "7105 Quam Road",
                "city": "Panguipulli",
                "country": "Israel",
                "zip_code": "57618"
            }, {
                "first_name": "Tamara",
                "last_name": "Duran",
                "personal_key": 1607022384899,
                "phone_number": "880-2881",
                "email": "non.vestibulum@arcuMorbisit.net",
                "address": "P.O. Box 548, 4952 Curabitur Ave",
                "city": "Futaleufú",
                "country": "Kazakhstan",
                "zip_code": "EV2V 8WN"
            }, {
                "first_name": "Isaiah",
                "last_name": "Hobbs",
                "personal_key": 1615100369499,
                "phone_number": "716-9502",
                "email": "Nam.interdum@elitNullafacilisi.co.uk",
                "address": "4797 Duis Ave",
                "city": "Torino",
                "country": "Haiti",
                "zip_code": "39398"
            }, {
                "first_name": "Hu",
                "last_name": "Osborn",
                "personal_key": 1657051261499,
                "phone_number": "1-418-293-6250",
                "email": "Proin@maurisblanditmattis.co.uk",
                "address": "2231 Est Road",
                "city": "Oss",
                "country": "Northern Mariana Islands",
                "zip_code": "J8L 6Y9"
            }, {
                "first_name": "Kevin",
                "last_name": "Bennett",
                "personal_key": 1621112640399,
                "phone_number": "1-545-212-2721",
                "email": "penatibus.et@et.net",
                "address": "1976 Ut Ave",
                "city": "Beypazarı",
                "country": "Lesotho",
                "zip_code": "45520"
            }, {
                "first_name": "Skyler",
                "last_name": "Cooley",
                "personal_key": 1687012983699,
                "phone_number": "1-496-491-9535",
                "email": "sociis.natoque.penatibus@nibhlacinia.com",
                "address": "P.O. Box 582, 6009 Bibendum Av.",
                "city": "Albi",
                "country": "Angola",
                "zip_code": "37498"
            }, {
                "first_name": "Rachel",
                "last_name": "Hess",
                "personal_key": 1600021278799,
                "phone_number": "149-9183",
                "email": "Donec.egestas@PhasellusornareFusce.ca",
                "address": "Ap #632-5442 Aenean Ave",
                "city": "Mobile",
                "country": "Marshall Islands",
                "zip_code": "6668JN"
            }, {
                "first_name": "Clarke",
                "last_name": "Fulton",
                "personal_key": 1649100371999,
                "phone_number": "197-7795",
                "email": "sed.tortor@Aeneangravida.ca",
                "address": "P.O. Box 156, 1969 Dictum Ave",
                "city": "Neyveli",
                "country": "Niue",
                "zip_code": "61370"
            }, {
                "first_name": "Alea",
                "last_name": "Perkins",
                "personal_key": 1640032109299,
                "phone_number": "312-5367",
                "email": "Nunc@facilisisfacilisis.co.uk",
                "address": "Ap #652-3840 Quis Rd.",
                "city": "Nicoya",
                "country": "Virgin Islands, United States",
                "zip_code": "48534"
            }, {
                "first_name": "Hanae",
                "last_name": "Fernandez",
                "personal_key": 1621080533199,
                "phone_number": "399-5346",
                "email": "semper.egestas@hendreritneque.edu",
                "address": "9974 Volutpat Rd.",
                "city": "Enschede",
                "country": "Micronesia",
                "zip_code": "11-724"
            }, {
                "first_name": "Lacey",
                "last_name": "Prince",
                "personal_key": 1671120361699,
                "phone_number": "1-921-471-2032",
                "email": "gravida.Praesent.eu@eleifendnec.co.uk",
                "address": "P.O. Box 911, 8536 Ac St.",
                "city": "Sunshine Coast Regional District",
                "country": "Peru",
                "zip_code": "1774KM"
            }, {
                "first_name": "Natalie",
                "last_name": "Mccray",
                "personal_key": 1676081585699,
                "phone_number": "287-7933",
                "email": "ante.dictum.mi@id.edu",
                "address": "8684 Ut Rd.",
                "city": "Mundare",
                "country": "Korea, South",
                "zip_code": "8942"
            }, {
                "first_name": "Mercedes",
                "last_name": "Serrano",
                "personal_key": 1621091533899,
                "phone_number": "1-516-593-8395",
                "email": "est.mollis@nunc.ca",
                "address": "P.O. Box 124, 6224 Malesuada Avenue",
                "city": "Vanderhoof",
                "country": "American Samoa",
                "zip_code": "S4R 2H1"
            }, {
                "first_name": "Emi",
                "last_name": "Charles",
                "personal_key": 1656082747399,
                "phone_number": "1-148-790-1960",
                "email": "nulla@amet.com",
                "address": "686-455 Proin Street",
                "city": "Spruce Grove",
                "country": "Korea, North",
                "zip_code": "98000"
            }, {
                "first_name": "Tasha",
                "last_name": "Vazquez",
                "personal_key": 1688061716999,
                "phone_number": "1-319-836-8030",
                "email": "dui.quis.accumsan@nisi.net",
                "address": "Ap #864-9078 Est. St.",
                "city": "Evansville",
                "country": "Egypt",
                "zip_code": "37433"
            }, {
                "first_name": "Shana",
                "last_name": "Richardson",
                "personal_key": 1631111823399,
                "phone_number": "505-8771",
                "email": "sit.amet@vel.co.uk",
                "address": "848-5767 Ullamcorper Av.",
                "city": "Ospedaletto Lodigiano",
                "country": "Guernsey",
                "zip_code": "9452"
            }, {
                "first_name": "Nevada",
                "last_name": "Sweet",
                "personal_key": 1660020491599,
                "phone_number": "662-3060",
                "email": "ipsum.dolor@quis.co.uk",
                "address": "P.O. Box 799, 7649 Nam Rd.",
                "city": "Jandrain-Jandrenouille",
                "country": "Guam",
                "zip_code": "50646"
            }, {
                "first_name": "Jakeem",
                "last_name": "Robles",
                "personal_key": 1612080255399,
                "phone_number": "1-827-198-5756",
                "email": "Phasellus.elit.pede@neque.edu",
                "address": "P.O. Box 102, 632 Ipsum Ave",
                "city": "Cochin",
                "country": "Timor-Leste",
                "zip_code": "545017"
            }, {
                "first_name": "Tyrone",
                "last_name": "Garza",
                "personal_key": 1642022277399,
                "phone_number": "858-9727",
                "email": "parturient.montes@risus.net",
                "address": "9726 Libero. Ave",
                "city": "King Township",
                "country": "Panama",
                "zip_code": "53-742"
            }, {
                "first_name": "Holmes",
                "last_name": "Sherman",
                "personal_key": 1677012593699,
                "phone_number": "997-4570",
                "email": "a@Nuncullamcorpervelit.net",
                "address": "P.O. Box 437, 2900 Vel, Street",
                "city": "Colorado Springs",
                "country": "Albania",
                "zip_code": "0649BW"
            }, {
                "first_name": "Vera",
                "last_name": "Arnold",
                "personal_key": 1693021469199,
                "phone_number": "594-7304",
                "email": "vulputate@metus.co.uk",
                "address": "P.O. Box 662, 1302 Dis St.",
                "city": "Santarcangelo di Romagna",
                "country": "Namibia",
                "zip_code": "119807"
            }, {
                "first_name": "Nina",
                "last_name": "Berger",
                "personal_key": 1653111003299,
                "phone_number": "275-2759",
                "email": "ligula.Donec@luctus.ca",
                "address": "689-5015 Lorem, Avenue",
                "city": "Sala Baganza",
                "country": "Falkland Islands",
                "zip_code": "248456"
            }, {
                "first_name": "Madeline",
                "last_name": "Raymond",
                "personal_key": 1699091654599,
                "phone_number": "1-584-830-7356",
                "email": "molestie@luctus.net",
                "address": "Ap #964-3100 Magna. Rd.",
                "city": "Alert Bay",
                "country": "Sao Tome and Principe",
                "zip_code": "0198"
            }, {
                "first_name": "Zenia",
                "last_name": "Mercado",
                "personal_key": 1631113086799,
                "phone_number": "1-633-777-0879",
                "email": "erat.eget.tincidunt@iaculisenimsit.edu",
                "address": "2750 Sagittis Street",
                "city": "Gualdo Tadino",
                "country": "Congo, the Democratic Republic of the",
                "zip_code": "C3E 9J9"
            }, {
                "first_name": "Nash",
                "last_name": "Doyle",
                "personal_key": 1641121309499,
                "phone_number": "1-801-515-5706",
                "email": "Etiam.vestibulum@duiFuscealiquam.net",
                "address": "661-4850 Egestas. Rd.",
                "city": "Sauvenière",
                "country": "Equatorial Guinea",
                "zip_code": "52174"
            }, {
                "first_name": "Fitzgerald",
                "last_name": "Key",
                "personal_key": 1677021775199,
                "phone_number": "756-7205",
                "email": "adipiscing.Mauris.molestie@felis.ca",
                "address": "Ap #125-8234 Rhoncus. Rd.",
                "city": "Parchim	City",
                "country": "Iraq",
                "zip_code": "50631"
            }, {
                "first_name": "Karleigh",
                "last_name": "Dorsey",
                "personal_key": 1641040632099,
                "phone_number": "1-367-283-3025",
                "email": "Nullam.suscipit@etnetuset.co.uk",
                "address": "294-605 Sed, Avenue",
                "city": "Horsham",
                "country": "Guatemala",
                "zip_code": "13550"
            }, {
                "first_name": "Hayley",
                "last_name": "Sargent",
                "personal_key": 1642041366699,
                "phone_number": "1-849-248-0397",
                "email": "magna@fringillaeuismod.net",
                "address": "9911 Aliquet St.",
                "city": "Bhiwandi",
                "country": "Haiti",
                "zip_code": "413682"
            }, {
                "first_name": "Lev",
                "last_name": "Meadows",
                "personal_key": 1678032835799,
                "phone_number": "429-9280",
                "email": "non.cursus@Nunclaoreet.ca",
                "address": "P.O. Box 885, 6959 Risus. Rd.",
                "city": "Montenero Val Cocchiara",
                "country": "Iraq",
                "zip_code": "9892"
            }, {
                "first_name": "Armando",
                "last_name": "Cline",
                "personal_key": 1682080346999,
                "phone_number": "973-6671",
                "email": "Nunc.pulvinar@Maecenasornare.co.uk",
                "address": "106-9679 In Ave",
                "city": "Meeuwen",
                "country": "Cyprus",
                "zip_code": "22254"
            }, {
                "first_name": "Leilani",
                "last_name": "Avery",
                "personal_key": 1696122704299,
                "phone_number": "1-191-126-7150",
                "email": "felis.Donec@id.net",
                "address": "8471 Mollis Rd.",
                "city": "Torrevecchia Teatina",
                "country": "Laos",
                "zip_code": "Q0A 9YX"
            }, {
                "first_name": "Whoopi",
                "last_name": "Russo",
                "personal_key": 1643010730999,
                "phone_number": "375-9332",
                "email": "Proin@nisl.edu",
                "address": "125-9762 Aenean Rd.",
                "city": "Bonneville",
                "country": "Micronesia",
                "zip_code": "20334"
            }, {
                "first_name": "Wang",
                "last_name": "Sears",
                "personal_key": 1666090814499,
                "phone_number": "654-0434",
                "email": "interdum.libero.dui@Curabiturdictum.org",
                "address": "P.O. Box 571, 505 Cras Road",
                "city": "Liverpool",
                "country": "Guinea",
                "zip_code": "747081"
            }, {
                "first_name": "Lael",
                "last_name": "Schwartz",
                "personal_key": 1675112456299,
                "phone_number": "735-6712",
                "email": "tortor.nibh.sit@a.com",
                "address": "Ap #840-2825 Sit Street",
                "city": "Soye",
                "country": "Northern Mariana Islands",
                "zip_code": "32-324"
            }, {
                "first_name": "Yuli",
                "last_name": "Spears",
                "personal_key": 1630103023499,
                "phone_number": "304-6653",
                "email": "Nam@litoratorquent.ca",
                "address": "645-9244 Eu Avenue",
                "city": "Hull",
                "country": "Ethiopia",
                "zip_code": "03483"
            }, {
                "first_name": "Oleg",
                "last_name": "Warren",
                "personal_key": 1671061659999,
                "phone_number": "198-4076",
                "email": "orci.in@laoreetliberoet.edu",
                "address": "P.O. Box 760, 7044 Etiam Av.",
                "city": "Sherborne",
                "country": "Nicaragua",
                "zip_code": "626675"
            }, {
                "first_name": "Illiana",
                "last_name": "Maddox",
                "personal_key": 1617012548199,
                "phone_number": "505-1900",
                "email": "lorem@Maurismagna.com",
                "address": "P.O. Box 635, 1669 Ipsum. St.",
                "city": "Coldstream",
                "country": "Saint Helena, Ascension and Tristan da Cunha",
                "zip_code": "15716"
            }, {
                "first_name": "Jayme",
                "last_name": "Greene",
                "personal_key": 1676021717699,
                "phone_number": "248-6448",
                "email": "Proin@necluctusfelis.org",
                "address": "702-5860 Sem Rd.",
                "city": "Chapecó",
                "country": "Equatorial Guinea",
                "zip_code": "8331"
            }, {
                "first_name": "Hadley",
                "last_name": "Greer",
                "personal_key": 1655042175399,
                "phone_number": "1-420-397-5663",
                "email": "eget.dictum@eratneque.edu",
                "address": "644 Fringilla. Ave",
                "city": "Traralgon",
                "country": "Saint Kitts and Nevis",
                "zip_code": "81135"
            }, {
                "first_name": "Astra",
                "last_name": "Diaz",
                "personal_key": 1634071779099,
                "phone_number": "1-200-179-9571",
                "email": "semper.erat@natoquepenatibus.net",
                "address": "P.O. Box 737, 8507 Gravida Rd.",
                "city": "Bonvicino",
                "country": "Mali",
                "zip_code": "3360UU"
            }, {
                "first_name": "Leigh",
                "last_name": "Berger",
                "personal_key": 1662052437399,
                "phone_number": "1-119-957-2892",
                "email": "lacus.Etiam.bibendum@Sedidrisus.net",
                "address": "P.O. Box 122, 5513 Duis Rd.",
                "city": "Buckie",
                "country": "French Polynesia",
                "zip_code": "90-561"
            }, {
                "first_name": "Raya",
                "last_name": "Hanson",
                "personal_key": 1683010251899,
                "phone_number": "264-2375",
                "email": "convallis@SuspendissesagittisNullam.ca",
                "address": "5155 In, Avenue",
                "city": "King Township",
                "country": "Chad",
                "zip_code": "462350"
            }, {
                "first_name": "Joan",
                "last_name": "Galloway",
                "personal_key": 1660082326999,
                "phone_number": "1-302-557-4431",
                "email": "eros.Proin.ultrices@cursusIntegermollis.net",
                "address": "Ap #670-926 Justo Avenue",
                "city": "Prince Albert",
                "country": "Congo (Brazzaville)",
                "zip_code": "6724"
            }, {
                "first_name": "Kaden",
                "last_name": "Cotton",
                "personal_key": 1656120157599,
                "phone_number": "1-764-873-3007",
                "email": "consequat.dolor.vitae@elitAliquamauctor.org",
                "address": "Ap #868-8046 Dolor St.",
                "city": "Poggiodomo",
                "country": "Azerbaijan",
                "zip_code": "27331-884"
            }, {
                "first_name": "Buffy",
                "last_name": "Vincent",
                "personal_key": 1699011366799,
                "phone_number": "311-1512",
                "email": "mauris.aliquam@malesuadavel.org",
                "address": "P.O. Box 483, 3654 Arcu. Rd.",
                "city": "Hondelange",
                "country": "Korea, North",
                "zip_code": "75379"
            }, {
                "first_name": "Sylvester",
                "last_name": "Vargas",
                "personal_key": 1636070431399,
                "phone_number": "785-3068",
                "email": "enim.consequat@sodalesnisimagna.edu",
                "address": "281 Cubilia St.",
                "city": "Callander",
                "country": "Ghana",
                "zip_code": "271148"
            }, {
                "first_name": "Gay",
                "last_name": "Juarez",
                "personal_key": 1603040672799,
                "phone_number": "1-198-613-2528",
                "email": "nibh@Aliquamfringillacursus.ca",
                "address": "P.O. Box 811, 1992 Ac, Avenue",
                "city": "Sant'Agata sul Santerno",
                "country": "Suriname",
                "zip_code": "86871"
            }, {
                "first_name": "Brenden",
                "last_name": "Ramirez",
                "personal_key": 1655040680499,
                "phone_number": "512-1043",
                "email": "neque@vitaemaurissit.co.uk",
                "address": "533-4906 Cras Av.",
                "city": "Cabo de Santo Agostinho",
                "country": "Cape Verde",
                "zip_code": "89585-003"
            }, {
                "first_name": "Keelie",
                "last_name": "Wooten",
                "personal_key": 1636110871599,
                "phone_number": "1-397-407-7869",
                "email": "id.blandit.at@vel.co.uk",
                "address": "Ap #758-8168 Semper. Ave",
                "city": "San Pablo",
                "country": "New Caledonia",
                "zip_code": "61809"
            }, {
                "first_name": "Imogene",
                "last_name": "Vaughn",
                "personal_key": 1651072023099,
                "phone_number": "1-566-364-3160",
                "email": "ac.eleifend@sodales.net",
                "address": "Ap #329-575 Cras Rd.",
                "city": "Savona",
                "country": "Jamaica",
                "zip_code": "07-729"
            }, {
                "first_name": "Caldwell",
                "last_name": "Ratliff",
                "personal_key": 1654110962599,
                "phone_number": "548-1376",
                "email": "Aliquam.auctor@diamat.com",
                "address": "4301 Diam Avenue",
                "city": "Edam",
                "country": "Congo (Brazzaville)",
                "zip_code": "8934"
            }, {
                "first_name": "Janna",
                "last_name": "Montgomery",
                "personal_key": 1690022521799,
                "phone_number": "694-8137",
                "email": "facilisis.facilisis@porttitorerosnec.ca",
                "address": "P.O. Box 835, 529 Eu, St.",
                "city": "Dongelberg",
                "country": "Greenland",
                "zip_code": "6422"
            }, {
                "first_name": "Uma",
                "last_name": "Contreras",
                "personal_key": 1656071523199,
                "phone_number": "1-570-377-7106",
                "email": "Phasellus@rutrumnon.co.uk",
                "address": "9347 Odio Rd.",
                "city": "Gravelbourg",
                "country": "Cook Islands",
                "zip_code": "35112"
            }, {
                "first_name": "Zeus",
                "last_name": "Wilkerson",
                "personal_key": 1683102237399,
                "phone_number": "493-3123",
                "email": "senectus.et.netus@ultricies.net",
                "address": "Ap #757-9954 Aliquet, Av.",
                "city": "Auburn",
                "country": "Bonaire, Sint Eustatius and Saba",
                "zip_code": "4751"
            }, {
                "first_name": "Jordan",
                "last_name": "Whitehead",
                "personal_key": 1692011252699,
                "phone_number": "945-9260",
                "email": "Mauris@Nuncac.edu",
                "address": "Ap #124-8687 Enim Rd.",
                "city": "Villa Cortese",
                "country": "Cape Verde",
                "zip_code": "09515"
            }, {
                "first_name": "Amir",
                "last_name": "Larsen",
                "personal_key": 1643092754399,
                "phone_number": "916-6482",
                "email": "est@luctuset.edu",
                "address": "727-8977 Tincidunt Rd.",
                "city": "Khammam",
                "country": "Angola",
                "zip_code": "883040"
            }, {
                "first_name": "Karyn",
                "last_name": "Mack",
                "personal_key": 1635071261399,
                "phone_number": "1-310-645-4446",
                "email": "odio.Phasellus.at@vellectusCum.com",
                "address": "Ap #323-7820 Ipsum Rd.",
                "city": "Los Lagos",
                "country": "Turkmenistan",
                "zip_code": "268237"
            }, {
                "first_name": "Rhoda",
                "last_name": "Cote",
                "personal_key": 1647071568899,
                "phone_number": "1-707-541-6522",
                "email": "risus.Quisque@iaculisquispede.co.uk",
                "address": "Ap #412-8245 Curae; Rd.",
                "city": "Hattiesburg",
                "country": "Hungary",
                "zip_code": "981302"
            }, {
                "first_name": "Galena",
                "last_name": "Glover",
                "personal_key": 1666060896999,
                "phone_number": "1-348-825-1975",
                "email": "volutpat.Nulla.dignissim@nisi.co.uk",
                "address": "P.O. Box 153, 5607 Leo. Rd.",
                "city": "Ripabottoni",
                "country": "Pakistan",
                "zip_code": "510951"
            }, {
                "first_name": "Colette",
                "last_name": "Kennedy",
                "personal_key": 1645041053699,
                "phone_number": "1-675-377-0733",
                "email": "enim@volutpatnunc.com",
                "address": "Ap #833-9062 Sapien Ave",
                "city": "Wells",
                "country": "Madagascar",
                "zip_code": "499890"
            }, {
                "first_name": "Christopher",
                "last_name": "Blake",
                "personal_key": 1608102100099,
                "phone_number": "1-502-639-4428",
                "email": "amet.faucibus.ut@consectetuermaurisid.net",
                "address": "925-3637 Cursus Av.",
                "city": "King's Lynn",
                "country": "Aruba",
                "zip_code": "63922"
            }, {
                "first_name": "Aquila",
                "last_name": "Butler",
                "personal_key": 1688112883899,
                "phone_number": "1-519-198-1082",
                "email": "semper@ut.co.uk",
                "address": "Ap #996-6059 Euismod Street",
                "city": "Korbach",
                "country": "San Marino",
                "zip_code": "9050"
            }, {
                "first_name": "Randall",
                "last_name": "Forbes",
                "personal_key": 1617062930499,
                "phone_number": "1-585-212-4347",
                "email": "ad.litora.torquent@mauris.com",
                "address": "Ap #466-5558 Quam Av.",
                "city": "Libramont-Chevigny",
                "country": "Togo",
                "zip_code": "E1P 3L6"
            }, {
                "first_name": "Violet",
                "last_name": "Beck",
                "personal_key": 1676070465299,
                "phone_number": "1-641-673-2656",
                "email": "elit.pede.malesuada@velesttempor.net",
                "address": "P.O. Box 594, 6561 Ut Av.",
                "city": "Schwerin",
                "country": "Indonesia",
                "zip_code": "9609"
            }, {
                "first_name": "Ulysses",
                "last_name": "Larson",
                "personal_key": 1664021635199,
                "phone_number": "1-774-965-4719",
                "email": "magna.nec@justo.com",
                "address": "Ap #853-1854 Enim Ave",
                "city": "Zonhoven",
                "country": "Mali",
                "zip_code": "60112"
            }, {
                "first_name": "Ivan",
                "last_name": "Fox",
                "personal_key": 1664090607199,
                "phone_number": "1-827-609-3474",
                "email": "rhoncus.Proin@loremDonec.edu",
                "address": "6660 Ac, Rd.",
                "city": "Springfield",
                "country": "Mali",
                "zip_code": "19176-821"
            }, {
                "first_name": "Fitzgerald",
                "last_name": "Mayo",
                "personal_key": 1611080523699,
                "phone_number": "908-2310",
                "email": "ac.facilisis.facilisis@arcuSed.org",
                "address": "501-3422 Suspendisse Road",
                "city": "Sautin",
                "country": "Saint Helena, Ascension and Tristan da Cunha",
                "zip_code": "53544"
            }, {
                "first_name": "Jamal",
                "last_name": "Ortiz",
                "personal_key": 1636042455799,
                "phone_number": "1-967-864-3183",
                "email": "commodo@nonbibendum.co.uk",
                "address": "P.O. Box 693, 8514 Arcu St.",
                "city": "Chiusa Sclafani",
                "country": "Venezuela",
                "zip_code": "21877-613"
            }, {
                "first_name": "Fay",
                "last_name": "Briggs",
                "personal_key": 1614012150299,
                "phone_number": "494-2089",
                "email": "sit.amet.faucibus@feugiat.com",
                "address": "Ap #895-8875 Sollicitudin Rd.",
                "city": "Saarbrücken",
                "country": "Russian Federation",
                "zip_code": "2895"
            }, {
                "first_name": "Omar",
                "last_name": "Shepherd",
                "personal_key": 1640050299799,
                "phone_number": "220-4222",
                "email": "placerat@ornare.net",
                "address": "P.O. Box 240, 490 Ullamcorper, Rd.",
                "city": "Wuppertal",
                "country": "Cocos (Keeling) Islands",
                "zip_code": "75-374"
            }, {
                "first_name": "Raphael",
                "last_name": "Woodward",
                "personal_key": 1613021646299,
                "phone_number": "351-5614",
                "email": "leo.Vivamus@Nulla.edu",
                "address": "Ap #569-3364 Donec Avenue",
                "city": "Oliver",
                "country": "Paraguay",
                "zip_code": "3834"
            }, {
                "first_name": "Kylynn",
                "last_name": "Ramos",
                "personal_key": 1626021564899,
                "phone_number": "1-360-106-3451",
                "email": "velit.eget@volutpatnuncsit.ca",
                "address": "820-3793 Ante Avenue",
                "city": "Horsham",
                "country": "Tajikistan",
                "zip_code": "K6T 9P5"
            }, {
                "first_name": "Patricia",
                "last_name": "Waters",
                "personal_key": 1670061513899,
                "phone_number": "1-282-533-4213",
                "email": "est.Nunc@antelectus.edu",
                "address": "492 Et, Rd.",
                "city": "Eluru",
                "country": "Brazil",
                "zip_code": "531146"
            }, {
                "first_name": "Kadeem",
                "last_name": "Todd",
                "personal_key": 1626100214599,
                "phone_number": "792-1415",
                "email": "dictum@enimcommodohendrerit.net",
                "address": "Ap #398-5768 Eros Av.",
                "city": "Clermont-Ferrand",
                "country": "Germany",
                "zip_code": "997965"
            }, {
                "first_name": "Idona",
                "last_name": "Burgess",
                "personal_key": 1662040832099,
                "phone_number": "601-2606",
                "email": "Curabitur@gravidamolestiearcu.net",
                "address": "883-5489 Nulla St.",
                "city": "Thines",
                "country": "Guinea-Bissau",
                "zip_code": "81494"
            }, {
                "first_name": "Alana",
                "last_name": "Rivers",
                "personal_key": 1694072371499,
                "phone_number": "363-9467",
                "email": "enim@Pellentesquehabitant.ca",
                "address": "164-994 Tortor Rd.",
                "city": "Gaya",
                "country": "Bahamas",
                "zip_code": "7130"
            }, {
                "first_name": "Tobias",
                "last_name": "Ryan",
                "personal_key": 1627121516899,
                "phone_number": "1-658-861-2842",
                "email": "felis.adipiscing@doloregestasrhoncus.ca",
                "address": "Ap #370-4324 A Rd.",
                "city": "Compiègne",
                "country": "Cuba",
                "zip_code": "657658"
            }, {
                "first_name": "Ignatius",
                "last_name": "Miller",
                "personal_key": 1611070374599,
                "phone_number": "1-172-911-4085",
                "email": "non.lobortis@adipiscingelit.net",
                "address": "283-1089 Leo. Rd.",
                "city": "Sant'Eusanio Forconese",
                "country": "Pakistan",
                "zip_code": "02288"
            }, {
                "first_name": "Kirsten",
                "last_name": "Cantrell",
                "personal_key": 1639050229699,
                "phone_number": "1-977-623-3318",
                "email": "dignissim.pharetra.Nam@vulputateullamcorpermagna.com",
                "address": "P.O. Box 752, 8706 Nulla St.",
                "city": "St. Johann in Tirol",
                "country": "Solomon Islands",
                "zip_code": "539655"
            }, {
                "first_name": "Megan",
                "last_name": "Morgan",
                "personal_key": 1675111344299,
                "phone_number": "1-329-735-8963",
                "email": "eget.tincidunt.dui@faucibus.net",
                "address": "8830 Pellentesque Avenue",
                "city": "Oldenburg",
                "country": "Uzbekistan",
                "zip_code": "6769"
            }, {
                "first_name": "Reece",
                "last_name": "Winters",
                "personal_key": 1631071880199,
                "phone_number": "173-8565",
                "email": "volutpat@fermentum.com",
                "address": "P.O. Box 800, 1229 Aenean Road",
                "city": "Sandy",
                "country": "Tajikistan",
                "zip_code": "G7T 7C4"
            }, {
                "first_name": "Ulric",
                "last_name": "Lynch",
                "personal_key": 1680072885999,
                "phone_number": "768-6922",
                "email": "Sed.dictum.Proin@luctus.ca",
                "address": "Ap #546-1901 Ut Avenue",
                "city": "Sambuca Pistoiese",
                "country": "Serbia",
                "zip_code": "DQ2H 0HZ"
            }, {
                "first_name": "Alea",
                "last_name": "Mcbride",
                "personal_key": 1616061691299,
                "phone_number": "899-0206",
                "email": "nec.euismod@tellus.com",
                "address": "Ap #553-3099 Diam. St.",
                "city": "Gattatico",
                "country": "Mongolia",
                "zip_code": "11792"
            }, {
                "first_name": "Riley",
                "last_name": "Avery",
                "personal_key": 1644011274499,
                "phone_number": "632-6843",
                "email": "mauris.elit.dictum@nullaanteiaculis.net",
                "address": "Ap #617-6251 Non, Street",
                "city": "Sars-la-Buissière",
                "country": "Macedonia",
                "zip_code": "6867"
            }],
            function(err, result) {
                assert.equal(err, null);
                console.log("Inserted a documents into the customers collection.");
                customers.createIndex({
                    personal_key: 1
                }, {
                    unique: true
                }, function(err, result) {
                    assert.equal(err, null);
                    console.info("Created unique index for customers collection.");
                    callback();
                });
            });
    });
};

var insertShops = function(db, callback) {
    var shops = db.collection('shops');
    shops.drop(function() {
        shops.insertMany([{
            "name": "Malesuada Fames",
            "address": "504-6990 A Av.",
            "city": "Capannori",
            "country": "Bahrain",
            "zip_code": "52622",
            "phone": "(367) 602-3850"
        }, {
            "name": "Vehicula Aliquet",
            "address": "P.O. Box 527, 3313 Integer Road",
            "city": "Birmingham",
            "country": "Mauritius",
            "zip_code": "9351",
            "phone": "(472) 503-0689"
        }, {
            "name": "Molestie Tellus",
            "address": "678 Auctor, Road",
            "city": "Roubaix",
            "country": "Puerto Rico",
            "zip_code": "24771",
            "phone": "(303) 479-3271"
        }, {
            "name": "Proin Non",
            "address": "Ap #969-4550 Nullam St.",
            "city": "Ostellato",
            "country": "Nauru",
            "zip_code": "3236",
            "phone": "(160) 223-1741"
        }, {
            "name": "Venenatis Vel",
            "address": "669-9441 Mauris Rd.",
            "city": "Bhavnagar",
            "country": "Norway",
            "zip_code": "730704",
            "phone": "(664) 479-4659"
        }, {
            "name": "Lacus Associates",
            "address": "P.O. Box 737, 9362 Ligula. Road",
            "city": "LaSalle",
            "country": "Moldova",
            "zip_code": "2799",
            "phone": "(248) 983-7378"
        }, {
            "name": "Aliquam",
            "address": "417-6816 Lacus. Road",
            "city": "Gävle",
            "country": "Côte D'Ivoire (Ivory Coast)",
            "zip_code": "21869",
            "phone": "(536) 111-3483"
        }, {
            "name": "Nunc",
            "address": "116 Tempor St.",
            "city": "Lago Verde",
            "country": "Liechtenstein",
            "zip_code": "71116",
            "phone": "(160) 156-7875"
        }, {
            "name": "Etiam Gravida",
            "address": "600-4188 Arcu Avenue",
            "city": "Acosse",
            "country": "Niue",
            "zip_code": "8820",
            "phone": "(803) 762-9506"
        }, {
            "name": "Dolor",
            "address": "7801 Semper. Rd.",
            "city": "Annapolis",
            "country": "Cayman Islands",
            "zip_code": "OT2P 4HX",
            "phone": "(660) 632-1913"
        }], function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a documents into the shops collection.");
            shops.createIndex({
                name: 1
            }, {
                unique: true
            }, function(err, result) {
                assert.equal(err, null);
                console.info("Created unique index for shops collection.");
                callback();
            });
        });
    });
};

var insertProducts = function(db, callback) {
    var products = db.collection('products');
    products.drop(function() {
        products.insertMany([{
            "name": "salads",
            "type": "food"
        }, {
            "name": "pies",
            "type": "food"
        }, {
            "name": "seafood",
            "type": "food"
        }, {
            "name": "pasta",
            "type": "food"
        }, {
            "name": "desserts",
            "type": "food"
        }, {
            "name": "cereals",
            "type": "food"
        }, {
            "name": "soups",
            "type": "food"
        }, {
            "name": "stews",
            "type": "food"
        }, {
            "name": "sandwiches",
            "type": "food"
        }, {
            "name": "noodles",
            "type": "food"
        }, {
            "name": "Allopurinol",
            "type": "pills"
        }, {
            "name": "Alprazolam",
            "type": "pills"
        }, {
            "name": "Singulair",
            "type": "pills"
        }, {
            "name": "Hydrochlorothiazide",
            "type": "pills"
        }, {
            "name": "Carvedilol",
            "type": "pills"
        }, {
            "name": "Tramadol HCl",
            "type": "pills"
        }, {
            "name": "Metformin HCl",
            "type": "pills"
        }, {
            "name": "Cymbalta",
            "type": "pills"
        }, {
            "name": "Simvastatin",
            "type": "pills"
        }, {
            "name": "Namenda",
            "type": "pills"
        }, {
            "name": "Triamterene/Hydrochlorothiazide",
            "type": "pills"
        }, {
            "name": "Pantoprazole Sodium",
            "type": "pills"
        }, {
            "name": "Cyclobenzaprin HCl",
            "type": "pills"
        }, {
            "name": "Cephalexin",
            "type": "pills"
        }, {
            "name": "Lisinopril/Hydrochlorothiazide",
            "type": "pills"
        }, {
            "name": "Levaquin",
            "type": "pills"
        }, {
            "name": "Amoxicillin",
            "type": "pills"
        }, {
            "name": "Gabapentin",
            "type": "pills"
        }, {
            "name": "Fluoxetine HCl",
            "type": "pills"
        }, {
            "name": "Benicar",
            "type": "pills"
        }, {
            "name": "Premarin",
            "type": "pills"
        }, {
            "name": "Lovaza",
            "type": "pills"
        }, {
            "name": "Advair Diskus",
            "type": "pills"
        }, {
            "name": "Gianvi",
            "type": "pills"
        }, {
            "name": "Lantus Solostar",
            "type": "pills"
        }, {
            "name": "Zolpidem Tartrate",
            "type": "pills"
        }, {
            "name": "Diovan",
            "type": "pills"
        }, {
            "name": "TriNessa",
            "type": "pills"
        }, {
            "name": "Enalapril Maleate",
            "type": "pills"
        }, {
            "name": "Prednisone",
            "type": "pills"
        }, {
            "name": "Omeprazole (Rx)",
            "type": "pills"
        }, {
            "name": "Lisinopril",
            "type": "pills"
        }, {
            "name": "Potassium Chloride",
            "type": "pills"
        }, {
            "name": "Albuterol",
            "type": "pills"
        }, {
            "name": "Azithromycin",
            "type": "pills"
        }, {
            "name": "Zyprexa",
            "type": "pills"
        }, {
            "name": "Amlodipine Besylate",
            "type": "pills"
        }, {
            "name": "Promethazine HCl",
            "type": "pills"
        }, {
            "name": "Vyvanse",
            "type": "pills"
        }, {
            "name": "Oxycodone HCl",
            "type": "pills"
        }, {
            "name": "Vitamin D (Rx)",
            "type": "pills"
        }, {
            "name": "Endocet",
            "type": "pills"
        }, {
            "name": "Digoxin",
            "type": "pills"
        }, {
            "name": "Lidoderm",
            "type": "pills"
        }, {
            "name": "Trazodone HCl",
            "type": "pills"
        }, {
            "name": "Metoprolol Succinate",
            "type": "pills"
        }, {
            "name": "Seroquel",
            "type": "pills"
        }, {
            "name": "Ibuprofen (Rx)",
            "type": "pills"
        }, {
            "name": "Furosemide",
            "type": "pills"
        }, {
            "name": "Meloxicam",
            "type": "pills"
        }, {
            "name": "Lovastatin",
            "type": "pills"
        }, {
            "name": "Levothyroxine Sodium",
            "type": "pills"
        }, {
            "name": "Bystolic",
            "type": "pills"
        }, {
            "name": "Ranitidine HCl",
            "type": "pills"
        }, {
            "name": "Doxycycline Hyclate",
            "type": "pills"
        }, {
            "name": "Hydrocodone/APAP",
            "type": "pills"
        }, {
            "name": "Crestor",
            "type": "pills"
        }], function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a documents into the products collection.");
            products.createIndex({
                name: 1,
                type: 1
            }, {
                unique: true
            }, function(err, result) {
                assert.equal(err, null);
                console.info("Created unique index for products collection.");
                callback();
            });
        });
    });
};

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertCustomers(db, function() {
        insertShops(db, function() {
            insertProducts(db, function() {
                db.close();
            })
        });
    });
});
