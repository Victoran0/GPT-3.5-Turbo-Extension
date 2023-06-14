const API_KEY = 'hidden'
const submitBtn = document.getElementById('submit')
const output = document.getElementById('output')
const input = document.querySelector('input')
const history = document.querySelector('.history')
const newChat = document.querySelector('button')
const histories = {}

const getHistories = async () => {
    let obj = {}
    await chrome.storage.local.get(['histories']).then((result) => {
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
        console.log(data)
        output.textContent = data.choices[0].message.content
        if (data.choices[0].message.content && input.value) {
            const pElement = document.createElement('p')
            pElement.textContent = input.value
            history.append(pElement)
            histories[input.value] = output.textContent
            chrome.storage.sync.set({histories: JSON.stringify(histories)})
            console.log('histories:', histories)
        }
    } catch (error) {
        console.log(error)
    }
}

submitBtn.addEventListener('click', getMessage)


newChat.addEventListener('click', () => {
    input.value = ''
    output.textContent = ''
})

history.innerHTML =
    Object.keys(histories).map((ele, id) => {
        `
            <p id="${id}"> ${ele.input} </p>
        `
    })

history.addEventListener('click', (e) => {
    console.log(e.target)
    input.value = e.target.textContent
    output.textContent = histories[e.target.textContent]
})

// pElement.addEventListener('click', () => {
//     input.value = pElement.textContent
// })