import "../styles/style.scss";
import { Ticker } from "./Ticker";

let ticker;

ticker = new Ticker();
ticker.add(() => {
    console.log('tick')
})

