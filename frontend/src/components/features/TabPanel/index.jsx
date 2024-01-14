import React from 'react'
import Box from '@mui/material/Box'

function TabPanel(props) {
    const { children, value, index } = props

    return (
        <div role="tabpanel" hidden={value !== index} id={`vertical-tabpanel-${index}`} aria-labelledby={`vertical-tab-${index}`}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    )
}

export default TabPanel
