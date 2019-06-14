const credentials = require('./credentials')
const discord = require('discord.js')
const bot = new discord.Client()

bot.on('ready', () => {
    console.info("🍞 Super hyper toasting abilities activated!")
    bot.user.setActivity('sizzling toast.', {type: 'LISTENING'});
})

bot.on('message', message => {
    let userid = message.author.id
})

bot.login(credentials.token)