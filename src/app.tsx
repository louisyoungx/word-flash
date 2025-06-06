import { useState, useEffect, useCallback } from "react";
import words from "./public/words.json";
import { fisherYatesShuffle } from "./utils";
import classNames from "classnames";
import { isAppleSystem } from "./constant";
import {
  GraphicEq as GraphicEqIcon,
  VolumeUp as VolumeUpIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Pause as PauseIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

type Word = {
  en: string;
  zh: string;
};

function App() {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem("currentIndex");
    return saved ? Number(saved) : 0;
  });
  const [autoPlay, setAutoPlay] = useState(false);
  const [interval, setInterval] = useState(() => {
    const saved = localStorage.getItem("interval");
    return saved ? Number(saved) : 5;
  });
  const [showMeaning, setShowMeaning] = useState(() => {
    const saved = localStorage.getItem("showMeaning");
    return saved ? saved === "true" : true;
  });
  const [enableClickBlankFlip, setEnableClickBlankFlip] = useState(() => {
    const saved = localStorage.getItem("enableClickBlankFlip");
    return saved ? saved === "true" : true;
  });
  const [enableWheelFlip, setEnableWheelFlip] = useState(() => {
    const saved = localStorage.getItem("enableWheelFlip");
    return saved ? saved === "true" : true;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    const saved = localStorage.getItem("autoSpeak");
    return saved ? saved === "true" : false;
  });
  const [randomSeed, setRandomSeed] = useState<string>(() => {
    const saved = localStorage.getItem("randomSeed");
    return saved ? saved : "word_flash";
  });

  // 重置所有设置
  const resetAllSettings = () => {
    setInterval(5);
    setShowMeaning(true);
    setAutoSpeak(false);
    setRandomSeed("word_flash");
    setCurrentIndex(0);
    localStorage.clear();
    setShowSettings(false);
  };

  // 保存设置到本地存储
  useEffect(() => {
    localStorage.setItem("interval", interval.toString());
  }, [interval]);

  useEffect(() => {
    localStorage.setItem("showMeaning", showMeaning.toString());
  }, [showMeaning]);

  useEffect(() => {
    localStorage.setItem(
      "enableClickBlankFlip",
      enableClickBlankFlip.toString(),
    );
  }, [enableClickBlankFlip]);

  useEffect(() => {
    localStorage.setItem("enableWheelFlip", enableWheelFlip.toString());
  }, [enableWheelFlip]);

  useEffect(() => {
    localStorage.setItem("autoSpeak", autoSpeak.toString());
  }, [autoSpeak]);

  useEffect(() => {
    localStorage.setItem("randomSeed", randomSeed);
  }, [randomSeed]);

  // 当随机种子不为空时，保存当前进度
  useEffect(() => {
    if (randomSeed) {
      localStorage.setItem("currentIndex", currentIndex.toString());
    }
  }, [currentIndex, randomSeed]);

  const generateRandomSeed = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let seed = "";
    for (let i = 0; i < 8; i++) {
      seed += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomSeed(seed);
    setCurrentIndex(0);
  };

  const formatRemainingTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分钟`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} 小时 ${remainingMinutes} 分钟`;
  };

  useEffect(() => {
    // 打乱单词顺序
    const shuffled = fisherYatesShuffle(words, randomSeed);
    setShuffledWords(shuffled);
  }, [randomSeed]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + shuffledWords.length) % shuffledWords.length,
    );
  }, [shuffledWords.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
  }, [shuffledWords.length]);

  const toggleSettings = () => {
    setShowSettings((prev) => !prev);
  };

  const speakWord = useCallback(() => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const wordToSpeak = shuffledWords[currentIndex]?.en;
    if (!wordToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(wordToSpeak);

    // 设置语音参数
    utterance.lang = "en-US"; // 设置为美国英语
    utterance.rate = 1.2; // 加快语速
    utterance.pitch = 1.0; // 正常音调

    // 尝试找到男声
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(
      (voice) =>
        voice.lang === "en-US" && voice.name.toLowerCase().includes("male"),
    );
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [currentIndex, isSpeaking, shuffledWords]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowUp") {
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          return;
        }

        const wordToSpeak = shuffledWords[currentIndex]?.en;
        if (!wordToSpeak) return;

        const utterance = new SpeechSynthesisUtterance(wordToSpeak);

        // 设置语音参数
        utterance.lang = "en-US"; // 设置为美国英语
        utterance.rate = 1.2; // 加快语速
        utterance.pitch = 1.0; // 正常音调

        // 尝试找到男声
        const voices = window.speechSynthesis.getVoices();
        const maleVoice = voices.find(
          (voice) =>
            voice.lang === "en-US" && voice.name.toLowerCase().includes("male"),
        );
        if (maleVoice) {
          utterance.voice = maleVoice;
        }

        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      } else if (e.key === " ") {
        e.preventDefault(); // 防止空格键滚动页面
        setAutoPlay((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePrev, handleNext, currentIndex, isSpeaking, shuffledWords]);

  const handleWheelFlip = useCallback(
    (e: React.WheelEvent) => {
      if (!enableWheelFlip || showSettings) {
        return;
      }
      if (e.deltaX > 0) {
        // 向右横向滚动，触发发音
        if (!isSpeaking) {
          speakWord();
        }
        return;
      }
      // 垂直滚动，切换单词
      if (e.deltaY < 0) {
        if (isAppleSystem) {
          // 苹果系统滚轮反向
          handleNext();
        } else {
          handlePrev();
        }
      } else if (e.deltaY > 0) {
        if (isAppleSystem) {
          handlePrev();
        } else {
          handleNext();
        }
      }
    },
    [
      handleNext,
      handlePrev,
      speakWord,
      isSpeaking,
      showSettings,
      enableWheelFlip,
    ],
  );

  // 处理自动发音
  useEffect(() => {
    if (!autoSpeak) return;
    speakWord();
  }, [currentIndex, autoSpeak]);

  useEffect(() => {
    let timer: number | undefined;

    if (autoPlay) {
      timer = window.setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % shuffledWords.length);
      }, interval * 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoPlay, interval, shuffledWords.length]);

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev);
  }, []);

  if (shuffledWords.length === 0) {
    return <div>Loading...</div>;
  }

  const currentWord = shuffledWords[currentIndex];

  return (
    <>
      <>
        <div
          className={classNames(
            "absolute top-0 left-0 flex w-1/3 h-full items-center justify-center",
            {
              "cursor-pointer": enableClickBlankFlip,
            },
          )}
          onWheel={handleWheelFlip}
          onClick={() => {
            if (showSettings) {
              return setShowSettings(false);
            }
            if (enableClickBlankFlip) {
              handlePrev();
            }
          }}
        />
        <div
          className={classNames(
            "absolute top-0 right-0 flex w-2/3 h-full items-center justify-center",
            {
              "cursor-pointer": enableClickBlankFlip,
            },
          )}
          onWheel={handleWheelFlip}
          onClick={() => {
            if (showSettings) {
              return setShowSettings(false);
            }
            if (enableClickBlankFlip) {
              handleNext();
            }
          }}
        />
      </>
      <div
        className="absolute top-1/2 left-1/2 -translate-1/2 bg-white p-8 rounded-xl shadow-md min-w-[400px] max-w-[800px] box-border cursor-default"
        onWheel={handleWheelFlip}
      >
        <div className="absolute top-2 left-2">
          <button
            onClick={toggleSettings}
            className="bg-transparent text-gray-400 hover:text-gray-800 hover:scale-110 transition-all cursor-pointer"
          >
            <SettingsIcon />
          </button>
          {showSettings && (
            <>
              <div className="fixed inset-0 z-40" onClick={toggleSettings} />
              <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-[320px] z-50 border border-gray-100 animate-fade-in">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">
                      自动播放间隔（秒）
                    </label>
                    <input
                      type="number"
                      value={interval}
                      onChange={(e) => setInterval(Number(e.target.value))}
                      min="1"
                      max="60"
                      className="w-20 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">
                      显示中文释义
                    </label>
                    <button
                      onClick={() => setShowMeaning((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        showMeaning ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          showMeaning ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">
                      点击空白区域翻页
                    </label>
                    <button
                      onClick={() => setEnableClickBlankFlip((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        enableClickBlankFlip ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enableClickBlankFlip
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">滚轮翻页</label>
                    <button
                      onClick={() => setEnableWheelFlip((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        enableWheelFlip ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          enableWheelFlip ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">自动发音</label>
                    <button
                      onClick={() => setAutoSpeak((prev) => !prev)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        autoSpeak ? "bg-blue-500" : "bg-gray-200"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autoSpeak ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-700">随机种子</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={randomSeed}
                        onChange={(e) => setRandomSeed(e.target.value)}
                        placeholder="输入种子"
                        className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={generateRandomSeed}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                        title="生成随机种子"
                      >
                        <RefreshIcon />
                      </button>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <button
                      onClick={resetAllSettings}
                      className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <DeleteIcon />
                      重置全部设置
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="text-4xl font-bold text-center mb-4 break-words px-4 mt-4 relative">
          <div className="flex items-center justify-center">
            <span>{currentWord.en}</span>
          </div>
          <button
            onClick={speakWord}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:scale-110 transition-all flex items-center justify-center w-10 h-10 cursor-pointer"
          >
            {isSpeaking ? <GraphicEqIcon /> : <VolumeUpIcon />}
          </button>
        </div>
        {showMeaning && (
          <div className="text-xl text-gray-600 text-center mb-8 break-words px-4 flex items-center justify-center">
            {currentWord.zh}
          </div>
        )}

        <div className="flex gap-4 justify-center mb-4 flex-wrap">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={toggleAutoPlay}
            className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer"
          >
            {autoPlay ? <PauseIcon /> : <PlayArrowIcon />}
          </button>
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer"
          >
            <ChevronRightIcon />
          </button>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
          <span>
            {Math.round(((currentIndex + 1) / shuffledWords.length) * 100)}%
          </span>
          {autoPlay && (
            <span className="text-gray-600">
              预计:{" "}
              {formatRemainingTime(
                Math.ceil(
                  ((shuffledWords.length - currentIndex - 1) * interval) / 60,
                ),
              )}
            </span>
          )}
          <span>
            {currentIndex + 1}/{shuffledWords.length}
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / shuffledWords.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}

export default App;
