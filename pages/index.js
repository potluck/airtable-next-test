import Head from 'next/head'
import Container from '../Components/container'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { updateLikedStatus, getColors } from '../utils/airtable'


/* 
-------------GLOBALS-------------------
*/

// VARIABLES
let clientId;


// HEADERS
const portalGetReq = {
    method: 'GET',
    headers: {
        "X-API-KEY": 'keyJPd4UcThcv0lq0', //process.env.PORTAL_API_KEY,
        "Content-Type": "application/json"
    }
}





/* 
-------------APP------------------- 
*/

function HomePage(props) {
    const router = useRouter()
    console.log(router);
    const refreshData = () => { router.replace(router.asPath) }

    // RESET STATES FUNCTION
    const reset = () => {
        setLiked('');
        setSelected('');
    }


    const [selected, setSelected] = useState('') // SELECTED COLOR STATE

    const [liked, setLiked] = useState('');

    useEffect(() => {
        // CHECK IF COLOR IS SELECTED AND SET STATE
        console.log('hi pots 2');
        if (selected !== '' && selected !== 'select color') {
            let colorRecord = props.allColors.filter(color => color.recordId === selected);

            console.log('hi pots 3');
            setLiked(colorRecord[0].likeIt);
        } else if (selected === 'select color' || '') {
            reset()
        }
    }, [selected]);



    // UPDATE STATUS AND REFRESH DATA
    const handleUpdateLikedStatus = async function (id, liked) {
        updateLikedStatus(id, liked).then(res => setLiked(res))
        refreshData()
    }

    // CONDITIONALLY DISPLAY ACTIVATE/SUSPEND BUTTON
    const displayLikedStatus = () => {
        if (liked) {
            return <button value="Unlike" onClick={e => handleUpdateLikedStatus(selected, false)}>Unlike</button>
        } else  {
            return <button value="Like" onClick={e => handleUpdateLikedStatus(selected, true)}>Like</button>
        }
    }

    const handleColorChange = (newColor) => {
        setSelected(newColor);
    }


    return (
        <>
            <Container>
                <Head>
                    <title>Color Actions</title>
                </Head>
                <div className='header'><h1>Color Actions</h1></div>
                <div className='flex-container'>
                    <div className='custom-select'>
                        <select className="select-selected" onChange={e => { handleColorChange(e.target.value) }}>
                            <option value="select color">Select Color!</option>
                            {props.allColors.map((color) =>
                                    <option key={color.recordId} value={color.recordId}>{color.color}</option>)}
                        </select>
                    </div>
                    {selected !== '' ? 
                    <div>
                        <div className='row'>Do you like it? Currently: <span className='input'>{liked? "Yes": "No"}</span></div>
                        <div className='row'>
                            <div className='btn'>
                                {displayLikedStatus()}
                            </div>
                        </div> 
                        </div>
                    : null}
                </div>
            </Container>
        </>
    )
}


export default HomePage






/* 
-------------SERVER-------------------
*/

export async function getServerSideProps(context) {

    console.log("hi pots 1");

    // -------------PORTAL API-------------------

    // CHECK PORTAL CLIENT ID FROM PARAMS

    // SET PORTAL CLIENT ID FROM PARAMS
    clientId = context.query.clientId

    // TEMP CLIENT ID FOR TESTING
    // clientId = '7f999f5e-0b43-4598-97fc-0ccaac0136fe'

    // GET CLIENT OBJECT FROM clientId -> PORTAL API
    const clientRes = await fetch(`https://api-beta.joinportal.com/v1/client/${clientId}`, portalGetReq)
    const clientData = await clientRes.json()

    // CONSTRUCT FULL NAME
    const fullName = `${clientData.givenName} ${clientData.familyName}`



    // -------------AIRTABLE API -------------------

    const allColors = await getColors();

    // -----------PROPS-----------------------------
    return {
        props: {
            allColors
        }
    }
}

