import './style.scss'

import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true
});

const elContainer = document.querySelector("[data-scroll-container]") as HTMLElement

gsap.registerPlugin(ScrollTrigger);
locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.scrollerProxy("[data-scroll-container]", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  pinType: elContainer.style.transform ? "transform" : "fixed"
});

const video = document.querySelector(".video-background") as HTMLVideoElement
let src = video.currentSrc || video.src;

let tl = gsap.timeline({
  defaults: { duration: 1 },
  scrollTrigger: {
    trigger: "#container",
    scroller: "[data-scroll-container]",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    markers: true,
  }
});
video.onloadedmetadata = () => {
  console.log('loaded')
  tl.fromTo(
    video,
    {
      currentTime: 0
    },
    {
      currentTime: video.duration || 1
    }
  );
};


ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

video.load();
video.currentTime += 0.01;
