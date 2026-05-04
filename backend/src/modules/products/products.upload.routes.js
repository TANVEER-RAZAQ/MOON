const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

const ApiError = require('../../core/errors/api-error');
const { requireAdmin, requireAuth } = require('../../core/middleware/require-auth');
const { getSupabaseAdminClient } = require('../../integrations/database/supabase-admin');
const env = require('../../config/env');

const BUCKET = 'product-images';
const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB per file

const router = express.Router();

router.use(requireAuth, requireAdmin);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: MAX_FILES },
  fileFilter(_req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new ApiError(400, 'Only image files are accepted.'));
    }
    cb(null, true);
  },
});

async function processAndUpload(buffer, productId, index) {
  const db = getSupabaseAdminClient();
  const filename = `${productId}/${uuidv4()}.webp`;

  const [fullBuffer, blurBuffer] = await Promise.all([
    sharp(buffer)
      .resize({ width: 1400, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer(),
    sharp(buffer)
      .resize({ width: 10 })
      .webp({ quality: 30 })
      .toBuffer(),
  ]);

  const { error } = await db.storage
    .from(BUCKET)
    .upload(filename, fullBuffer, { contentType: 'image/webp', upsert: false });

  if (error) throw new ApiError(500, `Storage upload failed: ${error.message}`);

  const { data: urlData } = db.storage.from(BUCKET).getPublicUrl(filename);
  const blurDataUrl = `data:image/webp;base64,${blurBuffer.toString('base64')}`;

  return { url: urlData.publicUrl, alt: '', order: index, blurDataUrl };
}

router.post('/:productId/upload', upload.array('images', MAX_FILES), async (req, res, next) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return next(new ApiError(400, 'At least one image file is required.'));
    }

    const results = await Promise.all(
      files.map((file, i) => processAndUpload(file.buffer, req.params.productId, i))
    );

    res.json({ images: results });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
