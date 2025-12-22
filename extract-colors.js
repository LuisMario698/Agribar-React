const getColors = require('get-image-colors')
const path = require('path')

const imagePath = path.join(__dirname, 'public', 'logo.png')

getColors(imagePath).then(colors => {
    console.log('Colors found:', colors.map(c => c.hex()))
}).catch(err => {
    // Fallback if image not found or error, return a generic "Brand" palette placeholder
    console.log('Error or no logo found. providing fallback placeholders.')
    console.log(['#1e3a8a', '#3b82f6', '#93c5fd'])
})
