// Not working, find a way to wait until timescale is done initializing before going to periodName

import React, {useEffect} from 'react'
import timescale from './timescale';

export default function Timescale({periodName}) {
    useEffect(() => {
        timescale.init("timescale");
    }, [])

    useEffect(() => {
        console.log(periodName)
        timescale.goToName(periodName);
    }, [periodName])

    return (
        <div id="timescale">
        </div>
    )
}
