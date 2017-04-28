# internetShopping REST API (test project)

To start using this API you have to download files and run

`npm install`

`node server.js`

# API description

## CUSTOMERS

### Customers [/customers]
**Get list of customers [GET]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```

**Register new customer [POST]**

Body:
  
```javascript
{
     first_name: {
         type: String,
         required: true
     },
     last_name: {
         type: String,
         required: true
     },
     phone_number: {
         type: String,
         validator /\d+/.test(v)
         required: true
     },
     email: {
         type: String,
         validator: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v)
         required: true
     },
     address: {
         type: String,
         required: true
     },
     city: {
         type: String,
         required: true
     },
     country: {
         type: String
     },
     zip_code: {
         type: String,
         required: true
     },
     date_of_birth: {
         type: Date
     },
     password: {
         type: String,
         required: true
     }
}
```
## COUNTRIES AND CITIES
### Countries [/countries]
**Get list of coutries [GET]**

### Cities [/cities/{countryId}]
**Get list of cities [GET]**
+ Parameters

    + countryId: 58f0d7c6716e0f67441b0b05 (required) - Unique identifier for a country

## CUSTOMER

### Authenticate [/authenticate]
**USER Authentication [POST]**

Body:
  
```javascript
{
     email: {
         type: String,
         validator: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v)
         required: true
     },
     password: {
         type: String,
         required: true
     }
}
```
### Logout [/logout]
**USER Logout [GET]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```

### Customer [/customer]
**Get USER information [GET]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```

**Update USER information [PUT]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```
Body:
  
```javascript
{
     first_name: {
         type: String,
         required: true
     },
     last_name: {
         type: String,
         required: true
     },
     phone_number: {
         type: String,
         validator /\d+/.test(v)
         required: true
     },
     email: {
         type: String,
         validator: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(v)
         required: true
     },
     address: {
         type: String,
         required: true
     },
     city: {
         type: String,
         required: true
     },
     country: {
         type: String
     },
     zip_code: {
         type: String,
         required: true
     },
     date_of_birth: {
         type: Date
     },
     password: {
         type: String,
         required: true
     }
}
```

**Delete USER information [DELETE]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```

## CATEGORIES
### All hierarchy [/categories]
**Get all hierarchy of categories/subcategories [GET]**

### Cities [/subcategories/{categoryId}]
**Get subcategories of specified category [GET]**
+ Parameters

    + categoryId: 58fdb56d93c22716c88234c4 (required) - Unique identifier for a category

## PRODUCTS
### List products [/products]
**Get list of all products [GET]**

### List products [/products/bysubcategory/{subcategoryId}/{sortBy}/{sortOrder}]
**Get list of products with specified subcategory [GET]**
+ Parameters

    + subcategoryId: 58fdb56d93c22716c88234bf (required) - Unique identifier for a subcategory
    + sortBy: "name" (optional) - Name of the field which will be use to sort by
    + sortOrder: ["asc", "desc"] (optional) - Sort order

### List products [/products/byseller/{sellerId}/{sortBy}/{sortOrder}]
**Get list of products with specified seller [GET]**
+ Parameters

    + sellerId: 58f7517043fde1207c1562a2 (required) - Unique identifier for a seller
    + sortBy: "name" (optional) - Name of the field which will be use to sort by
    + sortOrder: ["asc", "desc"] (optional) - Sort order

### List products [/products/bysellerandsubcategory/{sellerId}/{subcategoryId}/{sortBy}/{sortOrder}]
**Get list of products with specified seller and subcategory [GET]**
+ Parameters

    + sellerId: 58f7517043fde1207c1562a2 (required) - Unique identifier for a seller
    + subcategoryId: 58fdb56d93c22716c88234bf (required) - Unique identifier for a subcategory
    + sortBy: "name" (optional) - Name of the field which will be use to sort by
    + sortOrder: ["asc", "desc"] (optional) - Sort order

### Get general info about product [/products/{productId}]
**Get information about product which is available for unauthorized users [GET]**
+ Parameters

    + productId: 59009df29cf77d3a40479fda (required) - Unique identifier for a product

### Managing products [/product]
**Create new product [POST]**

Header:
```javascript
    Authorization: {AuthorizationToken}
```
Body:
  
```javascript
{
     name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String(converted to DataURI)
    },
    subcategory_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    seller_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Customers'
    },
    count_bought: {
        type: Number,
        default: 0
    },
    count_sold: {
        type: Number,
        default: 0
    },
    price_bought: {
        type: Number,
        default: 0
    },
    price_sold: {
        type: Number,
        default: 0
    }
}
```

