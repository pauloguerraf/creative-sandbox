import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
export default class JPEGScrubber {
  constructor() {
    console.log('building')
    gsap.registerPlugin(ScrollTrigger)
    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const frameCount = 204;
    const currentFrame = index => (
      // `http://fernandazanchetta.com/wind/wind_${(index + 1).toString().padStart(5, '0')}.jpg`
      `img/wind/wind_${(index + 1).toString().padStart(5, '0')}.jpg`
    );

    const images = []
    const airpods = {
      frame: 0
    };

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      images.push(img);
    }

    gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      scrollTrigger: {
        scrub: 0.5
      },
      onUpdate:()=>{ render() } // use animation onUpdate instead of scrollTrigger's onUpdate
    });

    window.addEventListener('resize', resize)

    images[0].onload = render;



    function render() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(images[airpods.frame], 0, 0, canvas.width, canvas.height); 
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    }
  }
  
}

new JPEGScrubber();
