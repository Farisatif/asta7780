import { toAudio } from '../lib/converter.js'
let handler = async (m, { conn, usedPrefix, command }) => {
let q = m.quoted ? m.quoted : m
let mime = (q || q.msg).mimetype || q.mediaType || ''
if (!/video|audio/.test(mime)) throw `*[⛔]اعمل ريبلاي للفديو ال بدك تخليه صوت*`
let media = await q.download()
if (!media) throw '*حدث خطأ حاول مجددا*'
let audio = await toAudio(media, 'mp4')
if (!audio.data) throw 'حدث خطأ في* تحويل الفيديو الي صوت*'
conn.sendMessage(m.chat, { audio: audio.data,  mimetype: 'audio/mpeg' }, { quoted: m })
}
handler.alias = ['tomp3', 'toaudio']
handler.command = /تحويلmp3$/i
export default handler
