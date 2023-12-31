const API_KEY = 'hidden'
const submitBtn = document.getElementById('submit')
const output = document.getElementById('output')
const input = document.querySelector('input')
const history = document.querySelector('.history')
const newChat = document.querySelector('button')
let histories = {}

const getHistories = async () => {
    let obj = {}
    await chrome.storage.local.get(['key']).then((result) => {
        if (result.key) {
            obj = JSON.parse(result.key)
        }
    });
    return obj;
}

async function getMessage() {
    const options =  {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: input.value}],
            max_tokens: 100
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        output.textContent = data.choices[0].message.content
        if (input.value && data && data.choices[0].message.content) {
            const pElement = document.createElement('p')
            pElement.textContent = input.value
            history.append(pElement)
            histories[input.value] = output.textContent
            chrome.storage.local.set({key: JSON.stringify(histories)}).then(() => console.log('sent to storage:', histories))
        }
    } catch (error) {
        output.textContent = error
    }
}

submitBtn.addEventListener('click', getMessage)


newChat.addEventListener('click', () => {
    input.value = ''
    output.textContent = ''
})

getHistories().then((result) => {
    Object.keys(result).map((ele) => {
        history.innerHTML += `<p> ${ele} </p>`
    })
})

history.addEventListener('click', (e) => {
    if (e.target.tagName !== 'DIV') {
        input.value = e.target.textContent
        getHistories().then((result) => {
            output.textContent = result[e.target.textContent.trim()]
        })
    }
})