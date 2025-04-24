const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions
} = require('@azure/storage-blob');

// Khởi tạo ứng dụng Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kiểm tra biến môi trường
if (
    !process.env.AZURE_STORAGE_CONNECTION_STRING ||
    !process.env.CONTAINER_NAME ||
    !process.env.AZURE_STORAGE_ACCOUNT ||
    !process.env.AZURE_STORAGE_ACCOUNT_KEY
) {
    console.error('🔴 Thiếu biến môi trường! Vui lòng kiểm tra file .env hoặc Railway Variables');
    process.exit(1);
}

// Kết nối Azure Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.CONTAINER_NAME);

// Tạo SAS Credential
const sharedKeyCredential = new StorageSharedKeyCredential(
    process.env.AZURE_STORAGE_ACCOUNT,
    process.env.AZURE_STORAGE_ACCOUNT_KEY
);

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

// 📤 Upload ảnh qua backend
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Vui lòng chọn file ảnh' });
        }

        const timestamp = Date.now();
        const extension = req.file.originalname.split('.').pop();
        const blobName = `${timestamp}.${extension}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: { blobContentType: req.file.mimetype }
        });

        const imageUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobName}`;

        console.log(`✅ Upload thành công: ${imageUrl}`);
        res.status(200).json({
            url: blockBlobClient.url,
            message: 'Upload ảnh thành công!'
        });

    } catch (error) {
        console.error('🔴 Lỗi upload:', error);
        res.status(500).json({ error: 'Lỗi server khi xử lý ảnh', details: error.message });
    }
});

// 🔐 Generate SAS Token cho frontend upload trực tiếp
app.get('/generate-sas', (req, res) => {
    const blobName = req.query.filename;
    if (!blobName) {
        return res.status(400).json({ error: 'Thiếu tên file (filename)' });
    }

    const expiresOn = new Date(new Date().valueOf() + 5 * 60 * 1000); // 5 phút
    const sasToken = generateBlobSASQueryParameters({
        containerName: process.env.CONTAINER_NAME,
        blobName,
        permissions: BlobSASPermissions.parse("cw"), // create + write
        expiresOn
    }, sharedKeyCredential).toString();

    const sasUrl = `https://${process.env.AZURE_STORAGE_ACCOUNT}.blob.core.windows.net/${process.env.CONTAINER_NAME}/${blobName}?${sasToken}`;
    res.json({ sasUrl });
});

// 🖼️ Lấy danh sách ảnh
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

// 🗑️ Xoá ảnh
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

// Route root mặc định
app.get('/', (req, res) => {
    res.send('🟢 Backend Azure Blob đang hoạt động!');
});

// Xử lý route không tồn tại
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint không tồn tại' });
});

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
    console.error('🔴 Lỗi hệ thống:', err);
    res.status(500).json({ error: 'Lỗi hệ thống', message: err.message });
});

// Khởi động server
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
