import { gbBase, gbTable } from './constants'

// init Airtable and base
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(gbBase.naBaseId);

// init tables
const studentsTable = base(gbTable.students.tableName)
const locsTable = base(gbTable.locations.na.name)

/* 
    LOCATIONS API
*/

const getLocation = async function (clientName) {
    let locsArr = []

    const records = await locsTable.select({
        // Selecting the record with matching full name
        maxRecords: 150,
        view: "Grid view",
        filterByFormula: `{School Owner} = "${clientName}"`
    }).firstPage()


    // console.log(records)
    records.forEach((record) => {
        // console.log(record.fields['School Name'])
        locsArr.push({
            schoolName: record.fields['School Name'],
            recordId: record.id
        })
    })
    // console.log(locsArr)
    return locsArr
}





/* 
    STUDENTS API
*/

// get all students and map fields
const getStudents = async function (clientName) {
    let studentsArr = []

    const records = await studentsTable.select({
        // Selecting the record with matching full name
        // maxRecords: 150,
        view: "Grid view",
        filterByFormula: `{School Owner (from Gracie Barra Location)} = "${clientName}"`
    }).eachPage(function page(records, fetchNextPage){

        records.forEach((record) => {
            let currentRank = ''
            let isVerified = ''
            let currentStatus = ''
            if (record.fields['Belt Rank']) { currentRank = record.fields['Belt Rank'] } else {currentRank = 'N/A'}
            if (record.fields['Belt Rank Verified']) { isVerified = record.fields['Belt Rank Verified'] } else {isVerified = 'N/A'}
            if (record.fields.Status) { currentStatus = record.fields.Status } else {currentStatus = 'N/A'}
            studentsArr.push({
                name: record.fields.Student,
                recordId: record.id,
                rank: currentRank,
                isVerified: isVerified,
                status: currentStatus,
                school: record.fields['Gracie Barra Location'][0]
            })
        })

        fetchNextPage()

    })
    // console.log(records)
    // console.log(studentsArr)
    return studentsArr
}


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
const updateStatus = async function (id, status) {
    let statusUpdate = ''
    await studentsTable.update([
        {
            "id": id,
            "fields": {
                Status: status,
            }
        }]).then(res => statusUpdate = res[0].fields.Status) // returns response containing only new active/sus status text for display
        return statusUpdate
}




// exports
export { getStudents, updateBeltRank, updateStatus, getLocation}