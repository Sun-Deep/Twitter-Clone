const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose');
const Filter = require('bad-words')
const rateLimit = require('express-rate-limit')
require('dotenv').config()


const app = express()

mongoose.connect('process.env.MONGO_DB', {useNewUrlParser: true, useUnifiedTopology: true});


// model for tweets
const Tweet = mongoose.model('Tweet', {
    name: String,
    tweet: String,
    created: Date
})

app.use(cors())
app.use(express.json())


const filter = new Filter()

function isValidTweet(tweet){
    return tweet.name && tweet.name.toString().trim() !== '' && tweet.tweet && tweet.tweet.toString().trim() !== ''
}

app.get('/', (req, res) => {
    res.json({
        message: 'Hello'
    })
})

app.get('/tweets', (req, res) => {
    Tweet
        .find()
        .then(tweets => {
            res.json(tweets)
    })
})

app.use(rateLimit({
    windowMs: 15 * 1000,
    max: 1
}))

app.post('/tweets', (req, res) => {
    if(isValidTweet(req.body)){
        const tweet = {
            name: filter.clean(req.body.name.toString()),
            tweet: filter.clean(req.body.tweet.toString()),
            created: new Date()
        }

        const twt = new Tweet(tweet)
        twt.save().then(createdTweet => {
            res.json(createdTweet)
        })
    }else{
        res.status(422)
        res.json({
            message: 'Name and Tweet are required!'
        })
    }
    
})


app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
    
})