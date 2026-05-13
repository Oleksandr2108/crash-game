import betUrl from "../../assets/sounds/Bet.mp3";
import cashoutUrl from "../../assets/sounds/cashout.mp3";
import chartUrl from "../../assets/sounds/chart.mp3";
import crashUrl from "../../assets/sounds/crash.mp3";

const betAudio = new Audio(betUrl);
const cashoutAudio = new Audio(cashoutUrl);
const chartAudio = new Audio(chartUrl);
const crashAudio = new Audio(crashUrl);
let muted = false;

betAudio.volume = 0.65;
cashoutAudio.volume = 0.75;
chartAudio.volume = 0.35;
crashAudio.volume = 0.85;
chartAudio.loop = true;

const safePlay = (audio: HTMLAudioElement, reset = true) => {
  if (muted) return;
  if (reset) audio.currentTime = 0;
  void audio.play().catch(() => {
    // Ignore autoplay restrictions until user interacts with the page.
  });
};

export const isSoundMuted = () => muted;

export const setSoundMuted = (value: boolean) => {
  muted = value;
  if (muted) {
    stopChartLoop();
  }
};

export const playBetSound = () => {
  safePlay(betAudio);
};

export const playCashoutSound = () => {
  safePlay(cashoutAudio);
};

export const playCrashSound = () => {
  safePlay(crashAudio);
};

export const playChartLoop = () => {
  if (muted) return;
  if (!chartAudio.paused) return;
  safePlay(chartAudio, true);
};

export const stopChartLoop = () => {
  chartAudio.pause();
  chartAudio.currentTime = 0;
};
