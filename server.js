const express = require('express');
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const cors = require('cors');
require('dotenv').config();

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra biến môi trường
if (!process.env.AZURE_STORAGE_CONNECTION_STRING || !process.env.CONTAINER_NAME) {
    console.error('🔴 Thiếu biến môi trường! Vui lòng kiểm tra file .env');
    process.exit(1);
}

// Kết nối Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);

// Cấu hình Multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
    fileFilter: (req, file, cb) => {
        if (!/^image\/(jpeg|png|gif)$/.test(file.mimetype)) {
            return cb(new Error('Chỉ chấp nhận file ảnh (JPEG/PNG/GIF)'), false);
        }
        cb(null, true);
    }
});

// ========== API Endpoints ==========
// Upload file lên Azure
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng chọn file ảnh' });
        }

        // Tạo tên file unique
        const timestamp = Date.now();
        const extension = req.file.originalname.split('.').pop();
        const blobName = `${timestamp}.${extension}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload lên Azure
        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype }
        });

         // Trả về URL ảnh đã upload
        const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobName}`;

        console.log(`✅ Upload thành công: ${imageUrl}`);
        res.status(200).json({
            url: blockBlobClient.url,
            message: 'Upload ảnh thành công!'
        });

    } catch (error) {
        console.error('🔴 Lỗi upload:', error);
        res.status(500).json({
            error: 'Lỗi server khi xử lý ảnh',
            details: error.message
        });
    }
});


/**
 * 🎯 API Lấy danh sách ảnh từ Azure Blob Storage
 */
app.get('/images', async (req, res) => {
    try {
        let imageUrls = [];
        for await (const blob of containerClient.listBlobsFlat()) {
            const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blob.name}`;
            imageUrls.push(imageUrl);
        }

        res.status(200).json({ images: imageUrls });

    } catch (error) {
        console.error('🔴 Lỗi lấy danh sách ảnh:', error);
        res.status(500).json({ error: 'Không thể lấy danh sách ảnh', details: error.message });
    }
});

/**
 * 🎯 API Xóa ảnh khỏi Azure Blob Storage
 */
app.delete('/delete', async (req, res) => {
    try {
        const { filename } = req.body;
        if (!filename) {
            return res.status(400).json({ error: 'Thiếu tên file cần xóa' });
        }

        const blobClient = containerClient.getBlockBlobClient(filename);
        await blobClient.deleteIfExists();

        console.log(`🗑️ Đã xóa ảnh: ${filename}`);
        res.status(200).json({ message: `Ảnh ${filename} đã bị xóa` });

    } catch (error) {
        console.error('🔴 Lỗi xóa ảnh:', error);
        res.status(500).json({ error: 'Lỗi server khi xóa ảnh', details: error.message });
    }
});

/**
 * 🎯 API Kiểm tra trạng thái server
 */
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'Server is running!' });
});

/**
 * 🎯 Xử lý các route không tồn tại
 */
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint không tồn tại' });
});

/**
 * 🎯 Xử lý lỗi toàn cục
 */
app.use((err, req, res, next) => {
    console.error('🔴 Lỗi hệ thống:', err);
    res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
});

/**
 * 🎯 Khởi động server
 */
app.listen(port, async () => {
    try {
        await containerClient.getProperties();
        console.log(`🟢 Server đang chạy trên https://tobicoo-dev-azure.up.railway.app`);
        console.log(`🟢 Kết nối Azure thành công với container: ${process.env.CONTAINER_NAME}`);
    } catch (error) {
        console.error('🔴 Lỗi kết nối Azure:', error.message);
        process.exit(1);
    }
});
