﻿import "./loading.css";

export class LoadingScreen {
    private loadingScreen: HTMLDivElement | undefined;
    private alreadyLoaded: boolean = false;

    private quotes: string[] = [
        "Hold on, we're doing some magic.",
        "Loading... just like your laundry, it takes time.",
        "Taking a nap, please wait.",
        "Grabbing coffee... I mean data.",
        "Do not panic, we're professionals.",
        "Do not panic, we don't got your token",
        "Riddim is a pretty cool gal, she just doesn't like kids.",
        "Loading... because patience is a virtue.",
        "Your wait time is directly proportional to our coffee breaks.",
        "Loading... If only it was as fast as you wanted.",
        "It's okay. This loading screen is faster then the average support forum.",
        " \"I tried to be normal once. Worst two minutes of my life.\" - kaan ",
        " \"Just got a amogus plush in the clearance section\" - Salt ",
        "Getting things ready for you... eventually.",
        "We're almost there... in an alternate universe.",
        "Spinning up the hamsters... This was generated by ChatGPT, not taken from Discord",
        "I told my computer I needed a break, and now it won’t stop sending me Kit-Kat ads.",
        "Assembling awesome stuff for you.",
        "Loading... because instant gratification is so last century.",
        "Patience you must have, my young padawan.",
        "Our servers are in a yoga class, stretching it out.",
        "These quotes mean actually nothing. What means to us is you using Gluonza <3",
        "5T3AL!NG Y0UR T0K3N",
        "\"Why are my PNG's not PNG-ing\" - Skye"
    ];

    init() {
        if (this.alreadyLoaded) return;
        this.alreadyLoaded = true;

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
}
