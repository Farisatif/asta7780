import fs from 'fs'
import path from 'path'
import schedule from 'node-schedule'

const remindersFile = path.resolve('./reminders.json')

// إنشاء ملف التذكيرات إذا لم يكن موجود
if (!fs.existsSync(remindersFile)) fs.writeFileSync(remindersFile, '[]')

let handler = async (m, { args, usedPrefix, command }) => {
  let example = `مثال:\n${usedPrefix + command} 18:30 اشرب دواء يومي`
  if (args.length < 3) {
    return m.reply(`❗ لاستخدام الأمر اكتب:\n${usedPrefix + command} [الوقت] [الرسالة] [التكرار]\n\n${example}`)
  }

  let time = args[0]
  let repeat = args[args.length - 1]
  let message = args.slice(1, -1).join(' ')

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return m.reply('❌ الوقت غير صحيح، اكتب بصيغة مثل 18:30')
  }

  if (!['مرة', 'يومي', 'اسبوعي', 'شهري'].includes(repeat)) {
    return m.reply('❌ نوع التكرار غير صحيح. اختر من: مرة، يومي، اسبوعي، شهري')
  }

  // إنشاء تذكير مع معرف فريد
  let reminder = {
    id: `${m.chat}-${Date.now()}`, // ✅ id ضروري
    chat: m.chat,
    time,
    repeat,
    message,
    createdAt: Date.now()
  }

  let data = JSON.parse(fs.readFileSync(remindersFile))
  data.push(reminder)
  fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2))

  scheduleReminder(reminder, m)

  await m.reply(`✅ تم ضبط التذكير بنجاح\n🕒 الوقت: ${time}\n🔁 التكرار: ${repeat}\n💬 الرسالة: ${message}`)
}

handler.command = /^(ذكرني)$/i
export default handler

// === وظيفة الجدولة ===
function scheduleReminder(reminder, m) {
  let [hour, minute] = reminder.time.split(':').map(Number)
  let ruleOrDate

  if (reminder.repeat === 'مرة') {
    let now = new Date()
    let when = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0)
    if (when <= now) when.setDate(when.getDate() + 1)
    ruleOrDate = when
  } else {
    let rule = new schedule.RecurrenceRule()
    rule.hour = hour
    rule.minute = minute
    if (reminder.repeat === 'اسبوعي') rule.dayOfWeek = new Date().getDay()
    else if (reminder.repeat === 'شهري') rule.date = new Date().getDate()
    ruleOrDate = rule
  }

  // ✅ جدولة باسم id حتى يمكن إلغاؤه لاحقًا
  schedule.scheduleJob(reminder.id, ruleOrDate, () => {
    m.conn.sendMessage(reminder.chat, { text: `🔔 تذكير: ${reminder.message}` })
  })
}