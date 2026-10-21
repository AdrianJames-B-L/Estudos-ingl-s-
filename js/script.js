"use strict";
(function () {
    var rows = Array.prototype.slice.call(document.querySelectorAll(".row"));
    var allBtns = Array.prototype.slice.call(document.querySelectorAll(".all"));
    var audio = null,
        cur = -1,
        queue = null,
        token = 0,
        rate = 1,
        activeSec = -1;

    function setAllState() {
        allBtns.forEach(function (b) {
            var on = queue !== null && Number(b.dataset.sec) === activeSec;
            b.setAttribute("aria-pressed", on ? "true" : "false");
            b.textContent = on ? "Parar" : "Ouvir tudo";
        });
    }
    function clear() {
        if (audio) {
            audio.onended = null;
            audio.pause();
            audio = null;
        }
        if (cur >= 0) {
            rows[cur].classList.remove("playing");
            rows[cur].setAttribute("aria-pressed", "false");
        }
        cur = -1;
    }
    function stopAll() {
        token++;
        queue = null;
        clear();
        setAllState();
    }

    function play(i) {
        clear();
        cur = i;
        var r = rows[i];
        r.classList.add("playing");
        r.setAttribute("aria-pressed", "true");
        if (queue !== null && r.scrollIntoView) {
            r.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
        var a = new Audio(r.dataset.audio);
        a.playbackRate = rate;
        audio = a;
        var mine = token;
        a.onended = function () {
            r.classList.add("revealed");
            clear();
            if (queue && queue.length) {
                var next = queue.shift();
                setTimeout(function () {
                    if (mine === token) {
                        play(next);
                    }
                }, 600);
            } else {
                queue = null;
                setAllState();
            }
        };
        a.play().catch(function () {
            stopAll();
        });
    }

    rows.forEach(function (r) {
        r.addEventListener("click", function () {
            var i = Number(r.dataset.i);
            if (cur === i) {
                stopAll();
                return;
            }
            token++;
            queue = null;
            setAllState();
            play(i);
        });
    });

    allBtns.forEach(function (b) {
        b.addEventListener("click", function () {
            var s = Number(b.dataset.sec);
            if (queue !== null && activeSec === s) {
                stopAll();
                return;
            }
            var idx = rows
                .filter(function (r) {
                    return Number(r.dataset.sec) === s;
                })
                .map(function (r) {
                    return Number(r.dataset.i);
                });
            token++;
            activeSec = s;
            queue = idx.slice(1);
            setAllState();
            play(idx[0]);
        });
    });

    var hideBtn = document.getElementById("hide-pt");
    hideBtn.addEventListener("click", function () {
        var on = hideBtn.getAttribute("aria-pressed") !== "true";
        hideBtn.setAttribute("aria-pressed", on ? "true" : "false");
        document.body.classList.toggle("hide-pt", on);
        rows.forEach(function (r) {
            r.classList.remove("revealed");
        });
    });

    var rateBtns = Array.prototype.slice.call(
        document.querySelectorAll("[data-rate]")
    );
    rateBtns.forEach(function (b) {
        b.addEventListener("click", function () {
            rate = Number(b.dataset.rate);
            rateBtns.forEach(function (x) {
                x.setAttribute("aria-pressed", x === b ? "true" : "false");
            });
            if (audio) {
                audio.playbackRate = rate;
            }
        });
    });
})();
