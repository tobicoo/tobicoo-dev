// ================== MODAL ==================
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', function () {
    this.closest('.modal').style.display = 'none';
  });
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

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

const modal = document.getElementById('about-modal');
const aboutLink = document.getElementById('about-link');
const closeBtn = document.querySelector('.close');

if (modal && aboutLink && closeBtn) {
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
  });

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
}

// ================== UPLOAD ==================
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const dropZone = document.querySelector('.upload-section');

if (uploadButton && fileInput) {
  uploadButton.addEventListener('click', () => fileInput.click());

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

// ================== MODAL ==================
document.querySelectorAll('.modal .close').forEach(closeBtn => {
  closeBtn.addEventListener('click', function () {
    this.closest('.modal').style.display = 'none';
  });
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'block';
}

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

const modal = document.getElementById('about-modal');
const aboutLink = document.getElementById('about-link');
const closeBtn = document.querySelector('.close');

if (modal && aboutLink && closeBtn) {
  aboutLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'block';
  });

  function closeModal() {
    modal.style.display = 'none';
  }

  closeBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (e) => e.target === modal && closeModal());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
}

// ================== UPLOAD ==================
const uploadButton = document.getElementById('upload-button');
const fileInput = document.getElementById('file-input');
const dropZone = document.querySelector('.upload-section');

if (uploadButton && fileInput) {
  uploadButton.addEventListener('click', () => fileInput.click());

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

// ================= THƯ VIỆN ẢNH =================
const API_BASE = 'https://tobicoo-dev-azure.up.railway.app';

// Hàm tải danh sách ảnh từ server và hiển thị ra giao diện
async function loadGallery() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;

  try {
    const response = await fetch(`${API_BASE}/images`); // Gọi API lấy danh sách ảnh
    const data = await response.json();
    const images = data.images || data; // Đảm bảo tương thích nếu trả về là mảng

    const gallery = document.createElement('div');
    gallery.classList.add('gallery');

    images.forEach(url => {
      const wrapper = document.createElement('div');
      wrapper.classList.add('image-wrapper');

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Uploaded image';
      img.classList.add('gallery-img');
      img.addEventListener('click', () => openImageModal(url)); // Bấm vào ảnh để mở toàn màn hình

      const downloadBtn = document.createElement('a');
      downloadBtn.href = url;
      downloadBtn.download = '';
      downloadBtn.innerText = 'Tải về';
      downloadBtn.classList.add('download-btn');

      const delBtn = document.createElement('button');
      delBtn.innerText = 'Xoá';
      delBtn.classList.add('delete-btn');
      delBtn.onclick = () => deleteImage(url, wrapper); // Xoá ảnh khỏi server

      wrapper.appendChild(img);
      wrapper.appendChild(downloadBtn); // Thêm nút tải về
      wrapper.appendChild(delBtn);      // Thêm nút xoá
      gallery.appendChild(wrapper);
    });

    galleryContainer.innerHTML = ''; // Xoá nội dung cũ
    galleryContainer.appendChild(gallery);
    createImageModal(); // Tạo modal toàn màn nếu chưa có

  } catch (err) {
    console.error('Lỗi khi tải thư viện ảnh:', err);
  }
}

// Hàm tạo modal toàn màn hình chỉ tạo 1 lần duy nhất
function createImageModal() {
  if (document.getElementById('fullscreen-modal')) return; // Đã tồn tại thì bỏ qua

  const modal = document.createElement('div');
  modal.id = 'fullscreen-modal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.top = 0;
  modal.style.left = 0;
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  modal.style.zIndex = 9999;
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';
  modal.style.cursor = 'zoom-out';

  const img = document.createElement('img');
  img.id = 'fullscreen-img';
  img.style.maxWidth = '90%';
  img.style.maxHeight = '90%';
  img.style.borderRadius = '12px';
  img.style.boxShadow = '0 0 20px rgba(255,255,255,0.3)';
  modal.appendChild(img);

  // Đóng modal khi bấm ngoài ảnh
  modal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.body.appendChild(modal);
}

// Mở modal hiển thị ảnh full screen
function openImageModal(url) {
  const modal = document.getElementById('fullscreen-modal');
  const img = document.getElementById('fullscreen-img');
  img.src = url;
  modal.style.display = 'flex';
}

// Gửi yêu cầu xoá ảnh từ server
async function deleteImage(imageUrl, imageElement) {
  try {
    const filename = imageUrl.split('/').pop(); // Lấy tên file từ URL
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

// Khi trang load xong thì gọi hàm hiển thị ảnh
window.addEventListener('DOMContentLoaded', loadGallery);

