const Scraper = require('images-scraper');
const express = require('express');
const mongoose = require('mongoose')
const MONGODB_URI = 'mongodb://localhost/searchTerms' || process.env.MONGODB_URI;
const Search = require('./model/SearchSchema')
const cors = require('cors')
const app = express();
 
const google = new Scraper({
  puppeteer: {
    headless: true,
  },
  tbs: {  // every possible tbs search option, some examples and more info: http://jwebnet.net/advancedgooglesearch.html
    isz:  'm'
  },
});

app.use(cors())
app.use(express.urlencoded({extended : false}))


const db = mongoose.connection;
mongoose.connect(MONGODB_URI, ({useNewUrlParser : true, useUnifiedTopology : true}))

db.once('open', () => console.log("Connected to database..."))

app.get('/search/:q*',async (req, res) => {
    const {q} = req.params;
    const {offset} = req.query;

    try {
        const doc = await Search.findOne({query : q})
        if(!doc) {
            const newSearch = new Search({
                query : q,
                created : new Date(),
                bumped : new Date()
            })

            await newSearch.save()
        } else {
            doc.bumped = new Date();
            await doc.save();
        }
    } catch(err) {
        if(err) throw err;
    }

    


    var arrayRes = [];
    const results = await google.scrape(q, 100);
    const response = results.map(result => {
        const obj = {
            url : result.url,
            page_url : result.source,
            alt_text : result.description
        }
        return obj
    })
    

    var i,j,chunk = 10;
    for (i=0,j=response.length; i<j; i+=chunk) {
        arrayRes.push(response.slice(i,i+chunk));
    }

    if(offset === undefined) {
        res.json(arrayRes[0]);
    } else if(offset > 9) {
        res.json("Result only contains the first 10 pages.")
    } else if(offset < 0) {
        res.json("Offset cannot be a negative number.")
    } else {
        res.json(arrayRes[offset])
    }
    
})


app.get('/recent', async (req, res) => {
    const recent = await Search.find({},{_id : 0, created : 0}).sort({bumped: 'desc'})
    res.json(recent);
})


app.get('/*', (req, res)=> {
    res.status(400).send("Page not found");
})
 




app.listen(5000);