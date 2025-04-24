import { useState, useEffect, useCallback } from 'react'
import words from './public/words.json'

type Word = {
    en: string
    zh: string
}

function App() {
    const [shuffledWords, setShuffledWords] = useState<Word[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [autoPlay, setAutoPlay] = useState(false)
    const [interval, setInterval] = useState(5)
    const [showMeaning, setShowMeaning] = useState(true)
    const [showSettings, setShowSettings] = useState(false)

    const formatRemainingTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes}分钟`
        }
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60
        return `${hours} 小时 ${remainingMinutes} 分钟`
    }

    useEffect(() => {
        // 打乱单词顺序
        const shuffled = [...words].sort(() => Math.random() - 0.5)
        setShuffledWords(shuffled)
    }, [])

    const handlePrev = useCallback(() => {
        setCurrentIndex(
            prev => (prev - 1 + shuffledWords.length) % shuffledWords.length
        )
    }, [shuffledWords.length])

    const handleNext = useCallback(() => {
        setCurrentIndex(prev => (prev + 1) % shuffledWords.length)
    }, [shuffledWords.length])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                handlePrev()
            } else if (e.key === 'ArrowRight') {
                handleNext()
            } else if (e.key === ' ') {
                e.preventDefault() // 防止空格键滚动页面
                setAutoPlay(prev => !prev)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handlePrev, handleNext])

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

    const toggleAutoPlay = useCallback(() => {
        setAutoPlay(prev => !prev)
    }, [])

    const toggleSettings = () => {
        setShowSettings(prev => !prev)
    }

    if (shuffledWords.length === 0) {
        return <div>Loading...</div>
    }

    const currentWord = shuffledWords[currentIndex]

    return (
        <div className='bg-white p-8 rounded-xl shadow-md min-w-[400px] max-w-[800px] w-full box-border relative'>
            <div className='absolute top-2 right-2'>
                <button
                    onClick={toggleSettings}
                    className='bg-transparent text-gray-600 hover:text-gray-800 hover:scale-110 transition-all cursor-pointer'
                >
                    <span className='material-icons'>settings</span>
                </button>
                {showSettings && (
                    <div className='absolute top-full right-0 bg-white rounded-lg shadow-md p-4 min-w-[200px] z-50'>
                        <div className='mb-4'>
                            <label className='flex items-center gap-2 text-sm text-gray-700'>
                                自动播放间隔（秒）:
                                <input
                                    type='number'
                                    value={interval}
                                    onChange={e =>
                                        setInterval(Number(e.target.value))
                                    }
                                    min='1'
                                    className='w-16 p-1 border border-gray-300 rounded text-sm'
                                />
                            </label>
                        </div>
                        <div>
                            <label className='flex items-center gap-2 text-sm text-gray-700'>
                                <input
                                    type='checkbox'
                                    checked={showMeaning}
                                    onChange={e =>
                                        setShowMeaning(e.target.checked)
                                    }
                                    className='w-4 h-4'
                                />
                                显示释义
                            </label>
                        </div>
                    </div>
                )}
            </div>

            <div className='text-4xl font-bold text-center mb-4 break-words px-4 mt-4 flex items-center justify-center'>
                {currentWord.en}
            </div>
            {showMeaning && (
                <div className='text-xl text-gray-600 text-center mb-8 break-words px-4 flex items-center justify-center'>
                    {currentWord.zh}
                </div>
            )}

            <div className='flex gap-4 justify-center mb-4 flex-wrap'>
                <button
                    onClick={handlePrev}
                    className='p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer'
                >
                    <span className='material-icons'>chevron_left</span>
                </button>
                <button
                    onClick={toggleAutoPlay}
                    className='p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer'
                >
                    <span className='material-icons'>
                        {autoPlay ? 'pause' : 'play_arrow'}
                    </span>
                </button>
                <button
                    onClick={handleNext}
                    className='p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 transition-all flex items-center justify-center w-12 h-12 cursor-pointer'
                >
                    <span className='material-icons'>chevron_right</span>
                </button>
            </div>
            <div className='flex justify-between items-center mb-2 text-sm text-gray-600'>
                <span>
                    {Math.round(
                        ((currentIndex + 1) / shuffledWords.length) * 100
                    )}
                    %
                </span>
                {autoPlay && (
                    <span className='text-gray-600'>
                        预计:{' '}
                        {formatRemainingTime(
                            Math.ceil(
                                ((shuffledWords.length - currentIndex - 1) *
                                    interval) /
                                    60
                            )
                        )}
                    </span>
                )}
                <span>
                    {currentIndex + 1}/{shuffledWords.length}
                </span>
            </div>
            <div className='w-full h-2 bg-gray-200 rounded-full overflow-hidden'>
                <div
                    className='h-full bg-blue-600 transition-all duration-300'
                    style={{
                        width: `${
                            ((currentIndex + 1) / shuffledWords.length) * 100
                        }%`,
                    }}
                />
            </div>
        </div>
    )
}

export default App
