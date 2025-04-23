import { useState, useEffect } from 'react'
import words from '../words.json'

type Word = {
    en: string
    zh: string
}

function App() {
    const [shuffledWords, setShuffledWords] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(false)
    const [interval, setInterval] = useState(3)
    const [showMeaning, setShowMeaning] = useState(true)
    const [showSettings, setShowSettings] = useState(false)

    useEffect(() => {
        // 打乱单词顺序
        const shuffled = [...words].sort(() => Math.random() - 0.5)
        setShuffledWords(shuffled)
    }, [])

    useEffect(() => {
        let timer: number | undefined

        if (autoPlay) {
            timer = window.setInterval(() => {
                setCurrentIndex(prev => (prev + 1) % shuffledWords.length)
            }, interval * 1000)
        }

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [autoPlay, interval, shuffledWords.length])

    const handlePrev = () => {
        setCurrentIndex(
            prev => (prev - 1 + shuffledWords.length) % shuffledWords.length
        )
    }

    const handleNext = () => {
        setCurrentIndex(prev => (prev + 1) % shuffledWords.length)
    }

    const toggleAutoPlay = () => {
        setAutoPlay(prev => !prev)
    }

    const toggleSettings = () => {
        setShowSettings(prev => !prev)
    }

    if (shuffledWords.length === 0) {
        return <div>Loading...</div>
    }

    const currentWord = shuffledWords[currentIndex]

    return (
        <div className='app'>
            <div className='settings-button'>
                <button onClick={toggleSettings} className='icon-button'>
                    <span className='material-icons'>settings</span>
                </button>
                {showSettings && (
                    <div className='settings-dropdown'>
                        <div className='settings-item'>
                            <label>自动播放间隔（秒）:</label>
                            <input
                                type='number'
                                value={interval}
                                onChange={e =>
                                    setInterval(Number(e.target.value))
                                }
                                min='1'
                            />
                        </div>
                        <div className='settings-item'>
                            <label>
                                <input
                                    type='checkbox'
                                    checked={showMeaning}
                                    onChange={e =>
                                        setShowMeaning(e.target.checked)
                                    }
                                />
                                显示释义
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className='word'>{currentWord.en}</div>
            {showMeaning && <div className='meaning'>{currentWord.zh}</div>}

            <div className='controls'>
                <button onClick={handlePrev} className='icon-button'>
                    <span className='material-icons'>chevron_left</span>
                </button>
                <button
                    onClick={toggleAutoPlay}
                    className='icon-button play-button'
                >
                    <span className='material-icons'>
                        {autoPlay ? 'pause' : 'play_arrow'}
                    </span>
                </button>
                <button onClick={handleNext} className='icon-button'>
                    <span className='material-icons'>chevron_right</span>
                </button>
            </div>
        </div>
    )
}

export default App
