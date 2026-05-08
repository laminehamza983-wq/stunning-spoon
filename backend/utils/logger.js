/**
 * وحدة تسجيل الأحداث والأخطاء
 * Logger Module
 */

const fs = require('fs');
const path = require('path');

// إنشاء مجلد السجلات إن لم يكن موجوداً
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

class Logger {
  /**
   * تسجيل رسالة معلومات
   */
  static info(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] INFO: ${message}`;
    console.log(`✅ ${logMessage}`);
    if (data) console.log(data);
    this._writeToFile('info', logMessage, data);
  }

  /**
   * تسجيل رسالة تحذير
   */
  static warn(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] WARN: ${message}`;
    console.warn(`⚠️  ${logMessage}`);
    if (data) console.warn(data);
    this._writeToFile('warn', logMessage, data);
  }

  /**
   * تسجيل رسالة خطأ
   */
  static error(message, error = null) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ERROR: ${message}`;
    console.error(`❌ ${logMessage}`);
    if (error) console.error(error);
    this._writeToFile('error', logMessage, error);
  }

  /**
   * تسجيل رسالة تصحيح
   */
  static debug(message, data = null) {
    if (process.env.LOG_LEVEL === 'debug') {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] DEBUG: ${message}`;
      console.debug(`🐛 ${logMessage}`);
      if (data) console.debug(data);
    }
  }

  /**
   * كتابة السجلات إلى ملف
   */
  static _writeToFile(level, message, data = null) {
    try {
      const filename = path.join(logsDir, `${level}-${new Date().toISOString().split('T')[0]}.log`);
      let content = `${message}\n`;
      if (data) {
        content += `${typeof data === 'object' ? JSON.stringify(data, null, 2) : data}\n`;
      }
      fs.appendFileSync(filename, content);
    } catch (err) {
      console.error('فشل كتابة السجل:', err);
    }
  }
}

module.exports = Logger;
