import { WAMessageStubType } from '@adiwajshing/baileys'

export async function before(m, { conn }) {
	if (!m.messageStubType || !m.isGroup) return
	let usuario = `@${m.sender.split`@`[0]}`
	let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
	if (m.messageStubType == 21) {
		await this.sendMessage(m.chat, { text: `${usuario} تم تغير اسم الجروب الاسم الجديد:\n\n*${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak }) 
	} else if (m.messageStubType == 22) {
		await this.sendMessage(m.chat, { text: `${usuario}تم تغير صوره الجروب`, mentions: [m.sender] }, { quoted: fkontak }) 
	} else if (m.messageStubType == 24) {
		await this.sendMessage(m.chat, { text: `${usuario} تم تغير وصف الجروب:\n\n${m.messageStubParameters[0]}`, mentions: [m.sender] }, { quoted: fkontak })
	} else if (m.messageStubType == 25) {
		await this.sendMessage(m.chat, { text: `🔒تم قفل  *${m.messageStubParameters[0] == 'on' ? 'المشرفين فقط' : '𝙏𝙊𝘿𝙊𝙎'}* 𝙋𝙐𝙀𝘿𝙀 𝙀𝘿𝙄𝙏𝘼𝙍 𝙇𝘼 𝙄𝙉𝙁𝙊𝙍𝙈𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊`, mentions: [m.sender] }, { quoted: fkontak })
	} else if (m.messageStubType == 26) {
		await this.sendMessage(m.chat, { text: `الجروب *${m.messageStubParameters[0] == 'on' ? 'تم قفله 🔒' : 'مفتوح 🔓'}*\n ${m.messageStubParameters[0] == 'on' ? 'لمشرفين فقط يمكنهم التحدث' : 'الكل يقدر يتكلم'} انتشروا🐦`, mentions: [m.sender] }, { quoted: fkontak })
	} else if (m.messageStubType == 29) {
		await this.sendMessage(m.chat, { text: `@${m.messageStubParameters[0].split`@`[0]} اصـبـحـت الـان مـشـرفـا \n\nالـاتـخـاذ الـي اخـذه: ${usuario}`, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
	} else if (m.messageStubType == 30) {
		await this.sendMessage(m.chat, { text: `@${m.messageStubParameters[0].split`@`[0]} لـم تـعـد مـشـرفـأ \n\nالـاتـخـاذ الـي اخـذه: ${usuario}`, mentions: [`${m.sender}`,`${m.messageStubParameters[0]}`] }, { quoted: fkontak })
	} else if (m.messageStubType == 72) {
		await this.sendMessage(m.chat, { text: `${usuario} 𝘾𝘼𝙈𝘽𝙄𝙊 𝙇𝘼𝙎 𝘿𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇𝙀𝙎 𝘼 *@${m.messageStubParameters[0]}*`, mentions: [m.sender] }, { quoted: fkontak })
	} else if (m.messageStubType == 123) {
		await this.sendMessage(m.chat, { text: `${usuario} *𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝙊́* 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇.`, mentions: [m.sender] }, { quoted: fkontak })
	} else {
		console.log({
			messageStubType: m.messageStubType,
	    messageStubParameters: m.messageStubParameters,
	    type: WAMessageStubType[m.messageStubType], 
		});
	}
}
