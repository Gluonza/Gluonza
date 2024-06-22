﻿export class LoadingScreen {
    private loadingScreen: HTMLDivElement | undefined;
    private alreadyLoaded: boolean = false;

    private quotes: string[] = [
        "Hold on, we're doing some magic.",
        "Loading... just like your laundry, it takes time.",
        "Taking a nap, please wait.",
        "Grabbing coffee... I mean data.",
        "Do not panic, we're professionals.",
        "Loading... because patience is a virtue.",
        "Your wait time is directly proportional to our coffee breaks.",
        "Loading... If only it was as fast as you wanted.",
        "Getting things ready for you... eventually.",
        "We're almost there... in an alternate universe.",
        "Spinning up the hamsters...",
        "Assembling awesome stuff for you.",
        "Loading... because instant gratification is so last century.",
        "Patience you must have, my young padawan.",
        "Our servers are in a yoga class, stretching it out.",
        "These quotes mean actually nothing. What means to us is you using Gluonza <3"
    ];

    init() {
        if (this.alreadyLoaded) return;
        this.alreadyLoaded = true;

        this.injectCSS('custom-styles', this.customCSS);

        this.loadingScreen = document.createElement('div');
        this.loadingScreen.classList.add('loading-screen');

        const loadingContent = document.createElement('div');
        loadingContent.classList.add('loading-content');

        const loadingText = document.createElement('div');
        loadingText.classList.add('loading-text');

        const spanGluon = document.createElement('span');
        spanGluon.classList.add('gluon');
        spanGluon.textContent = 'Gluon';

        const spanZa = document.createElement('span');
        spanZa.classList.add('za');
        spanZa.textContent = 'za';

        loadingText.appendChild(spanGluon);
        loadingText.appendChild(spanZa);

        const loadingBar = document.createElement('div');
        loadingBar.classList.add('loading-bar');

        const loadingProgress = document.createElement('div');
        loadingProgress.classList.add('loading-progress');

        loadingBar.appendChild(loadingProgress);

        const quoteText = document.createElement('div');
        quoteText.classList.add('quote-text');
        quoteText.textContent = this.getRandomQuote();

        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(loadingBar);
        loadingContent.appendChild(quoteText);

        this.loadingScreen.appendChild(loadingContent);

        document.body.appendChild(this.loadingScreen);
    }

    hide() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            this.loadingScreen.addEventListener('transitionend', () => {
                this.loadingScreen?.remove();
            });
        }
    }

    getRandomQuote(): string {
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        return this.quotes[randomIndex];
    }

    customCSS = `
      .loading-screen {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        color: var(--text-color);
        background-color: var(--bg-color);
        position: relative;
        z-index: 3001;
        transition: opacity 1s, background-color 0.5s;
      }
    
      .loading-content {
        text-align: center;
      }
    
      .loading-text {
        font-size: 4rem;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        animation: fade-in 2s;
        transition: transform 0.5s, font-size 0.5s;
      }
    
      .gluon {
        color: #6873c8;
        animation: fade 1.5s infinite;
      }
    
      .za {
        font-weight: bold;
        color: #fff;
        animation: fade 1.5s infinite 0.75s;
      }
    
      .loading-bar {
        width: 100%;
        max-width: 400px;
        height: 15px;
        background-color: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
        margin-bottom: 15px;
        transition: width 0.5s, height 0.5s;
      }
    
      .loading-progress {
        width: 100%;
        height: 100%;
        background-color: #6873c8;
        animation: loading 2s infinite;
      }
    
      .quote-text {
        font-size: 1.5rem;
        color: var(--text-color);
        margin-top: 15px;
        animation: fade-in 2s;
        transition: font-size 0.5s, margin-top 0.5s;
        text-wrap: wrap;
        max-width: 400px;
      }

      .fade-out {
        opacity: 0;
        transition: opacity 0.5s;
      }

      @keyframes fade {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      @keyframes fade-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    
      @keyframes loading {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    
      @media (prefers-color-scheme: dark) {
        :root {
          --bg-color: #121212;
          --text-color: #ffffff;
        }
      }
    
      @media (prefers-color-scheme: light) {
        :root {
          --bg-color: #ffffff;
          --text-color: #000000;
        }
      }
    
      @media (max-width: 768px) {
        .loading-text {
          font-size: 3rem;
        }

        .loading-bar {
          max-width: 300px;
          height: 12px;
        }

        .quote-text {
          font-size: 1.25rem;
        }
      }
    
      @media (max-width: 480px) {
        .loading-text {
          font-size: 2rem;
        }

        .loading-bar {
          max-width: 200px;
          height: 10px;
        }

        .quote-text {
          font-size: 1rem;
        }
      }
    `;

    injectCSS(id: string, css: string | null) {
        let existingStyle = document.getElementById(id);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;

        document.head.appendChild(style);
    }
}
