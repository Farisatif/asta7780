
let handler = async (m, {conn, usedPrefix}) => {
 await conn.sendMessage(m.chat, { react: { text: '💎', key: m.key } })
	
    let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let user = global.db.data.users[who]
    if (!(who in global.db.data.users))throw`✳️ 
المستخدم مفقود من قاعدة البيانات الخاصة بي`
conn.reply(m.chat, `
*◎─━──━─〘الــبــنــك〙─━──━─◎*
*•┃❖الاســم*:📄┃@${who.split('@')[0]}
*•┃❖الـماسـك:💎┃${user.diamond}*
*•┃❖رصــيدك:🏛️┃${user.exp}*
*•┃❖المستوى:🎚️┃${user.level}*
*•┃❖الـرتــبــه:🏆┃${user.role}*
*•┃❖عـمــلات:🪙┃${user.limit}*
*•┃❖الــرمــوز:🈷️┃${user.money}*
*•┃❖الـطـاقـه:⚡┃${user.joincount}*
*•┃❖التـوفيـر🎟️:┃${user.premiumTime}*
*◎ ─━──━─✎─━──━─ ◎*
*ملحوظه:* 
*يمكنك شراء💎 الماس باستخدام الطلبات*
*◎─━──━─〘الشــراء〙─━──━─◎*
❏ *❖${usedPrefix}buy <cantidad>*
❏ *❖${usedPrefix}buyall*`, m, { mentions: [who] })
}
handler.help = ['balance']
handler.tags = ['econ']
handler.command = ['البنك', 'رانك', 'diamond', 'بنك'] 

export default handler
