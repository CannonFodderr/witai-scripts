var axios = require('axios');



function createUtterance (index = 0, max = 1, appData = null) {
  if (index >= max) {
    return
  }

  const utteranceName =  "test Utterance " + index.toString()
  const { accessToken } = appData
  var data = JSON.stringify([
    {
      "text": utteranceName,
      "intent": "testIntent0",
      "entities": [],
      "traits": []
    }
  ]);
  
  var config = {
    method: 'post',
    url: 'https://api.wit.ai/utterances',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${accessToken}`
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    console.log("Created utterance: ", utteranceName)
    createUtterance(index + 1, max, appData)
  })
  .catch(function (error) {
    console.log("Failed to create utterance: ", utteranceName)
    console.error(error);
    createUtterance(index + 1, max, appData)
  })
}

createUtterance(0, 1000, { accessToken: 'JQCRUYZMFXES2PWBVZKJOADVHMJL6MKK', appId: '169300508467384' })