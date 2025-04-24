// ========== XỬ LÝ MODAL TỔNG QUÁT ==========
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        this.closest('.modal').style.display = 'none';
    });
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Đóng khi click bên ngoài hoặc phím ESC
window.onclick = function (e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// ========== XỬ LÝ MODAL About us ==========
const aboutModal = document.getElementById('about-modal');
const aboutLink = document.getElementById('about-link');
const closeAboutBtn = document.querySelector('.close');

if (aboutModal && aboutLink && closeAboutBtn) {
    aboutLink.addEventListener('click', (e) => {
        e.preventDefault();
        aboutModal.style.display = 'block';
    });

    function closeModal() {
        aboutModal.style.display = 'none';
    }

    closeAboutBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => e.target === aboutModal && closeModal());
    document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
}

// ========== XỬ LÝ UPLOAD ==========
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const dropZone = document.querySelector('.upload-section');

if (uploadButton && fileInput) {
    uploadButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function (e) {
        if (e.target.files.length > 0) {
            uploadFile();
        }
    });
}

async function uploadFile() {
    const file = fileInput.files[0];
    if (!file) {
        alert('Vui lòng chọn ảnh trước khi tải lên');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        uploadButton.disabled = true;
        uploadButton.textContent = 'Đang tải lên...';

        const response = await fetch('https://tobicoo-dev-azure.up.railway.app/upload', {
            method: 'POST',
            body: formData
        });
        const end = performance.now(); // Kết thúc đo thời gian
        const duration = ((end - start) / 1000).toFixed(2); // tính giây
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2); // tính MB

        const result = await response.json();
        document.getElementById('direct-link').value = result.url;
        document.getElementById('link-container').style.display = 'block';
        // Hiển thị kết quả sau khi tải lên
        const uploadInfo = document.getElementById('upload-time');
        if (uploadInfo) {
            uploadInfo.textContent = `📁 Dung lượng: ${sizeMB} MB | ⏱️ Thời gian tải: ${duration} giây`;
            uploadInfo.style.color = 'green';
            uploadInfo.style.marginTop = '10px';
        }
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Tải lên thất bại!');
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = 'Chọn hình ảnh';
    }
}

if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#2196F3';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ced4da';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        fileInput.files = e.dataTransfer.files;
        uploadFile();
    });
}

// ========== SAO CHÉP LINK ==========
const copyBtn = document.getElementById('copy-link');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const linkInput = document.getElementById('direct-link');
        linkInput.select();
        document.execCommand('copy');

        const imageUrl = linkInput.value;
        window.location.href = `view-image.html?url=${encodeURIComponent(imageUrl)}`;

        copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 8px;">
                <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
            </svg>
            Đã sao chép!
        `;
        copyBtn.style.background = '#4CAF50';

        setTimeout(() => {
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="18" height="18" style="margin-right: 8px;">
                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 15h10v-2H7v2zm0-4h10V9H7v2z"/>
                </svg>
                Sao chép liên kết
            `;
            copyBtn.style.background = '#2196F3';
        }, 2000);
    });
}
// ================= THƯ VIỆN ẢNH & XOÁ ẢNH =================

// Gọi API để lấy danh sách ảnh
async function loadGallery() {
    try {
        const response = await fetch('https://tobicoo-dev-azure.up.railway.app/images');
        const data = await response.json();
        const images = data.images || data;

        const galleryContainer = document.getElementById('gallery-container');
        const gallery = document.createElement('div');
        gallery.classList.add('gallery');
        gallery.style.display = 'grid';
        gallery.style.gridTemplateColumns = 'repeat(auto-fit, minmax(220px, 1fr))';
        gallery.style.gap = '20px';
        gallery.style.marginTop = '20px';

        images.forEach(url => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-wrapper');
            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.alignItems = 'center';
            wrapper.style.background = '#fff';
            wrapper.style.padding = '12px';
            wrapper.style.borderRadius = '10px';
            wrapper.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            wrapper.style.transition = 'transform 0.2s';
            wrapper.onmouseover = () => wrapper.style.transform = 'scale(1.03)';
            wrapper.onmouseout = () => wrapper.style.transform = 'scale(1)';

            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Uploaded image';
            img.classList.add('gallery-img');
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.borderRadius = '6px';
            img.style.marginBottom = '10px';
            img.style.cursor = 'zoom-in';
            img.onclick = () => openImageModal(url);

            const btnGroup = document.createElement('div');
            btnGroup.style.display = 'flex';
            btnGroup.style.gap = '10px';

            const delBtn = document.createElement('button');
            delBtn.innerText = 'Xoá';
            delBtn.classList.add('delete-btn');
            delBtn.style.padding = '6px 14px';
            delBtn.style.background = '#e74c3c';
            delBtn.style.color = '#fff';
            delBtn.style.border = 'none';
            delBtn.style.borderRadius = '4px';
            delBtn.style.cursor = 'pointer';
            delBtn.onclick = () => deleteImage(url, wrapper);

            const downloadBtn = document.createElement('a');
            downloadBtn.href = url;
            downloadBtn.download = '';
            downloadBtn.innerText = 'Tải về';
            downloadBtn.classList.add('download-btn');
            downloadBtn.style.padding = '6px 14px';
            downloadBtn.style.background = '#3498db';
            downloadBtn.style.color = '#fff';
            downloadBtn.style.textDecoration = 'none';
            downloadBtn.style.borderRadius = '4px';

            btnGroup.appendChild(downloadBtn);
            btnGroup.appendChild(delBtn);

            wrapper.appendChild(img);
            wrapper.appendChild(btnGroup);
            gallery.appendChild(wrapper);
        });

        galleryContainer.innerHTML = '';
        galleryContainer.appendChild(gallery);

        createImageModal();

    } catch (err) {
        console.error('Lỗi khi tải thư viện ảnh:', err);
    }
}

// Modal xem ảnh toàn màn
function createImageModal() {
    if (document.getElementById('fullscreen-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'fullscreen-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0,0,0,0.85)';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '9999';
    modal.style.cursor = 'zoom-out';

    const modalImg = document.createElement('img');
    modalImg.id = 'fullscreen-img';
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    modalImg.style.borderRadius = '12px';
    modalImg.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
    modal.appendChild(modalImg);

    modal.onclick = () => {
        modal.style.display = 'none';
    };

    document.body.appendChild(modal);
}

function openImageModal(url) {
    const modal = document.getElementById('fullscreen-modal');
    const modalImg = document.getElementById('fullscreen-img');
    modalImg.src = url;
    modal.style.display = 'flex';
}

// Gửi yêu cầu xoá ảnh
async function deleteImage(imageUrl, imageElement) {
    try {
        const filename = imageUrl.split('/').pop();
        const response = await fetch('https://tobicoo-dev-azure.up.railway.app/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename })
        });

        if (response.ok) {
            imageElement.remove();
            alert('✅ Đã xoá ảnh thành công!');
        } else {
            alert('❌ Xoá ảnh thất bại!');
        }
    } catch (err) {
        console.error('Lỗi xoá ảnh:', err);
    }
}

// Tải gallery khi trang load
window.addEventListener('DOMContentLoaded', loadGallery);
