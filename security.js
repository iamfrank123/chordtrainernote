/**
 * Security Manager - Multi-Layer Protection System
 * Protects premium features from tampering and unauthorized access
 */

class SecurityManager {
    constructor() {
        this.isLicenseValid = false;
        this.integrityHash = null;
        this.devToolsOpen = false;
        this.tamperDetected = false;
        this.monitoringActive = false;

        // Delay initialization to avoid detection
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

    // ============================================
    // CODE INTEGRITY PROTECTION
    // ============================================

    initCodeIntegrity() {
        // Create hash of critical functions to detect modification
        const criticalCode = [
            typeof unlockFeatures,
            typeof checkLicenseKey,
            typeof checkAndRestoreLicense
        ].join('|');

        this.integrityHash = this.quickHash(criticalCode);

        // Periodic integrity check every 10 seconds
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

    // ============================================
    // DOM INTEGRITY PROTECTION
    // ============================================

    initDOMProtection() {
        // Monitor all premium features for class tampering
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const element = mutation.target;

                    // Check if someone is trying to unlock premium features
                    if (element.classList.contains('premium-feature')) {
                        if (!this.isLicenseValid && !element.classList.contains('locked')) {
                            // Tampering detected: someone removed 'locked' class
                            this.handleTamper('DOM manipulation detected on premium feature');
                            element.classList.add('locked');
                        }
                    }
                }

                // Detect if security script is being removed
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    mutation.removedNodes.forEach(node => {
                        if (node.tagName === 'SCRIPT' && node.src && node.src.includes('security.js')) {
                            this.handleTamper('Security module removal attempt');
                        }
                    });
                }
            });
        });

        // Observe the entire document
        observer.observe(document.documentElement, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });

        // Additional protection: freeze premium elements style
        this.protectPremiumElements();
    }

    protectPremiumElements() {
        const premiumElements = document.querySelectorAll('.premium-feature');
        premiumElements.forEach(element => {
            // Make it harder to modify through console
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

    // ============================================
    // DEVTOOLS DETECTION
    // ============================================

    initDevToolsDetection() {
        // Method 1: Check window size difference
        const detectDevToolsBySize = () => {
            const threshold = 160;
            const widthDiff = window.outerWidth - window.innerWidth > threshold;
            const heightDiff = window.outerHeight - window.innerHeight > threshold;
            return widthDiff || heightDiff;
        };

        // Method 2: Debugger detection
        const detectDebugger = () => {
            const start = performance.now();
            debugger; // This line will pause if DevTools is open
            const end = performance.now();
            return (end - start) > 100; // If paused, time difference is significant
        };

        // Method 3: Console detection trick
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

        // Check periodically
        setInterval(() => {
            const sizeDetect = detectDevToolsBySize();

            if (sizeDetect && !this.devToolsOpen) {
                this.devToolsOpen = true;
                this.handleDevToolsOpen();
            } else if (!sizeDetect && this.devToolsOpen) {
                this.devToolsOpen = false;
            }
        }, 1000);

        // More aggressive check every 5 seconds
        setInterval(() => {
            if (detectDebugger()) {
                this.handleDevToolsOpen();
            }
        }, 5000);
    }

    handleDevToolsOpen() {
        // Show warning but don't block (too aggressive may annoy legitimate users)
        console.clear();
        console.log('%c🚨 WARNING 🚨', 'color: #f44336; font-size: 24px; font-weight: bold;');
        console.log('%cUnauthorized access to developer tools detected.', 'color: #ff9800; font-size: 16px;');
        console.log('%cAttempting to bypass license protection is a violation of terms.', 'color: #ff9800; font-size: 14px;');

        // Optional: Add visual warning overlay
        this.showDevToolsWarning();
    }

    showDevToolsWarning() {
        // Only show once per session
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

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (overlay.parentElement) overlay.remove();
        }, 10000);
    }

    // ============================================
    // LICENSE MONITORING
    // ============================================

    initLicenseMonitoring() {
        // Check license status every 5 seconds
        setInterval(() => this.validateLicenseStatus(), 5000);
    }

    async validateLicenseStatus() {
        // Check if license is supposed to be active
        const localUnlocked = localStorage.getItem('keyboardProUnlocked') === 'true';
        const cookieUnlocked = this.getCookie('keyboardProUnlocked') === 'true';

        this.isLicenseValid = localUnlocked || cookieUnlocked;

        // If license is invalid, ensure everything is locked
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

            // Ensure premium section is visible if not licensed
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

    // ============================================
    // KEYBOARD PROTECTION
    // ============================================

    initKeyboardProtection() {
        document.addEventListener('keydown', (e) => {
            // F12 - Opens DevTools
            if (e.key === 'F12') {
                e.preventDefault();
                this.handleBlockedAction('F12 key blocked');
                return false;
            }

            // Ctrl+Shift+I - Opens DevTools
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                this.handleBlockedAction('DevTools shortcut blocked');
                return false;
            }

            // Ctrl+Shift+J - Opens Console
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
                this.handleBlockedAction('Console shortcut blocked');
                return false;
            }

            // Ctrl+Shift+C - Element Inspector
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.handleBlockedAction('Inspector shortcut blocked');
                return false;
            }

            // Ctrl+U - View Source
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
                this.handleBlockedAction('View Source blocked');
                return false;
            }

            // Ctrl+S - Save Page
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.handleBlockedAction('Save Page blocked');
                return false;
            }
        }, true); // Use capture phase
    }

    handleBlockedAction(action) {
        console.warn(`🛡️ Security: ${action}`);
        // Could show a toast notification here if desired
    }

    // ============================================
    // CONTEXT MENU PROTECTION
    // ============================================

    initContextMenuProtection() {
        document.addEventListener('contextmenu', (e) => {
            // Allow context menu on input fields for usability
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return true;
            }

            e.preventDefault();
            this.handleBlockedAction('Right-click menu blocked');
            return false;
        }, false);
    }

    // ============================================
    // TAMPER DETECTION HANDLER
    // ============================================

    handleTamper(reason) {
        if (this.tamperDetected) return; // Prevent spam

        this.tamperDetected = true;
        console.error(`🚨 SECURITY ALERT: ${reason}`);

        // Lock all premium features immediately
        document.querySelectorAll('.premium-feature').forEach(el => {
            el.classList.add('locked');
            const summary = el.querySelector('summary');
            if (summary && !summary.textContent.includes('🔒')) {
                summary.textContent += ' 🔒';
            }
        });

        // Clear any unauthorized unlocks from storage
        if (!this.isLicenseValid) {
            localStorage.removeItem('keyboardProUnlocked');
            this.deleteCookie('keyboardProUnlocked');
        }

        // Show the premium section again
        const premiumSection = document.getElementById('premiumSection');
        if (premiumSection) {
            premiumSection.style.display = 'block';
        }

        // Optional: Show alert to user
        setTimeout(() => {
            alert('⚠️ Security Alert: Unauthorized modification detected. Premium features have been locked. Please use a valid license key.');
            this.tamperDetected = false;
        }, 500);
    }

    deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    // ============================================
    // PUBLIC API
    // ============================================

    setLicenseValid(valid) {
        this.isLicenseValid = valid;
    }

    isSecurityActive() {
        return this.monitoringActive;
    }
}

// Initialize Security Manager
// Use IIFE to make it harder to disable
(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSecurity);
    } else {
        initSecurity();
    }

    function initSecurity() {
        // Create global security instance
        window.securityManager = new SecurityManager();

        // Make it harder to remove
        Object.defineProperty(window, 'securityManager', {
            writable: false,
            configurable: false
        });

        // Prevent unload during session
        let unloadAttempts = 0;
        window.addEventListener('beforeunload', (e) => {
            unloadAttempts++;
            if (unloadAttempts > 5) {
                console.warn('Multiple page unload attempts detected');
            }
        });
    }

    // Disable console in production (optional - can be annoying for debugging)
    // Uncomment the following lines to enable this protection:
    /*
    if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        const noop = () => {};
        ['log', 'warn', 'error', 'info', 'debug', 'trace'].forEach(method => {
            console[method] = noop;
        });
    }
    */
})();
