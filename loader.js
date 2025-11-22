// File: loader.js
export function initLoader({ loaderId = 'loader', progressFillId = 'progressFill', progressPercentId = 'progressPercent', xhrCtor = XMLHttpRequest, url = window.location.href } = {}) {
    const loader = document.getElementById(loaderId);
    const progressFill = document.getElementById(progressFillId);
    const progressText = document.getElementById(progressPercentId);
    if (!loader || !progressFill || !progressText) {
        return { xhr: null, destroy: () => { } };
    }

    const xhr = new xhrCtor();
    try {
        xhr.responseType = 'document';
    } catch (e) { /* some fakes may not support this */ }

    let removed = false;
    function removeLoaderSoon() {
        // fade out then remove
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) loader.parentNode.removeChild(loader);
                removed = true;
            }, 400);
        }, 300);
    }

    xhr.onprogress = function (event) {
        if (event && event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            progressFill.style.width = percent + '%';
            progressText.innerText = percent + '%';
        }
    };

    xhr.onload = function () {
        removeLoaderSoon();
    };

    xhr.onerror = function () {
        // remove gracefully on error
        removeLoaderSoon();
    };

    xhr.open('GET', url, true);
    xhr.send();

    return {
        xhr,
        destroy() {
            try { xhr.abort && xhr.abort(); } catch (e) { }
            if (!removed && loader.parentNode) loader.parentNode.removeChild(loader);
        }
    };
}