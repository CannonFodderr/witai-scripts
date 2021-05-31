const axios = require('axios')
const fs = require('fs/promises')

const APP_BASE_NAME = "TEST"
const APPS_FILTER = 'test'
const ADMIN_TOKEN = 'NAXAXUCSPSVJS3OR4BC3Q7J3D6QSQRTF'

let appsObject = {}

function deleteApps (appsList = []) {
  if (appsList.length < 1) {
    return console.log("Done")
  }
  const appToDelete = appsList.pop()
  const appId = appToDelete.id
  const appData = appsObject[appId]

  if (!appData) {
    return deleteApps(appsList)
  }

  const token = appData.accessToken

  var config = {
    method: 'delete',
    url: `https://api.wit.ai/apps/${appId}`,
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}`
    }
  };

  axios(config)
  .then(function (response) {
    console.log(`Deleted: ${appId}`)
    if (appsList.length >= 1) {
      deleteApps(appsList)
    } else {

    }
  })
  .catch(function (error) {
    console.log(error);
  });
}



async function getAllApps () {
  const file = await fs.readFile('./witapps.json')
  const { apps = {} } = JSON.parse(file)
  if (!apps) {
    console.log("No apps")
    return
  }
  appsObject = apps
  var data = '';
  
  var config = {
    method: 'get',
    url: 'https://api.wit.ai/apps?limit=1000',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    const appsData = response.data
    if (Array.isArray(appsData)) {
        const filteredApps = appsData.filter(app => app.name.toLowerCase().indexOf(APPS_FILTER) !== -1)
        deleteApps(filteredApps)
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}


getAllApps()