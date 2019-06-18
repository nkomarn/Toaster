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


bot.on('ready', () => {
    console.info("🍞 Super hyper toasting abilities activated!")
    bot.user.setActivity('sizzling toast.', { type: 'LISTENING' })
})

bot.on('message', (message) => {
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
            .addField(`Level ${level}`, `${Math.pow(2, level + 1) - messages} messages needed to\nreach level ${level + 1}`)
            .setThumbnail(message.author.avatarURL)
            message.channel.send(embed)
        })
        .catch((e) => {
            console.log(e)
            //message.channel.send(error)
        })
    }
    else if (~['ranks', 'rankings'].indexOf(command)) {
        message.channel.startTyping()
        let embed = new discord.RichEmbed().setColor('#ff8738').setTitle('📚 The Rankings.').setImage('https://media.giphy.com/media/U6pavBhRsbNbPzrwWg/giphy-downsized.gif')
        db.collection('users').orderBy('messages', 'desc').limit(6).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let data = doc.data()
                embed.addField(`👑 ${bot.guilds.get('285623631042707457').members.get(doc.id).displayName} (Level ${data.level})`, 
                    `${data.messages.toLocaleString()} messages - ${data.coins.toLocaleString()} coins`, true)
            })
            message.channel.send(embed)
        })
        .catch(() => {
            message.channel.send(error)
        })
    }
    else if (~['dashboard', 'shop'].indexOf(command)) {
        message.channel.startTyping()
    }
    else if (~['help', 'commands'].indexOf(command)) {
        message.channel.startTyping()
        let embed = new discord.RichEmbed()
        .setColor('#f4d442')
        .setTitle("🍞 Toaster Usage Guide!")
        .addField('📊 Check level', '`~level`, `~lvl`', true)
        .addField('💰 Check coins', '`~coins`, `~$`, `~money`', true)
        .addField('📈 View rankings', '`~rankings`, `~ranks`', true)
        .addField('⚡ View dashboard', '`~dashboard`, `~shop`', true)
        .addField('🚨 Report Abuse', '`~report`', true)
        .setImage('https://media.giphy.com/media/fdLR6LGwAiVNhGQNvf/giphy.gif')
        message.channel.send(embed)
    }
    else if (~['report'].indexOf(command)) {
        message.channel.startTyping()
        if (args.length < 2) {
            let embed = new discord.RichEmbed()
            .setColor("#f44242")
            .setTitle('🚨 Can\'t submit your report!')
            .setDescription("Make sure you fill out everything.\n`~report <mention user> <describe behavior>`")
            .setThumbnail('https://media.giphy.com/media/RYjnzPS8u0jAs/giphy.gif')
            message.channel.send(embed)
        }
        else {
            const matches = args[0].match(/^<@!?(\d+)>$/);
            if (matches != undefined) {
                const id = matches[1];

                message.delete()
                let embed = new discord.RichEmbed()
                .setColor("#f44242")
                .setTitle('🚨 Report sent!')
                .setDescription("We'll get things sorted\nout very soon!")
                .setThumbnail('https://media.giphy.com/media/xbEDt9IymF0M8/giphy.gif')
                message.channel.send(embed)

                let eb = new discord.RichEmbed()
                .setColor('#ff4635')
                .setAuthor(`New report by ${message.author.username}`, message.author.avatarURL)
                .setDescription(args.join(" "))
                bot.guilds.get('285623631042707457').channels.get("583478484656062465").send(eb)
            }
            else {
                let embed = new discord.RichEmbed()
                .setColor("#f44242")
                .setTitle('🚨 Invalid user mention!')
                .setDescription("Make sure the command is in the format:\n`~report <mention user> <describe behavior>`")
                .setThumbnail('https://media.giphy.com/media/xhN4C2vEuapCo/giphy-tumblr.gif')
                message.channel.send(embed)
            }
            
        }
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

    joinmessages = [
        "{member} just joined. Everyone, look busy!",
        "{member} just joined. Can I get a heal?",
        "{member} just joined. You must construct additional pylons.",
        "Welcome, {member}. We were expecting you ( ͡° ͜ʖ ͡°).",
        "Ermagherd, {member} is here.",
        "A wild {member} appeared.",
        "Swooooosh. {member} just landed.",
        "Where's {member}? In the server!",
        "{member} just showed up. Hold my beer!",
        "It's {member}! Praise the sun!. \\[T]/",
        "Never gonna give {member} up, never gonna let {member} down!",
        "Ha! {member} has joined. You activated my trap card!",
        "It's dangerous to go alone, take {member}!",
        "Hello, is it {member} you're looking for?",
    ]

    let embed = new discord.RichEmbed()
    .setColor('#6dff94')
    .setAuthor('Hey there, ' + member.displayName + "!", member.user.avatarURL)
    .setDescription(joinmessages[Math.floor(Math.random() * joinmessages.length)].replace("{member}", member.displayName))
    .setTimestamp()
    bot.guilds.get('285623631042707457').channels.get("528733373200334878").send(embed)
})

bot.on('guildMemberRemove', member => {
    db.collection('users').doc(member.id).delete()
    let embed = new discord.RichEmbed()
    .setColor('#ff4635')
    .setAuthor('Welp, ' + member.displayName + " just left the server.", member.user.avatarURL)
    .setTimestamp()
    bot.guilds.get('285623631042707457').channels.get("583478484656062465").send(embed)
})

// Repeated task
/*setTimeout(() => {
    try {
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
    }
    catch (e) {}
}, 120000);*/

function runBot() {
    bot.login(credentials.token)
}