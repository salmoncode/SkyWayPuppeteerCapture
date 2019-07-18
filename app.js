const express = require('express')
const app = express()
const puppeteer = require('puppeteer');
const fs = require('fs')

let browser
let page
const initBrowser = async () => {
    browser = await puppeteer.launch()
    page = await browser.newPage()
    page.goto('http://localhost:3000/init')
}

initBrowser()
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', async (req, res) => {
    let bitMap = await page.evaluate(async () => await getImage())
    bitMap = bitMap.split(';base64,').pop()
    const fileName = "result.png"
    fs.writeFile(`public/${fileName}`, bitMap, { encoding: 'base64' }, err => res.redirect(`/${fileName}`))
})

app.get('/init', (req, res) => res.render('./server'))
app.get('/connect', (req, res) => res.render('./client'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))