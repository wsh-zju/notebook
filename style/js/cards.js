function initCards() {

    const cards = Array.from(
        document.querySelectorAll(".study-card")
    );

    if (!cards.length) return;


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

        counter.textContent =
            `${currentIndex + 1} / ${cards.length}`;


        /*
         * 进度条
         */

        const progress =
            ((currentIndex + 1) / cards.length)
            * 100;

        progressBar.style.width =
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
            card.querySelector("h2");

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
                tag === "TEXTAREA"
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

        }
    );


    /* ==============================
       缩略图
       ============================== */

    function buildOverview() {

        overviewList.innerHTML = "";


        cards.forEach(
            (card, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "overview-item";


                const title =
                    card.dataset.title ||
                    `卡片 ${index + 1}`;


                item.innerHTML = `

                    <span class="overview-number">
                        ${String(index + 1)
                            .padStart(2, "0")}
                    </span>

                    <strong>
                        ${title}
                    </strong>

                `;


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
            card.querySelector("h2");

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
                                    card.querySelector("h2");

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
                        card.querySelector("h2");

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