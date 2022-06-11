'use strict';

const firstByTag = t => document.getElementsByTagName(t)[0];
const firstByClass = c => document.getElementsByClassName(c)[0];
const firstByClassIn = (c, element) => element.getElementsByClassName(c)[0];

const clean = element => {
  element.innerHTML = '';
  let c = element.lastElementChild;
  if (!c) return;
  c.innerHTML = '';
  while (c) {
    element.removeChild(c);
    c = element.lastElementChild;
  }
  return element;
}

const create = name => document.createElement(name);
const createIn = (name, element) => element.appendChild(create(name));
const cleanCreateIn = (name, element) => {
  clean(element);
  return createIn(name, element);
}

const listen = wrappers => wrappers.forEach(w => w.Listen());

const main = firstByTag('main');

const dynamic = {
  instance: firstByClass('dynamic'),
  states: {
    initial: 'oshch',
    animated: 'llipop among dicks',
    reverse: {
      'oshch': 'initial',
      'llipop among dicks': 'animated',
    },
  },
  interval: null,
  isInProgress: {
    initial: false,
    animated: false,
  },
  timeouts: [],
  _ANIMATION_INTERVAL: 40,

  Animate() {
    this.interval = setInterval(() => {
      this.apply(this.states.animated);
      setTimeout(() => this.apply(this.states.initial), 7_000);
    }, 45_000);
  },

  AnimateOnEnter() {
    this.Stop();
    if (this.isInProgress.animated
        || this.instance.innerHTML == this.states.animated) return;
    if (this.isInProgress.initial) {
      this.timeouts.forEach(clearTimeout);
      this.timeouts = [];
      this.isInProgress.initial = false;
    }
    this.apply(this.states.animated);
  },

  AnimateOnLeave() {
    if (this.isInProgress.initial
        || this.instance.innerHTML == this.states.initial) return;
    if (this.isInProgress.animated) {
      this.timeouts.forEach(clearTimeout);
      this.timeouts = [];
      this.isInProgress.animated = false;
    }
    this.apply(this.states.initial);
    this.Animate();
  },

  Stop() {
    clearInterval(this.interval);
  },

  apply(state) {
    let delay = 0;
    const stateName = this.states.reverse[state];

    this.isInProgress[stateName] = true;
    const after = this.clean(state);
    this.timeouts.push(setTimeout(() => {
      [...state].forEach((ch, i) => {
        this.timeouts.push(setTimeout(() => {
          this.instance.innerHTML += ch
          if (i == state.length - 1) {
            this.isInProgress[stateName] = false;
            this.timeouts = [];
          }
        }, delay));
        delay += this._ANIMATION_INTERVAL;
      });
    }, after));
  },

  clean() {
    const ins = this.instance;
    let delay = 0;

    [...ins.innerHTML].forEach(() => {
      this.timeouts.push(setTimeout(() => {
          ins.innerHTML = ins.innerHTML.slice(0, ins.innerHTML.length - 1);
      }, delay));
      delay += this._ANIMATION_INTERVAL;
    });

    return delay + this._ANIMATION_INTERVAL;
  },
};

const logo = {
  instance: firstByClass('logo'),

  Listen() {
    this.instance.addEventListener('click', () => {
      window.history.pushState(null, '', '/');
      clean(main);
    });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches
        && window.innerWidth >= 930) {
      dynamic.Animate();
      this.instance.addEventListener('mouseenter', this.onEnter);
      this.instance.addEventListener('mouseleave', this.onLeave);
    } else {
      this.instance.title = 'lollipop among dicks';
    }

    window.addEventListener('resize', () => {
      this.cleanup();

      if (window.innerWidth < 930) {
        dynamic.AnimateOnLeave();
        this.instance.title = 'lollipop among dicks';
      } else {
        dynamic.Animate();
        this.instance.title = '';
        this.instance.addEventListener('mouseenter', this.onEnter);
        this.instance.addEventListener('mouseleave', this.onLeave);
      }
    })
  },

  onEnter() { dynamic.AnimateOnEnter() },

  onLeave() { dynamic.AnimateOnLeave() },

  cleanup() {
    dynamic.Stop();
    this.instance.removeEventListener('mouseenter', this.onEnter);
    this.instance.removeEventListener('mouseleave', this.onLeave);
  },
};

const menuToggler = {
  instance: firstByClassIn('button', firstByClass('menu-toggler')),
  state: 'initial',
  transitions: {
    initial() {
      navigation.Instance.style.display = 'block';
      this.instance.innerHTML = '✕';
      this.state = 'toggled';
    },

    toggled() {
      navigation.Instance.style.display = 'none';
      this.instance.innerHTML = '☰';
      this.state = 'initial';
    },
  },

  Listen() {
    this.instance.addEventListener('click', this.toggle.bind(this));

    window.addEventListener('resize', () => {
      if (window.innerWidth > 568) {
        this.transitions.toggled.bind(this)();
        navigation.Instance.style.display = 'block';
      } else if (this.state == 'initial') {
        navigation.Instance.style.display = 'none';
      }
    })
  },

  toggle() {
    this.transitions[this.state].bind(this)();
  },
};

const navigation = {
  Instance: firstByTag('nav'),
  items: {
    blog: {
      instance: firstByClass('blog'),

      Load() {
        window.history.pushState(null, '', 'blog');

        navigation.items.activate('blog');
      },
    },
    about: {
      instance: firstByClass('about'),

      Load() {
        window.history.pushState(null, '', 'about');

        navigation.items.activate('about');

        const about = cleanCreateIn('div', main);
        about.style.textAlign = 'center';
        about.style.fontSize = '1.5rem';
        about.innerHTML = 'George Looshch, a lollipop among dicks';
      },
    },
    cv: {
      instance: firstByClass('cv'),

      Load() {
        window.history.pushState(null, '', 'cv');

        navigation.items.activate('cv');

        const cv = cleanCreateIn('div', main);
      },
    },
    presence: {
      instance: firstByClass('presence'),

      Load() {
        window.history.pushState(null, '', 'presence');

        navigation.items.activate('presence');

        const presence = cleanCreateIn('div', main);
        presence.style.display = 'flex';
        presence.style.gap = '3rem';
        presence.style.justifyContent = 'center';
        presence.style.fontSize = '1.5rem';

        const github = createIn('a', presence);
        github.href = 'https://github.com/looshch';
        github.innerHTML = 'GitHub';

        const linkedin = createIn('a', presence);
        linkedin.href = 'https://www.linkedin.com/in/looshch/';
        linkedin.innerHTML = 'LinkedIn';

        [github, linkedin].forEach(e => e.classList.add('link'));
      },
    },

    activate(item) {
      const items = navigation.items;
      Object.keys(items).filter(n => n != 'activate')
        .forEach(i => items[i].instance.classList.remove('active'));
      if (item == '404') return;
      items[item].instance.classList.add('active');
    },
  },

  Listen() {
    const items = this.items;
    const itemNames = Object.keys(items).filter(n => n != 'activate');
    itemNames.forEach(n => {
      const item = items[n];
      item.instance.addEventListener('click', item.Load.bind(item));
    });

    const path = window.location.pathname.replace('/', '');
    if (path == '') return;
    const item = items[path];
    if (item) {
      item.Load.bind(item)();
    } else {
      this.items.activate('404');
      const el = cleanCreateIn('div', main);
      el.style.marginTop = '15vh';
      el.style.textAlign = 'center';
      el.style.fontSize = '5rem';
      el.innerHTML = '404 Not Found';
    };
  },
};

listen([logo, navigation, menuToggler]);
