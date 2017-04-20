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
