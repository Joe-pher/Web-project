const express = require('express');
const router = express.Router();

var builder = require('xmlbuilder');
const Hotel = require('../models/hotels');
var libxmljs = require("libxmljs");



router.get('/domestic-cities', (req, res) => {
    const cities = ["tehran", "isfahan", "shiraz", "mashhad", "tabriz", "ahvaz", "booshehr"]
    res.json(cities)
})

router.get('/international-cities', (req, res) => {
    const cities = ["istanbul", "dubai", "paris", "ankara", "baku", "tblisi", "tokyo"]
    res.json(cities)
})


router.get('/:city', (req, res) => {
    Hotel.find({ city: req.params.city }, '_id name stars price images rate_number rate_desc', (err, hotels) => {
        if (err) return console.error(err);
        if (hotels) {
            const result = []
            hotels.forEach(h => result.push({
                '_id': h._id,
                'name': h.name,
                'stars': h.stars,
                'price': h.price,
                'image': h.images[0],
                'rate_number': h.rate_number,
                'rate_desc': h.rate_desc
            }))
            res.json(result);
        }
        else res.sendStatus(404);
    });
});

router.get('/hotel/:id', (req, res) => {
    Hotel.findOne({ _id: req.params.id }, '-__v -rate_number -rate_desc -price', (err, hotel) => {
        if (err) return console.error(err);
        if (hotel) res.send(hotel);
        else res.sendStatus(404);
    })
});

router.post('/hotel/:id/reserve', (req, res) => {
    b = `<rooms>
    <room>
        <name>master</name>
        <breakfast>true</breakfast>
        <price>43</price>
        <total>169</total>
    </room>
    <room>
        <name>deluxe</name>
        <breakfast>true</breakfast>
        <price>45</price>
        <total>180</total>
    </room>
    <room>
        <name>single</name>
        <breakfast>true</breakfast>
        <price>30</price>
        <total>100</total>
    </room>
    <room>
        <name>suite</name>
        <breakfast>true</breakfast>
        <price>60</price>
        <total>200</total>
    </room>
    <room>
        <name>great master</name>
        <breakfast>true</breakfast>
        <price>70</price>
        <total>210</total>
    </room>
    <room>
        <name>royale deluxe</name>
        <breakfast>false</breakfast>
        <price>100</price>
        <total>300</total>
    </room>
    <room>
        <name>imperial</name>
        <breakfast>true</breakfast>
        <price>90</price>
        <total></total>
    </room>
    </rooms>`
    res.set('Content-Type', 'text/xml')

    res.send(b)

})
router.post('/import', (req, res) => {
    let hotel = new Hotel(req.body);
    hotel.save((err, h) => {
        if (err) {
            console.error(err);
            res.sendStatus(400);
        }
        else res.sendStatus(200);
    });
});

module.exports = router;
