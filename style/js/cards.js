let cardPrintLayout;
function captureCardPrintLayout() {
    const card = document.querySelector(".study-card.active-card");
    if (!card) return;
    const style = getComputedStyle(card);
    cardPrintLayout = {
        width: card.getBoundingClientRect().width,
        rootFont: getComputedStyle(document.documentElement).fontSize,
        font: style.fontSize,
        padding: style.padding
    };
}

// CSS counters skip display:none slides. Compute numbers in document order instead.
function numberCardHeadings(root) {
    const counts = [0, 0, 0, 0, 0];
    root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(heading => {
        const level = Number(heading.tagName.slice(1));
        if (level === 1) {
            counts.fill(0);
            return;
        }
        counts[level - 2] += 1;
        counts.fill(0, level - 1);
        if (heading.closest(".study-card")) {
            heading.dataset.cardNumber = counts.slice(0, level - 1).join(".");
        }
    });
}

let cardKeyboardController;

function initCards() {

    const deck =
        document.querySelector(".card-deck");

    if (deck?.classList.contains("cards-ready")) return;

    cardKeyboardController?.abort();

    if (!deck) return;

    const cards = Array.from(
        deck.querySelectorAll(".study-card")
    );

    if (!cards.length) return;

    numberCardHeadings(deck.closest(".md-typeset") || deck);
    deck.classList.add("cards-ready");

    const exportButton = document.querySelector("#export-cards");
    exportButton?.addEventListener("click", async () => {
        exportButton.disabled = true;
        exportButton.textContent = "准备中…";
        try {
            await document.fonts.ready;
            if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
            if (window.MathJax?.typesetPromise) await window.MathJax.typesetPromise([deck]);
            await Promise.all(Array.from(deck.querySelectorAll("img"), img => {
                img.loading = "eager";
                return img.decode ? img.decode().catch(() => {}) : Promise.resolve();
            }));
            captureCardPrintLayout();
            window.print();
        } catch (error) {
            console.error("PDF preparation failed", error);
            window.alert("导出准备失败，请等待页面加载完成后重试。");
        } finally {
            exportButton.disabled = false;
            exportButton.textContent = "导出 PDF";
        }
    });


    const prevButton =
        document.querySelector("#prev-card");

    const nextButton =
        document.querySelector("#next-card");

    const overviewButton =
        document.querySelector("#overview-card");

    const counter =
        document.querySelector("#card-counter");

    const progressBar =
        document.querySelector(".card-progress-bar");

    const overview =
        document.querySelector("#card-overview");

    const overviewList =
        document.querySelector("#card-overview-list");

    const closeOverview =
        document.querySelector("#close-overview");


    let currentIndex = 0;


    /* ==============================
       更新卡片
       ============================== */

    function showCard(index, direction = "next") {

        if (index < 0) {
            index = cards.length - 1;
        }

        if (index >= cards.length) {
            index = 0;
        }


        currentIndex = index;


        cards.forEach(card => {

            card.classList.remove(
                "active-card",
                "card-enter-next",
                "card-enter-prev"
            );

        });


        const card = cards[currentIndex];

        card.classList.add("active-card");


        /*
         * 动画
         */

        if (direction === "next") {

            card.classList.add(
                "card-enter-next"
            );

        } else {

            card.classList.add(
                "card-enter-prev"
            );

        }


        /*
         * 页码
         */

        if (counter) counter.textContent =
            `${currentIndex + 1} / ${cards.length}`;


        /*
         * 进度条
         */

        const progress =
            ((currentIndex + 1) / cards.length)
            * 100;

        if (progressBar) progressBar.style.width =
            `${progress}%`;


        /*
         * 幻灯片浏览状态
         */

        updateOverview();


        /*
         * 右侧目录联动
         */

        syncTOC(card);


        /*
         * 修改 URL hash
         */

        const heading =
            card.querySelector("h2, h3, h4, h5, h6");

        if (heading && heading.id) {

            history.replaceState(
                null,
                "",
                "#" + heading.id
            );

        }

    }


    /* ==============================
       下一张
       ============================== */

    function nextCard() {

        showCard(
            currentIndex + 1,
            "next"
        );

    }


    /* ==============================
       上一张
       ============================== */

    function prevCard() {

        showCard(
            currentIndex - 1,
            "prev"
        );

    }


    /*
     * 按钮
     */

    prevButton?.addEventListener(
        "click",
        prevCard
    );


    nextButton?.addEventListener(
        "click",
        nextCard
    );


    /* ==============================
       键盘 ← →
       ============================== */

    cardKeyboardController = new AbortController();

    document.addEventListener(
        "keydown",
        event => {

            /*
             * 输入框中不触发
             */

            const tag =
                document.activeElement.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                document.activeElement.isContentEditable
            ) {
                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                nextCard();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                prevCard();

            }

        },
        { signal: cardKeyboardController.signal }
    );


    /* ==============================
       缩略图
       ============================== */

    function buildOverview() {

        if (!overviewList) return;

        overviewList.innerHTML = "";


        cards.forEach(
            (card, index) => {

                const item =
                    document.createElement("div");


                const cardTypes = ["normal", "concept", "exam", "mistake", "example", "summary", "question"];
                const type = cardTypes.find(type => card.classList.contains(`${type}-card`)) || "normal";
                item.className = `overview-item ${type}-card`;


                const heading = card.querySelector("h2, h3, h4, h5, h6")?.cloneNode(true);
                heading?.querySelectorAll(".headerlink").forEach(link => link.remove());
                const title = card.dataset.title || heading?.textContent.trim() || `卡片 ${index + 1}`;
                const number = document.createElement("span");
                number.className = "overview-number";
                number.textContent = String(index + 1).padStart(2, "0");
                const typeNames = {
                    normal: "普通", concept: "概念", exam: "考点", mistake: "易错",
                    example: "例题", summary: "总结", question: "思考"
                };
                const typeLabel = document.createElement("span");
                typeLabel.className = "overview-type";
                typeLabel.textContent = typeNames[type];
                const meta = document.createElement("div");
                meta.className = "overview-meta";
                meta.append(number, typeLabel);
                const label = document.createElement("strong");
                label.textContent = title;
                item.append(meta, label);


                item.addEventListener(
                    "click",
                    () => {

                        const direction =
                            index > currentIndex
                                ? "next"
                                : "prev";


                        showCard(
                            index,
                            direction
                        );


                        overview.classList.remove(
                            "open"
                        );

                    }
                );


                overviewList.appendChild(
                    item
                );

            }
        );

    }


    function updateOverview() {

        document
            .querySelectorAll(
                ".overview-item"
            )
            .forEach(
                (item, index) => {

                    item.classList.toggle(
                        "current",
                        index === currentIndex
                    );

                }
            );

    }


    overviewButton?.addEventListener(
        "click",
        () => {

            overview.classList.add(
                "open"
            );

        }
    );


    closeOverview?.addEventListener(
        "click",
        () => {

            overview.classList.remove(
                "open"
            );

        }
    );


    /*
     * 点击背景关闭
     */

    overview?.addEventListener(
        "click",
        event => {

            if (
                event.target === overview
            ) {

                overview.classList.remove(
                    "open"
                );

            }

        }
    );


    /* ==============================
       右侧目录同步
       ============================== */

    function syncTOC(card) {

        const heading =
            card.querySelector("h2, h3, h4, h5, h6");

        if (!heading) return;


        const id =
            heading.id;


        if (!id) return;


        /*
         * 清除 TOC 当前状态
         */

        document
            .querySelectorAll(
                ".md-nav--secondary .md-nav__link"
            )
            .forEach(link => {

                link.classList.remove(
                    "md-nav__link--active"
                );

            });


        /*
         * 找对应目录链接
         */

        const tocLink =
            document.querySelector(
                `.md-nav--secondary a[href="#${CSS.escape(id)}"]`
            );


        if (tocLink) {

            tocLink.classList.add(
                "md-nav__link--active"
            );

        }

    }


    /* ==============================
       点击右侧 TOC → 切换卡片
       ============================== */

    document
        .querySelectorAll(
            ".md-nav--secondary a[href^='#']"
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const targetId =
                        decodeURIComponent(
                            link
                                .getAttribute("href")
                                .slice(1)
                        );


                    const index =
                        cards.findIndex(
                            card => {

                                const heading =
                                    card.querySelector("h2, h3, h4, h5, h6");

                                return (
                                    heading &&
                                    heading.id === targetId
                                );

                            }
                        );


                    if (index !== -1) {

                        event.preventDefault();


                        const direction =
                            index > currentIndex
                                ? "next"
                                : "prev";


                        showCard(
                            index,
                            direction
                        );

                    }

                }
            );

        });


    /* ==============================
       如果 URL 已经有 #标题
       ============================== */

    function loadHash() {

        if (!location.hash) return;


        const id =
            decodeURIComponent(
                location.hash.substring(1)
            );


        const index =
            cards.findIndex(
                card => {

                    const heading =
                        card.querySelector("h2, h3, h4, h5, h6");

                    return (
                        heading &&
                        heading.id === id
                    );

                }
            );


        if (index !== -1) {

            currentIndex = index;

        }

    }


    loadHash();

    buildOverview();

    showCard(
        currentIndex,
        "next"
    );
    captureCardPrintLayout();

}


