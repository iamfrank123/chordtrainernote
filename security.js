
class SecurityManager {
    constructor() {
        this.isLicenseValid = false;
        this.integrityHash = null;
        this.devToolsOpen = false;
        this.tamperDetected = false;
        this.monitoringActive = false;

        setTimeout(() => this.initialize(), 1000);
    }

    initialize() {
        this.initCodeIntegrity();
        this.initDOMProtection();
        this.initDevToolsDetection();
        this.initLicenseMonitoring();
        this.initKeyboardProtection();
        this.initContextMenuProtection();
        this.monitoringActive = true;

        console.log('%c⚠️ Security System Active', 'color: #f44336; font-size: 16px; font-weight: bold;');
    }

    initCodeIntegrity() {
        const criticalCode = [
            typeof unlockFeatures,
            typeof checkLicenseKey,
            typeof checkAndRestoreLicense
        ].join('|');

        this.integrityHash = this.quickHash(criticalCode);

        setInterval(() => this.checkCodeIntegrity(), 10000);
    }

    checkCodeIntegrity() {
        const currentCode = [
            typeof unlockFeatures,
            typeof checkLicenseKey,
            typeof checkAndRestoreLicense
        ].join('|');

        const currentHash = this.quickHash(currentCode);

        if (currentHash !== this.integrityHash) {
            this.handleTamper('Code integrity violation detected');
        }
    }

    quickHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return hash.toString(16);
    }

    initDOMProtection() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;

                    if (element.classList.contains('premium-feature')) {
                        if (!this.isLicenseValid && !element.classList.contains('locked')) {
                            this.handleTamper('DOM manipulation detected on premium feature');
                            element.classList.add('locked');
                        }
                    }
                }

                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(node => {
                        if (node.tagName === 'SCRIPT' && node.src && node.src.includes('security.js')) {
                            this.handleTamper('Security module removal attempt');
                        }
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });

        this.protectPremiumElements();
    }

    protectPremiumElements() {
        const premiumElements = document.querySelectorAll('.premium-feature');
        premiumElements.forEach(element => {
            Object.defineProperty(element, 'className', {
                set: (value) => {
                    if (!this.isLicenseValid && !value.includes('locked')) {
                        this.handleTamper('Direct className manipulation detected');
                        return 'premium-feature locked';
                    }
                    element.setAttribute('class', value);
                },
                get: () => element.getAttribute('class')
            });
        });
    }

    initDevToolsDetection() {
        const detectDevToolsBySize = () => {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            return widthDiff || heightDiff;
        };

        const detectDebugger = () => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            return (end - start) > 100;
        };

        const detectConsole = () => {
            let devtools = false;
            const element = new Image();
            Object.defineProperty(element, 'id', {
                get: function () {
                    devtools = true;
                    return 'detected';
                }
            });
            console.log('%c', element);
            return devtools;
        };

        setInterval(() => {
            const sizeDetect = detectDevToolsBySize();

            if (sizeDetect && !this.devToolsOpen) {
                this.devToolsOpen = true;
                this.handleDevToolsOpen();
            } else if (!sizeDetect && this.devToolsOpen) {
                this.devToolsOpen = false;
            }
        }, 1000);

        setInterval(() => {
            if (detectDebugger()) {
                this.handleDevToolsOpen();
            }
        }, 5000);
    }

    handleDevToolsOpen() {
        console.clear();
        console.log('%c🚨 WARNING 🚨', 'color: #f44336; font-size: 24px; font-weight: bold;');
        console.log('%cUnauthorized access to developer tools detected.', 'color: #ff9800; font-size: 16px;');
        console.log('%cAttempting to bypass license protection is a violation of terms.', 'color: #ff9800; font-size: 14px;');

        this.showDevToolsWarning();
    }

    showDevToolsWarning() {
        if (sessionStorage.getItem('devToolsWarningShown')) return;

        const overlay = document.createElement('div');
        overlay.id = 'devtools-warning-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-family: Arial, sans-serif;
        `;

        overlay.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h1 style="color: #f44336; font-size: 48px; margin-bottom: 20px;">⚠️ WARNING</h1>
                <p style="font-size: 20px; margin-bottom: 10px;">Developer Tools Detected</p>
                <p style="font-size: 16px; color: #aaa; margin-bottom: 30px;">
                    Tampering with this application may violate license terms.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    padding: 12px 30px;
                    font-size: 16px;
                    background: #2196f3;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">I Understand</button>
            </div>
        `;

        document.body.appendChild(overlay);
        sessionStorage.setItem('devToolsWarningShown', 'true');

        setTimeout(() => {
            if (overlay.parentElement) overlay.remove();
        }, 10000);
    }

    initLicenseMonitoring() {
        setInterval(() => this.validateLicenseStatus(), 5000);
    }

    async validateLicenseStatus() {
        const localUnlocked = localStorage.getItem('keyboardProUnlocked') === 'true';
        const cookieUnlocked = this.getCookie('keyboardProUnlocked') === 'true';

        this.isLicenseValid = localUnlocked || cookieUnlocked;

        if (!this.isLicenseValid) {
            const premiumElements = document.querySelectorAll('.premium-feature');
            let tampered = false;

            premiumElements.forEach(el => {
                if (!el.classList.contains('locked')) {
                    el.classList.add('locked');
                    tampered = true;
                }
            });

            if (tampered) {
                this.handleTamper('License validation failed - features re-locked');
            }

            const premiumSection = document.getElementById('premiumSection');
            if (premiumSection && premiumSection.style.display === 'none') {
                premiumSection.style.display = 'block';
            }
        }
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    initKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12') {
                e.preventDefault();
                this.handleBlockedAction('F12 key blocked');
                return false;
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.handleBlockedAction('DevTools shortcut blocked');
                return false;
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.handleBlockedAction('Console shortcut blocked');
                return false;
            }

            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.handleBlockedAction('Inspector shortcut blocked');
                return false;
            }

            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.handleBlockedAction('View Source blocked');
                return false;
            }

            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.handleBlockedAction('Save Page blocked');
                return false;
            }
        }, true);
    }

    handleBlockedAction(action) {
        console.warn(`🛡️ Security: ${action}`);
    }

    initContextMenuProtection() {
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return true;
            }

            e.preventDefault();
            this.handleBlockedAction('Right-click menu blocked');
            return false;
        }, false);
    }

    handleTamper(reason) {
        if (this.tamperDetected) return;

        this.tamperDetected = true;
        console.error(`🚨 SECURITY ALERT: ${reason}`);

        document.querySelectorAll('.premium-feature').forEach(el => {
            el.classList.add('locked');
            const summary = el.querySelector('summary');
            if (summary && !summary.textContent.includes('🔒')) {
                summary.textContent += ' 🔒';
            }
        });

        if (!this.isLicenseValid) {
            localStorage.removeItem('keyboardProUnlocked');
            this.deleteCookie('keyboardProUnlocked');
        }

        const premiumSection = document.getElementById('premiumSection');
        if (premiumSection) {
            premiumSection.style.display = 'block';
        }

        setTimeout(() => {
            alert('⚠️ Security Alert: Unauthorized modification detected. Premium features have been locked. Please use a valid license key.');
            this.tamperDetected = false;
        }, 500);
    }

    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    setLicenseValid(valid) {
        this.isLicenseValid = valid;
    }

    isSecurityActive() {
        return this.monitoringActive;
    }
}

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    function initSecurity() {
        window.securityManager = new SecurityManager();

        Object.defineProperty(window, 'securityManager', {
            writable: false,
            configurable: false
        });

        let unloadAttempts = 0;
        window.addEventListener('beforeunload', (e) => {
            unloadAttempts++;
            if (unloadAttempts > 5) {
                console.warn('Multiple page unload attempts detected');
            }
        });
    }

})();
