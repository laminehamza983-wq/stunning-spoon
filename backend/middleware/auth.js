/**
 * Middleware للمصادقة والتفويض
 * Authentication & Authorization Middleware
 */

const jwt = require('jsonwebtoken');
const Logger = require('../utils/logger');

/**
 * التحقق من JWT Token
 */
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'لا يوجد رمز مصادقة'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      Logger.warn('محاولة وصول برمز غير صحيح');
      return res.status(403).json({
        success: false,
        message: 'رمز مصادقة غير صحيح'
      });
    }

    req.user = user;
    next();
  });
};

/**
 * التحقق من الدور (Role)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للوصول إلى هذا المورد'
      });
    }
    next();
  };
};

/**
 * التحقق من ملكية الجهاز
 */
const verifyDeviceOwnership = async (req, res, next) => {
  try {
    const Device = require('../models/Device');
    const device = await Device.findById(req.params.id);

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'الجهاز غير موجود'
      });
    }

    if (device.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'ليس لديك صلاحية للوصول إلى هذا الجهاز'
      });
    }

    next();
  } catch (error) {
    Logger.error('خطأ في التحقق من الملكية', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في التحقق'
    });
  }
};

/**
 * Rate Limiting - تحديد عدد الطلبات
 */
const createRateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    
    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'عدد كبير جداً من الطلبات، يرجى المحاولة لاحقاً'
      });
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize,
  verifyDeviceOwnership,
  createRateLimiter
};
