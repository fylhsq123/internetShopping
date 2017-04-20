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
