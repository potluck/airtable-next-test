import { gbBase, gbTable } from './constants'

// init Airtable and base
const Airtable = require('airtable');
const base = new Airtable({ 
    apiKey: 'keyJPd4UcThcv0lq0' //process.env.AIRTABLE_API_KEY 
}).base(gbBase.naBaseId);

// init tables
const colorsTable = base('Prefs');

/* 
    COLORS API
*/


const getColors = async function () {
    const records = await colorsTable.select({
        maxRecords: 150,
        view: "Grid view",
    }).firstPage();
    // console.log(records);

    let colorsArr = [];
    records.forEach((color) => {
        console.log(color);
        colorsArr.push({
            recordId: color.id,
            color: color.fields['Color'],
            likeIt: color.fields['Do you like it?'] || false
        });
    });
    console.log(colorsArr);
    return colorsArr;
};





// PATCH Belt Rank Verification to Airtable 
const updateBeltRank = async function (id, verified) {
    let updateVerified = ''
    await studentsTable.update([
        {
            "id": id,
            "fields": {
                "Belt Rank Verified": verified,
            }
        }]).then(res => updateVerified = res[0].fields['Belt Rank Verified']) // returns response containing only new verified status text for display
        return updateVerified
}

// PATCH Status (Active/Suspended) to Airtable 
const updateLikedStatus = async function (id, liked) {
    let statusUpdate = ''
    await colorsTable.update([
        {
            "id": id,
            "fields": {
                'Do you like it?': liked,
            }
        }]).then(res => statusUpdate = res[0].fields['Do you like it?'] || false) // returns response containing only new active/sus status text for display
        return statusUpdate
}




// exports
export { updateLikedStatus, getColors}