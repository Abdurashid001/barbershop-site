const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const additionalNavItems = `
                <div class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown" id="currentLangDisplay">Язык</a>
                    <div class="dropdown-menu m-0">
                        <a href="#" class="dropdown-item" onclick="changeLanguage('ru', 'Русский')">Русский</a>
                        <a href="#" class="dropdown-item" onclick="changeLanguage('en', 'English')">English</a>
                        <a href="#" class="dropdown-item" onclick="changeLanguage('uz', 'O\\'zbekcha')">O'zbekcha</a>
                    </div>
                </div>
                <a href="auth.html" class="nav-item nav-link" id="navAuthLink"><i class="fa fa-user me-1"></i>Вход</a>
`;

const scriptsToAppend = `
    <!-- Custom Scripts for Auth and Lang -->
    <div id="google_translate_element" style="display:none;"></div>
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'ru', includedLanguages: 'ru,en,uz'}, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <script>
        function changeLanguage(lang, label) {
            document.cookie = "googtrans=/ru/" + lang + "; path=/";
            if (window.location.hostname) {
                document.cookie = "googtrans=/ru/" + lang + "; domain=" + window.location.hostname + "; path=/";
            }
            localStorage.setItem('selectedLangLabel', label);
            window.location.reload();
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            const label = localStorage.getItem('selectedLangLabel');
            if(label) {
                const display = document.getElementById('currentLangDisplay');
                if(display) display.innerText = label;
            }
        });
    </script>
    <script src="js/api.js"></script>
</body>
`;

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf-8');
    
    // Check if already patched
    if (content.includes('navAuthLink')) {
        console.log(`Skipping ${file}, already patched.`);
        return;
    }

    // Insert to navbar
    const navAnchor = `<a href="contact.html" class="nav-item nav-link">Контакты</a>`;
    if (content.includes(navAnchor)) {
        content = content.replace(navAnchor, navAnchor + additionalNavItems);
    }
    
    // Insert scripts before </body>
    if (content.includes('</body>')) {
         content = content.replace('</body>', scriptsToAppend);
    }

    fs.writeFileSync(path.join(dir, file), content);
    console.log(`Patched ${file}`);
});
