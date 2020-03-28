const form = document.querySelector('form')
const loadingElement = document.querySelector('.loading')
const API_URL = 'http://localhost:5000/tweets'
const tweetsElement = document.querySelector('.tweets')

loadingElement.style.display = 'none'

listAllTweets()


form.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const formData = new FormData(form)
    const name = formData.get('name')
    const tweet = formData.get('tweet')
    const data = {
        name,
        tweet
    }
    form.style.display = 'none'
    loadingElement.style.display = ''
    fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    }).then(response => response.json())
      .then(createdTweet => {
          form.reset()
          form.style.display = ''
          listAllTweets()
          loadingElement.style.display = 'none' 

      })
})

function listAllTweets(){
    tweetsElement.innerHTML = ''
    fetch(API_URL)
        .then(response => response.json())
        .then(tweets => {
            tweets.reverse()
            tweets.forEach(tweet => {
                const div = document.createElement('div')

                const header = document.createElement('h3')
                header.textContent = tweet.name

                const contents = document.createElement('p')
                contents.textContent = tweet.tweet

                const date = document.createElement('small')
                date.textContent = new Date(tweet.created).toLocaleString()
                date.style.color = '#33C3F0'

                div.appendChild(header)
                div.appendChild(contents)
                div.appendChild(date)
                div.appendChild(document.createElement('hr'))
                tweetsElement.appendChild(div)
            })
        })
}