// ========== XỬ LÝ MODAL TỔNG QUÁT ==========
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Đóng khi click bên ngoài hoặc phím ESC
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});
        // ========== XỬ LÝ MODAL About us ==========
        const modal = document.getElementById('about-modal');
        const aboutLink = document.getElementById('about-link');
        const closeBtn = document.querySelector('.close');

        // Mở modal
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'block';
        });

        // Đóng modal
        function closeModal() {
            modal.style.display = 'none';
        }

        // Các cách đóng modal
        closeBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => e.target === modal && closeModal());
        document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());

        // ========== XỬ LÝ UPLOAD ==========
        const uploadButton = document.getElementById('upload-button');
        const fileInput = document.getElementById('file-input');
        const dropZone = document.querySelector('.upload-section');
        
        // Kích hoạt file input khi click nút
        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Xử lý khi chọn file qua dialog
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                uploadFile();
            }
        });

        // Hàm tải ảnh lên server
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

                const result = await response.json();
                document.getElementById('direct-link').value = result.url;
                document.getElementById('link-container').style.display = 'block';
                
            } catch (error) {
                console.error('Lỗi:', error);
                alert('Tải lên thất bại!');
            } finally {
                uploadButton.disabled = false;
                uploadButton.textContent = 'Chọn hình ảnh';
            }
        }

        // ========== KÉO THẢ ==========
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

        // ========== SAO CHÉP LINK ==========
        document.getElementById('copy-link').addEventListener('click', () => {
            const linkInput = document.getElementById('direct-link');
            linkInput.select();
            document.execCommand('copy');
            


             // Chuyển hướng đến trang xem ảnh. chuyển sang view-image.html
    const imageUrl = linkInput.value;
    window.location.href = `view-image.html?url=${encodeURIComponent(imageUrl)}`;

            // Hiệu ứng feedback
            const copyBtn = document.getElementById('copy-link');
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


 // ================= THƯ VIỆN ẢNH & XOÁ ẢNH =================

const API_BASE = 'https://tobicoo-dev-azure.up.railway.app';

// Gọi API để lấy danh sách ảnh
async function loadGallery() {
  try {
    const response = await fetch(`${API_BASE}/images`);
    const data = await response.json();
    const images = data.images || data; // Hỗ trợ cả khi trả về mảng trực tiếp

    const galleryContainer = document.getElementById('gallery-container');
    const gallery = document.createElement('div');
    gallery.classList.add('gallery');

    images.forEach(url => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('image-wrapper');

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Uploaded image';
      img.classList.add('gallery-img');

      const delBtn = document.createElement('button');
      delBtn.innerText = 'Xoá';
      delBtn.classList.add('delete-btn');
      delBtn.onclick = () => deleteImage(url, wrapper);

      wrapper.appendChild(img);
      wrapper.appendChild(delBtn);
      gallery.appendChild(wrapper);
    });

    galleryContainer.innerHTML = ''; // Xoá cũ nếu có
    galleryContainer.appendChild(gallery);

  } catch (err) {
    console.error('Lỗi khi tải thư viện ảnh:', err);
  }
}

// Gửi yêu cầu xoá ảnh
async function deleteImage(imageUrl, imageElement) {
  try {
    const filename = imageUrl.split('/').pop(); // Tách tên file
    const response = await fetch(`${API_BASE}/delete`, {
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
