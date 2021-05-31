const axios = require('axios')
const fs = require('fs/promises')

const INTENT_BASE_NAME = 'testIntent'
const intentsArray = []

function createIntent (index = 0, max = 10, appData = null) {
    if (!appData) {
        console.error("No app data available")
        return
    }
    const { accessToken:token } = appData

    const intentName = INTENT_BASE_NAME + index.toString()
    var data = JSON.stringify({
        "name": intentName
      });
      
      var config = {
        method: 'post',
        url: 'https://api.wit.ai/intents',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        data : data
      }
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        
        console.log("Created intent: ", intentName)
        intentsArray.push(intentName)
        writeToFile(appData.appId)
        if (index < max) {
            createIntent(index + 1, max, appData)
        }
      })
      .catch(function (error) {
        
        console.log("Failed to create intent: ", intentName)
        console.error(error.message)
        if (index < max) {
            createIntent(index + 1, max, appData)
        }
      })
}



async function writeToFile (appId) {
    const res = await fs.writeFile(`./files/intents-${appId}.json`, `{ "appId": ${appId}, "apps": ${JSON.stringify(intentsArray)}, "date": ${Date.now()} }`)
    if (!res) {
        return null
    }
    return res
}


// async function getAppDetails (appId = APP_ID) {
//     const file = await fs.readFile('./witapps.json')
//     const { apps = {} } = JSON.parse(file)
//     if (!apps) {
//         console.log("No apps")
//         return
//     }
//     const appsObject = apps
//     return appsObject[appId]
// }

// getAppDetails()
// .then((appData) => {
//     console.log({appData})
//     createIntent(0, 10, appData)
// })
// .catch((err) => {
//     console.error(err)
// })
createIntent(0, 1000, { accessToken: 'JQCRUYZMFXES2PWBVZKJOADVHMJL6MKK', appId: '169300508467384' })