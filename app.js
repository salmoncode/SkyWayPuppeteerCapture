const express = require('express')
const app = express()
const puppeteer = require('puppeteer')
const { App : Bot} = require('@slack/bolt')

const bot = new Bot({
    token: "",
    signingSecret: ""
})

bot.message(/^capture get (.*)/, async ({ message, say, context }) => {
    let peerId = context.matches[1]
    if(peerId.match(/[0-9]+/)) {
        const streams = await page.evaluate(() => streams)
        peerId = streams[peerId - 1].peerId
    }

    let bitMap = await page.evaluate(async peerId => await getImage(peerId), peerId)
    if(!bitMap) {
        say("そのカメラは見つからなかったよ…")
        return
    }

    bitMap = bitMap.split(';base64,').pop()

    await bot.client.files.upload({
        token: context.botToken,
        channels: message.channel,
        file: new Buffer(bitMap, 'base64')
    })
})

bot.message(/^capture list/, async ({ message, say }) =>{
    const streams = await page.evaluate(() => streams)
    let reply = "接続されているカメラ一覧ですぜ\n"
    if(streams.length === 0) reply = "接続されているカメラはありませんぜ"
    else reply += streams.map((stream, idx) => `${idx+1}. ${stream.peerId}`).join("\n")
    say(reply)
})

bot.start(8080)

let browser
let page

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.get('/init', (req, res) => res.render('./server'))
app.get('/connect', (req, res) => res.render('./client'))

app.listen(3000, async () => {
    browser = await puppeteer.launch({headless: true})
    page = await browser.newPage()
    page.goto('http://localhost:3000/init')
})
