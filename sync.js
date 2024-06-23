import fs from 'node:fs/promises'

const syncData = async () => {

    const cctvContent = await fs.readFile('cctvSamarinda.json', {encoding: 'utf-8', flag: 'r'})
   
    const cctvJson = JSON.parse(cctvContent)
    
    const santerFile = await fs.readFile('cctvSamarindaSanter.json', {encoding: 'utf-8', flag: 'r'})
   
    const santerJson = JSON.parse(santerFile)

    santerJson.apis.map((data, index) => {
        cctvJson.apis[index].apiSanter = data.api
    })

    fs.writeFile('cctvSamarinda.json', JSON.stringify(cctvJson), { flag: 'w', encoding: 'utf-8' }, (err) => {
        if (err) {
            throw err
        }
    })

    console.log(cctvJson);
}

syncData()