/*
 * 普通页面加载
 */

document.addEventListener(
    "DOMContentLoaded",
    initCards
);


/*
 * MkDocs Material instant navigation
 */

if (
    typeof document$ !== "undefined"
) {

    document$.subscribe(
        () => {

            initCards();

        }
    );

}

// Print only a clean copy of the deck, excluding navigation and empty draft cards.
window.addEventListener("beforeprint", () => {
    const deck = document.querySelector(".card-deck");
    if (!deck) return;
    document.getElementById("cards-print-root")?.remove();
    numberCardHeadings(deck.closest(".md-typeset") || deck);
    const root = document.createElement("section");
    root.id = "cards-print-root";
    root.className = "md-typeset";
    const layout = cardPrintLayout || { width: 920, rootFont: "20px", font: "14px", padding: "40px 48px 50px" };
    const printStyle = document.createElement("style");
    printStyle.id = "cards-print-layout";
    printStyle.textContent = `
        @page cards { size: ${layout.width}px ${layout.width * 9 / 16}px; margin: 0; }
        @media print {
            html:has(#cards-print-root) { font-size: ${layout.rootFont} !important; }
            #cards-print-root { font-size: ${layout.font}; }
            #cards-print-root .study-card { padding: ${layout.padding}; min-height: ${layout.width * 9 / 16}px; }
        }`;
    document.getElementById("cards-print-layout")?.remove();
    document.head.append(printStyle);
    const copy = deck.cloneNode(true);
    copy.querySelectorAll(".study-card").forEach(card => {
        if (!card.textContent.trim() && !card.querySelector("img, svg, canvas, video, iframe")) card.remove();
    });
    root.append(copy);
    document.body.append(root);
});
window.addEventListener("afterprint", () => {
    document.getElementById("cards-print-layout")?.remove();
    document.getElementById("cards-print-root")?.remove();
});
