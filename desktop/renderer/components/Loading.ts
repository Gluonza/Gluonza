export class LoadingScreen {
    private loadingScreen: HTMLDivElement | undefined;
    private alreadyLoaded: boolean = false;

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

        loadingContent.appendChild(loadingText);
        loadingContent.appendChild(loadingBar);

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
        transition: opacity 1s;
      }
    
      .loading-content {
        text-align: center;
      }
    
      .loading-text {
        font-size: 3rem;
        font-family: Arial, sans-serif;
        display: flex;
        justify-content: center;
        margin-bottom: 5px;
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
        max-width: 300px;
        height: 10px;
        background-color: #e0e0e0;
        border-radius: 5px;
        overflow: hidden;
        position: relative;
      }
    
      .loading-progress {
        width: 100%;
        height: 100%;
        background-color: #6873c8;
        animation: loading 2s infinite;
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
          font-size: 2rem;
        }
      }
    
      @media (max-width: 480px) {
        .loading-text {
          font-size: 1.5rem;
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