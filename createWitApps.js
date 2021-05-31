const axios = require('axios')
const fs = require('fs/promises')

const APP_BASE_NAME = "TEST"

let appsObject = {}


async function setupRequest (appName = APP_BASE_NAME, index = 1, max = 1000) {
    const name = appName + index.toString()
    var data = JSON.stringify({
        "name": name,
        "lang": "en",
        "private": true,
        "timezone": "Europe/Brussels"
      });
      
      var config = {
        method: 'post',
        url: 'https://api.wit.ai/apps',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': 'Bearer NAXAXUCSPSVJS3OR4BC3Q7J3D6QSQRTF'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        const data = response.data
        const { app_id: appId , access_token: accessToken } = data

        appsObject[appId] = {
            accessToken,
            name
        }
        const fileUpdated = await writeToFile()
        if(!fileUpdated) {
            console.error("Failed to updated local file")
        }

        if (index < max) {
            setupRequest(APP_BASE_NAME, index + 1, max)
        } else {
            console.log(`Completed ${index} app creations`)
        }

      })
      .catch(function (error) {
        writeToFile()
        console.log(`Done with error after ${index} app creations`)
        console.log(error)
      })
}



async function writeToFile () {
    const res = await fs.writeFile('./files/witapps.json', `{ "apps": ${JSON.stringify(appsObject)}, "date": ${Date.now()} }`)
    return res
}


fs.readFile('./witapps.json')
.then((data) => {
    if (!data) return
    const fileJson = JSON.parse(data)
    appsObject = fileJson.apps ? fileJson.apps : {}
    setupRequest()
})
.catch((err) => {
    console.log({err})
})