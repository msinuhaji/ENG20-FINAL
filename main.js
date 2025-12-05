const MOBILE_VERSION = event => {

};

const DESKTOP_VERSION = event => {

    // constants

    const SCROLL_CONTENT_DIV = document.getElementById('scrollContent');
    const PAGES_DIV = document.getElementById('pages')
    const PARALLAX_DICTIONARY = [
        { class: "parallax-front1", speed: -0.2 },
        { class: "parallax-front2", speed: -0.4 },
        { class: "parallax-front3", speed: -0.3 },
        { class: "parallax-front4", speed: -0.15 },
        { class: "parallax-behind1", speed: 0.2 },
        { class: "parallax-behind2", speed: 0.07 },
        { class: "parallax-behind3", speed: 0.13 },
    ]

    // variables

    let scrollArray = [0, 0]; // [current, desired];
    let cursorPos = [0, 0] // from top left

    // functions

    const LERP = (s, e, a) => s * (1 - a) + e * a;
    const HEARTBEAT = function (callback) {
        const f = () => { callback(); requestAnimationFrame(f) };
        f();
    }

    // events

    document.addEventListener('wheel', e => {
        scrollArray[1] = Math.min(Math.max(0, scrollArray[1] + e.deltaY), PAGES_DIV.offsetHeight - window.innerHeight);
    });

    document.addEventListener('mousemove', e => {
        [cursorPos[0], cursorPos[1]] = [e.clientX, e.clientY]; 
    });

    HEARTBEAT(async () => {

        scrollArray[0] = LERP(scrollArray[0], -scrollArray[1], 0.1);
        PAGES_DIV.style.transform = 'translateY(' + scrollArray[0] + 'px)'

        PARALLAX_DICTIONARY.forEach(x => {
            const elementsOfClass = document.getElementsByClassName(x.class);
            if (elementsOfClass) {
                Array.from(elementsOfClass).forEach(element => {
                    const pageWrapper = element.closest('.page-wrapper');
                    if (pageWrapper) {
                        const viewCenter = -scrollArray[0] + window.innerHeight / 2;
                        const pageCenter = pageWrapper.offsetTop + pageWrapper.offsetHeight / 2;
                        const scroll = viewCenter - pageCenter;
                        element.style.transform = 'translateY(' + scroll * x.speed + 'px)';
                    }
                });
            }
        });

        SCROLL_CONTENT_DIV.style.transform = 'translateX(-50%) translateY(' + scrollArray[0] / (PAGES_DIV.offsetHeight - window.innerHeight) * (SCROLL_CONTENT_DIV.offsetHeight - SCROLL_CONTENT_DIV.children[0].offsetHeight) + 'px)';

        const rect = SCROLL_CONTENT_DIV.getBoundingClientRect();

        if (cursorPos[0] > rect.left && cursorPos[0] < rect.right) {
            if (cursorPos[1] > rect.top && cursorPos[1] < rect.bottom) {
                console.log('within bounds')
            }
        };
    });

    // other

    // Array.from(SCROLL_CONTENT_DIV.children).forEach(x => {
    //     console.log('1')
    //     x.onmouseenter = () => console.log('hi')
    // });

};

// Force scroll to top BEFORE DOMContentLoaded
window.scrollTo(0, 0);
history.scrollRestoration = 'manual'; // Prevent browser scroll restoration

const IS_DESKTOP = () => { return true };

document.addEventListener('DOMContentLoaded', e => { IS_DESKTOP() ? DESKTOP_VERSION(e) : MOBILE_VERSION(e); });
