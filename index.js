const credentials = require('./credentials')
const admin = require('firebase-admin')
const firestore = require('@google-cloud/firestore')
const request = require('request')
const discord = require('discord.js')
const bot = new discord.Client()
const account = require('./GCP.json')
admin.initializeApp({
    credential: admin.credential.cert(account)
})
const db = admin.firestore()
const prefix = "~"
const error = new discord.RichEmbed()
    .setColor("#f44242")
    .setDescription(`🔥 Ah, this is embarrassing...`)
    .addField(`An internal error occured :/`, `Let <@237768953739476993> know!`, true)
    .setThumbnail("https://cdn.discordapp.com/attachments/478645567786844171/589264179739754516/dumpsterfire.gif")


bot.on('ready', function () {
    console.info("🍞 Super hyper toasting abilities activated!")
    bot.user.setActivity('sizzling toast.', { type: 'LISTENING' })
})

bot.on('message', function (message) {
    if (message.author.bot) return
    if (!message.content.startsWith(prefix)) {
        db.collection('users').doc(message.author.id).update({
            messages: firestore.FieldValue.increment(1),
            coins: firestore.FieldValue.increment(Math.floor(Math.random() * 35)),
        })
        .then(() => {
            db.collection('users').doc(message.author.id).get()
            .then(doc => {
                let data = doc.data()
                let messages = parseInt(data.messages)
                let level = parseInt(data.level)

                console.log(`${Math.pow(2, level + 1)} needed, have ${messages}`)
                if (messages === Math.pow(2, level + 1)) {
                    let coins = 25 * level
                    db.collection('users').doc(message.author.id).update({
                        level: firestore.FieldValue.increment(1),
                        coins: firestore.FieldValue.increment(coins)
                    })
                    let embed = new discord.RichEmbed()
                    .setColor("#f44242")
                    .setDescription(`🎉 ${message.author} leveled up!`)
                    .addField(`Level ${level + 1} (+${coins} coins)`, `${Math.pow(2, level + 2) - messages} messages needed to\nreach level ${level + 2}`)
                    .setThumbnail(message.author.avatarURL)
                    message.channel.send(embed)
                }
            })
            .catch((e) => {
                console.log(e)
                message.channel.send(error)
            })
        })
        .catch(() => {
            let data = {
                'coins': 0,
                'level': 0,
                'messages': 1
            }
            db.collection('users').doc(message.author.id).set(data)
        })
        return;
    }
    let args = message.content.slice(prefix.length).split(/\s+/)
    let command = args.shift().toLowerCase()

    if (~['coins', '$', 'money'].indexOf(command)) {
        message.channel.startTyping()
        db.collection('users').doc(message.author.id).get()
        .then(doc => {
            if (!doc.exists) return;
            return doc.data().coins
        })
        .then(coins => {
            let embed = new discord.RichEmbed()
            .setColor("#42f48f")
            .setDescription(`💸 ${message.author}'s current coins.`)
            .addField(`${coins.toLocaleString()} coins`, 'Coins can be spent at the dashboard!\n`~dashboard`', true)
            .setThumbnail(message.author.avatarURL)
            message.channel.send(embed)
        })
        .catch(() => {
           // message.channel.send(error)
        })
    }
    else if (~['level', 'lvl'].indexOf(command)) {
        message.channel.startTyping()
        db.collection('users').doc(message.author.id).get()
        .then(doc => {
            let data = doc.data()
            let messages = parseInt(data.messages)
            let level = parseInt(data.level)

            let embed = new discord.RichEmbed()
            .setColor("#f44242")
            .setDescription(`📊 ${message.author}'s current level.`)
            .addField(`Level ${level + 1}`, `${Math.pow(2, level + 2) - messages} messages needed to\nreach level ${level + 2}`)
            .setThumbnail(message.author.avatarURL)
            message.channel.send(embed)
        })
        .catch((e) => {
            console.log(e)
            //message.channel.send(error)
        })
    }
    message.channel.stopTyping()
})

bot.on('guildMemberAdd', member => {
    let data = {
        'coins': 0,
        'level': 0,
        'messages': 1
    }
    db.collection('users').doc(member.id).set(data)
})

bot.on('guildMemberRemove', member => {
    db.collection('users').doc(member.id).delete()
})

// Stream notifier
setTimeout(() => {
    const options = {
        method: 'GET',
        uri: 'https://api.twitch.tv/helix/streams?user_login=NestedVariables',
        headers: {
            'Client-ID': 'jv2au2y9ktr33i5a2orq6p6kthxdpo'
        }
    }
    request.get(options, (error, res, body) => {
        let data = JSON.parse(body)
        if (data['data'].length == 0) {
            bot.user.setActivity('sizzling toast.', { type: 'LISTENING' })
        }
        else {
            console.log("Streaming.")
            bot.user.setActivity(data['data'][0]['title'], { 
                type: 'STREAMING',
                url: "https://www.twitch.tv/NestedVariables"
            })
        }
    })
}, 60000);

bot.login(credentials.token)