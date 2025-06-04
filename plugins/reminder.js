import fs from 'fs';
import path from 'path';
import schedule from 'node-schedule';
import express from 'express';

// --- إعداد ملف التذكيرات ---
const remindersFile = path.resolve('./reminders.json');
if (!fs.existsSync(remindersFile)) fs.writeFileSync(remindersFile, '[]');

// --- دالة جدولة تذكير ---
function scheduleReminder(reminder, conn) {
  let [hour, minute] = reminder.time.split(':').map(Number);
  let ruleOrDate;

  if (reminder.repeat === 'مرة') {
    let now = new Date();
    let when = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
    if (when <= now) when.setDate(when.getDate() + 1);
    ruleOrDate = when;
  } else {
    let rule = new schedule.RecurrenceRule();
    rule.hour = hour;
    rule.minute = minute;
    if (reminder.repeat === 'اسبوعي') rule.dayOfWeek = new Date().getDay();
    else if (reminder.repeat === 'شهري') rule.date = new Date().getDate();
    ruleOrDate = rule;
  }

  schedule.scheduleJob(reminder.id, ruleOrDate, () => {
    conn.sendMessage(reminder.chat, { text: `🔔 تذكير: ${reminder.message}` });
  });
}

// --- تحميل كل التذكيرات وجدولتها عند بداية التشغيل ---
function loadAndScheduleReminders(conn) {
  const data = JSON.parse(fs.readFileSync(remindersFile));
  for (const reminder of data) {
    scheduleReminder(reminder, conn);
  }
}

// --- بوت التذكير: أمر إضافة تذكير ---
let handler = async (m, { args, usedPrefix, command, conn }) => {
  let example = `مثال:\n${usedPrefix + command} 18:30 اشرب دواء يومي`;
  if (args.length < 3) {
    return m.reply(`❗ لاستخدام الأمر اكتب:\n${usedPrefix + command} [الوقت] [الرسالة] [التكرار]\n\n${example}`);
  }

  let time = args[0];
  let repeat = args[args.length - 1];
  let message = args.slice(1, -1).join(' ');

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return m.reply('❌ الوقت غير صحيح، اكتب بصيغة مثل 18:30');
  }

  if (!['مرة', 'يومي', 'اسبوعي', 'شهري'].includes(repeat)) {
    return m.reply('❌ نوع التكرار غير صحيح. اختر من: مرة، يومي، اسبوعي، شهري');
  }

  let reminder = {
    id: `${m.chat}-${Date.now()}`,
    chat: m.chat,
    time,
    repeat,
    message,
    createdAt: Date.now()
  };

  let data = JSON.parse(fs.readFileSync(remindersFile));
  data.push(reminder);
  fs.writeFileSync(remindersFile, JSON.stringify(data, null, 2));

  scheduleReminder(reminder, conn);

  await m.reply(`✅ تم ضبط التذكير بنجاح\n🕒 الوقت: ${time}\n🔁 التكرار: ${repeat}\n💬 الرسالة: ${message}`);
};

handler.command = /^(ذكرني)$/i;
handler.help = ['ذكرني'];
handler.tags = ['tools'];
handler.group = false;

// --- تصدير الهاندلر ---
export { handler, loadAndScheduleReminders };

// --- تشغيل سيرفر Express بسيط ---

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('بوت التذكير يعمل بنجاح!');
});

app.listen(port, () => {
  console.log(`سيرفر Express يعمل على المنفذ ${port}`);
});
