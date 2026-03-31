document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('qr-input');
    const redundancySel = document.getElementById('redundancy-sel');
    const logoInput = document.getElementById('logo-input');
    const addLogoBtn = document.getElementById('add-logo-btn');
    const logoPreview = document.getElementById('logo-preview');
    const removeLogoBtn = document.getElementById('remove-logo');
    const generateBtn = document.getElementById('generate-btn');
    const qrContainer = document.getElementById('qr-container');
    const actionButtons = document.getElementById('action-buttons');
    const downloadBtn = document.getElementById('download-btn');
    const inputWrapper = document.querySelector('.input-wrapper');

    let qrCode = null;
    let logoData = null;

    function initQRCode() {
        qrCode = new QRCodeStyling({
            width: 1024,
            height: 1024,
            type: "canvas",
            data: "",
            image: "",
            dotsOptions: {
                color: "#000000",
                type: "square"
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: 0.4
            },
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte',
                errorCorrectionLevel: redundancySel.value
            }
        });
    }

    initQRCode();

    // Reset UI to default state
    function resetUI() {
        qrContainer.innerHTML = `
            <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
            </div>
        `;
        qrContainer.classList.add('qr-placeholder');
        actionButtons.classList.add('hidden');
    }

    function generateQR() {
        const text = inputField.value.trim();

        if (!text) {
            inputWrapper.classList.add('error', 'shake');
            setTimeout(() => {
                inputWrapper.classList.remove('error', 'shake');
            }, 500);
            return;
        }

        // If placeholder is present, clear it and append the real canvas
        if (qrContainer.classList.contains('qr-placeholder')) {
            qrContainer.innerHTML = '';
            qrContainer.classList.remove('qr-placeholder');
            qrCode.append(qrContainer);
        }
        
        qrCode.update({
            data: text,
            image: logoData || "",
            qrOptions: {
                errorCorrectionLevel: redundancySel.value
            }
        });

        setTimeout(() => {
            actionButtons.classList.remove('hidden');
        }, 100);
    }

    // Logo handling
    addLogoBtn.addEventListener('click', () => logoInput.click());

    logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoData = event.target.result;
                logoPreview.querySelector('img').src = logoData;
                logoPreview.classList.remove('hidden');
                addLogoBtn.classList.add('hidden');
                
                // Auto-set redundancy to High for logos
                redundancySel.value = 'H';
                
                // Re-generate if there's text
                if (inputField.value.trim()) {
                    generateQR();
                }
            };
            reader.readAsDataURL(file);
        }
    });

    removeLogoBtn.addEventListener('click', () => {
        logoData = null;
        logoInput.value = '';
        logoPreview.classList.add('hidden');
        addLogoBtn.classList.remove('hidden');
        
        // Re-generate if there's text
        if (inputField.value.trim()) {
            generateQR();
        }
    });

    generateBtn.addEventListener('click', generateQR);

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateQR();
        }
    });
    
    inputField.addEventListener('input', (e) => {
        if (e.target.value.trim() === '') {
            resetUI();
        }
    });

    downloadBtn.addEventListener('click', () => {
        if (qrCode) {
            qrCode.download({ 
                name: "qrcode", 
                extension: "png",
                width: 1024,
                height: 1024
            });
        }
    });
});


