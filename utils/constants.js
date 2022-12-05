// AIRTABLE API -uses airtable npm



// REGIONAL BASE IDs
export const gbBase = {
    naBaseId: 'appbpdKJXGtljWY7i', //'appVOKLbql3ITyvNZ',
    bzBaseId: '',
    euBaseId: '',
    wBaseId: '',
    cBaseId: '',
}




// TABLE NAMES AND IDs (BY BASE)
export const gbTable = {
    locations: {
        na: {
            // name: 'GB NA Locations',
            name: 'Prefs',
            id: ''
        },
        brazil: {},
        eu: {},
        world: {},
        central: {}
    },
    schoolOwners: {
        na: {
            tableName: 'GB NA School Owners',
            tableId: ''
        },
        brazil: {},
        eu: {},
        world: {},
        central: {}
    },
    students: {
        tableName: 'Students',
        naTableId: 'tbl3GeXNPhJ1qfBgR',
        brazilTableId: '',
        euTableId: '',
        worldTableId: '',
        centralTableId: ''
    }
}


//use if posting client id to table
// const airtableGB_NA_SchOwner_portalClientIdField = 'fld4yDXdQIs4ehiOZ'

