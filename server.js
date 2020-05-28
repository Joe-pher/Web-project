const express = require('express')
const bodyParser = require('body-parser');
const xmlparser = require('express-xml-bodyparser');
const mongoose = require('mongoose');

const hotelsRoute = require('./routes/hotels');
const hotelRoute = require('./routes/hotel');
// connect to MongoDB
const configs = require('./configs');
mongoose.connect(configs.database, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) console.error('ERROR! ' + err);
    else console.log('connected to database');
});


const PORT = 8080;
const app = express()
xmlparser.regexp = /^application\/xml$/i;
app.use(bodyParser.json({type: "application/json"}));
app.use(bodyParser.text({type: "application/xml"}));
// app.use(xmlparser());

// routes
app.post('/hotel/search', (req, res) => {
    var x = require('libxmljs');

    var xsd = `<?xml version="1.0" encoding="UTF-8"?>
    <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema" elementFormDefault="qualified">
      <xs:element name="hotel">
        <xs:complexType>
          <xs:sequence>
            <xs:element ref="city"/>
            <xs:element ref="from"/>
            <xs:element ref="to"/>
            <xs:element ref="guests"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="city" type="xs:string"/>
      <xs:element name="from" type="xs:date"/>
      <xs:element name="to" type="xs:date"/>
      <xs:element name="guests">
        <xs:complexType>
          <xs:sequence>
            <xs:element ref="parents"/>
            <xs:element ref="children"/>
          </xs:sequence>
        </xs:complexType>
      </xs:element>
      <xs:element name="parents" type="xs:integer"/>
      <xs:element name="children" type="xs:integer"/>
    </xs:schema>`
    var xsdDoc = x.parseXmlString(xsd);
    console.log(req)
    console.log(req.headers)
    console.log(req.body)
    let xml0 = req.body
    var xmlDoc0 = x.parseXmlString(xml0);
    var result0 = xmlDoc0.validate(xsdDoc);

    res.statusCode = 200
    if (result0 == false) {
        res.statusCode = 400
    }
    res.send()
    console.log(result0)
    //console.log("result0:", result0);
})
app.use('/hotel', hotelRoute);
app.use('/hotels', hotelsRoute);
app.get('/sub', (req, res) => res.send('Hello World!')) 



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
