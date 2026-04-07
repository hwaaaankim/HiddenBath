let wrap01 = document.querySelector(".wrap01");
let wrap02 = document.querySelector(".wrap02");
let wrap03 = document.querySelector(".wrap03");
let wrap04 = document.querySelector(".wrap04");
let target01 = document.querySelector(".target01");
let target02 = document.querySelector(".target02");
let target03 = document.querySelector(".target03");
let target04 = document.querySelector(".target04");

let currentVisibleWrap = null;

window.onscroll = function(e) {
    let tCon = document.getElementById("target-container");
    let height = tCon.getBoundingClientRect().y;
    let tl = gsap.timeline();

    if (height > 420 && currentVisibleWrap !== "none") {
        currentVisibleWrap = "none";
        tl.to(".wrap01", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 0 });
            }
        });
        tl.to(".wrap02", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 0 });
            }
        });
    } else if (height < 420 && height > -343 && currentVisibleWrap !== "wrap01") {
        currentVisibleWrap = "wrap01";
        tl.to(".wrap01", {
            opacity: 1,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 2 });
            }
        });
        tl.to(".wrap02", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 0 });
            }
        });
    } else if (height <= -343 && height > -1343 && currentVisibleWrap !== "wrap02") {
        currentVisibleWrap = "wrap02";
        tl.to(".wrap01", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 0 });
            }
        });
        tl.to(".wrap02", {
            opacity: 1,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 2 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 0 });
            }
        });
    } else if (height <= -1343 && height > -2443 && currentVisibleWrap !== "wrap03") {
        currentVisibleWrap = "wrap03";
        tl.to(".wrap01", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 0 });
            }
        });
        tl.to(".wrap02", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 1,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 2 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 0 });
            }
        });
    } else if (height <= -2443 && height > -3299 && currentVisibleWrap !== "wrap04") {
        currentVisibleWrap = "wrap04";
        tl.to(".wrap01", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 0 });
            }
        });
        tl.to(".wrap02", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 1,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 2 });
            }
        }, "<");
    } else if (height <= -3299 && currentVisibleWrap !== "none") {
        currentVisibleWrap = "none";
        tl.to(".wrap01", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap01", { zIndex: 0 });
            }
        });
        tl.to(".wrap02", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap02", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap03", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap03", { zIndex: 0 });
            }
        }, "<");
        tl.to(".wrap04", {
            opacity: 0,
            duration: 0.5,
            onComplete: function() {
                gsap.set(".wrap04", { zIndex: 0 });
            }
        });
    }
};
