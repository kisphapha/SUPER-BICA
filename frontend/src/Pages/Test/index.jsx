import { Tooltip, Stack, Slider } from '@mui/material'
import React, { useState } from 'react'

export default function Test() {
    const [value, setValue] = useState(0)

    function handleChange(e) {
        setValue(e.target.value)
    }

    return (
        <div>
            <h1>Thanh cong roi</h1>
        </div>
    )
}
