/**
 * نموذج بيانات المستشعرات
 * Sensor Data Model
 */

const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },
    sensorType: {
      type: String,
      enum: ['temperature', 'humidity', 'motion', 'gas', 'fire', 'light', 'pressure'],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    unit: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    metadata: {
      quality: Number,
      calibration: String
    }
  },
  { timestamps: false }
);

// فهرس للبحث السريع والحذف
sensorDataSchema.index({ device: 1, timestamp: -1 });
sensorDataSchema.index({ sensorType: 1 });
sensorDataSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // حذف تلقائي بعد 30 يوم

module.exports = mongoose.model('SensorData', sensorDataSchema);
