/**
 * مسارات التنبيهات
 * Alerts Routes
 */

const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');
const Device = require('../models/Device');
const { authenticateToken, authorize, verifyDeviceOwnership } = require('../middleware/auth');
const Logger = require('../utils/logger');

/**
 * الحصول على جميع التنبيهات
 * GET /api/alerts
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, severity, device, limit = 50, page = 1 } = req.query;
    let query = {};

    // إذا كان المستخدم عادياً، أظهر تنبيهاته فقط
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (device) query.device = device;

    const skip = (page - 1) * limit;

    const alerts = await Alert.find(query)
      .populate('device', 'name type location')
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Alert.countDocuments(query);

    res.status(200).json({
      success: true,
      count: alerts.length,
      total: total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      alerts: alerts
    });
  } catch (error) {
    Logger.error('خطأ في جلب التنبيهات', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب التنبيهات'
    });
  }
});

/**
 * الحصول على تنبيه محدد
 * GET /api/alerts/:id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('device', 'name type location')
      .populate('user', 'firstName lastName email')
      .populate('acknowledgment.acknowledgedBy', 'firstName lastName');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'التنبيه غير موجود'
      });
    }

    // التحقق من الصلاحية
    if (alert.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية عرض هذا التنبيه'
      });
    }

    res.status(200).json({
      success: true,
      alert: alert
    });
  } catch (error) {
    Logger.error('خطأ في جلب التنبيه', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب التنبيه'
    });
  }
});

/**
 * إنشاء تنبيه جديد
 * POST /api/alerts
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, type, severity, device, detectionData } = req.body;

    if (!title || !type || !device) {
      return res.status(400).json({
        success: false,
        message: 'يرجى ملء جميع الحقول المطلوبة'
      });
    }

    // التحقق من وجود الجهاز
    const deviceExists = await Device.findById(device);
    if (!deviceExists) {
      return res.status(404).json({
        success: false,
        message: 'الجهاز غير موجود'
      });
    }

    const alert = await Alert.create({
      title,
      description,
      type,
      severity,
      device,
      user: req.user.id,
      detectionData
    });

    await alert.populate('device', 'name type location');

    Logger.info(`تنبيه جديد: ${title} من ${device}`);

    res.status(201).json({
      success: true,
      message: 'تم إنشاء التنبيه بنجاح',
      alert: alert
    });
  } catch (error) {
    Logger.error('خطأ في إنشاء التنبيه', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إنشاء التنبيه'
    });
  }
});

/**
 * الإقرار بالتنبيه
 * PUT /api/alerts/:id/acknowledge
 */
router.put('/:id/acknowledge', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'acknowledged',
        acknowledgment: {
          acknowledgedBy: req.user.id,
          acknowledgedAt: Date.now(),
          notes: notes || ''
        }
      },
      { new: true }
    );

    Logger.info(`إقرار بالتنبيه: ${req.params.id} من قبل ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'تم الإقرار بالتنبيه',
      alert: alert
    });
  } catch (error) {
    Logger.error('خطأ في الإقرار بالتنبيه', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الإقرار بالتنبيه'
    });
  }
});

/**
 * حل التنبيه
 * PUT /api/alerts/:id/resolve
 */
router.put('/:id/resolve', authenticateToken, async (req, res) => {
  try {
    const { resolutionNotes, actionTaken } = req.body;

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: 'resolved',
        resolution: {
          resolvedBy: req.user.id,
          resolvedAt: Date.now(),
          resolutionNotes: resolutionNotes || '',
          actionTaken: actionTaken || ''
        }
      },
      { new: true }
    );

    Logger.info(`حل التنبيه: ${req.params.id} من قبل ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'تم حل التنبيه',
      alert: alert
    });
  } catch (error) {
    Logger.error('خطأ في حل التنبيه', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حل التنبيه'
    });
  }
});

/**
 * وضع علامة إنذار خاطئة
 * PUT /api/alerts/:id/false-alarm
 */
router.put('/:id/false-alarm', authenticateToken, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: 'false_alarm' },
      { new: true }
    );

    Logger.info(`إنذار خاطئ: ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: 'تم وضع علامة الإنذار الخاطئ',
      alert: alert
    });
  } catch (error) {
    Logger.error('خطأ في وضع علامة الإنذار الخاطئ', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في وضع علامة الإنذار الخاطئ'
    });
  }
});

module.exports = router;
