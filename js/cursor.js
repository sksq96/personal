const map = (x, a, b, c, d) => (x - a) * (d - c) / (b - a) + c;

// Linear interpolation
const lerp = (a, b, n) => (1 - n) * a + n * b;

const calcWinsize = () => {
    return {width: window.innerWidth, height: window.innerHeight};
};

// Gets the mouse position
const getMousePos = (e) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY)    {
        posx = e.clientX + body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    
    return { x : posx, y : posy }
};

const getPageYScroll = () =>
  window.pageYOffset || document.documentElement.scrollTop;

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => {
    winsize = calcWinsize();
});

// Get the scroll Y position
let docYScroll = getPageYScroll();
window.addEventListener("scroll", () => {
    docYScroll = getPageYScroll();
});

// Track the mouse position
let mouse = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mouse = getMousePos(ev));

class Cursor {
    constructor(el, externalTxt) {
        this.externalTxt = externalTxt;
        this.DOM = {el: el};
        this.DOM.el.style.opacity = 0;
        this.DOM.circleInner = this.DOM.el.querySelector('.cursor__inner');
        
        this.filterId = '#filter-1';
        this.DOM.feTurbulence = document.querySelector(`${this.filterId} > feTurbulence`);
        
        this.primitiveValues = {turbulence: 0};


        this.bounds = this.DOM.el.getBoundingClientRect();
        
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.2},
            ty: {previous: 0, current: 0, amt: 0.2},
            radius: {previous: 60, current: 60, amt: 0.2}
        };


        this.onMouseMoveEv = () => {
            this.renderedStyles.tx.previous = this.renderedStyles.tx.current = mouse.x - this.bounds.width/2;
            this.renderedStyles.ty.previous = this.renderedStyles.ty.previous = mouse.y - this.bounds.height/2 - docYScroll;
            this.DOM.el.style.opacity = 1;
            let i = 0,
            intVal = setInterval(() => {
                if(++i === 1) {
                    this.externalTxt.classList.remove('in');
                } else if(i === 2) {
                    this.externalTxt.classList.add('active');
                } else {
                    this.externalTxt.classList.add('in');
                    clearInterval(intVal);
                }
            }, 1500);
            requestAnimationFrame(() => this.render());
            window.removeEventListener('mousemove', this.onMouseMoveEv);
        };
        window.addEventListener('mousemove', this.onMouseMoveEv);
    }
    render() {
        this.renderedStyles['tx'].current = mouse.x - this.bounds.width/2;
        this.renderedStyles['ty'].current = mouse.y - this.bounds.height/2 - docYScroll;

        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }
                    
        this.DOM.el.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px)`;
        this.externalTxt.style.transform = `translateX(${(this.renderedStyles['tx'].previous)}px) translateY(${this.renderedStyles['ty'].previous}px)`;
        this.DOM.circleInner.setAttribute('r', this.renderedStyles['radius'].previous);

        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.renderedStyles['radius'].current = 100;
    }
    leave() {
        this.renderedStyles['radius'].current = 60;
    }
}