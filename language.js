const languageFlags = {
    vi: 'https://flagcdn.com/w20/vn.png',
    en: 'https://flagcdn.com/w20/us.png',
    fr: 'https://flagcdn.com/w20/fr.png'
};

async function changeLanguage(lang) {
    try {
        const response = await fetch(`../lang/${lang}.json`);
        if (!response.ok) throw new Error('Không thể tải file ngôn ngữ');
        const translations = await response.json();

        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.setAttribute('placeholder', translations[key]);
            }
        });

        const currentFlag = document.getElementById('currentLanguageFlag');
        if (currentFlag) {
            currentFlag.src = languageFlags[lang];
        }

        localStorage.setItem('language', lang);

        renderLanguageDropdown(translations, lang);

        if (typeof updateCartUI === 'function') {
            updateCartUI();
        }
    } catch (error) {
        console.error('Lỗi khi thay đổi ngôn ngữ:', error);
    }
}

function renderLanguageDropdown(translations, currentLang) {
    const menu = document.querySelector('.dropdown-menu');
    if (!menu) return;

    let html = '';

    for (const [langCode, flag] of Object.entries(languageFlags)) {
        if (langCode !== currentLang) {
            const langKey = `language_${langCode}`;
            const label = translations[langKey] || langCode;
            html += `
                <li>
                    <a class="dropdown-item d-flex align-items-center gap-2" href="#" onclick="changeLanguage('${langCode}')">
                        <img src="${flag}" alt="${label}"> ${label}
                    </a>
                </li>
            `;
        }
    }

    menu.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', async () => {
    const savedLanguage = localStorage.getItem('language') || 'vi';
    await changeLanguage(savedLanguage);
});
