'use client'
import cn from 'clsx'
import gsap from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import s from './cursor.module.css'

const Cursor = () => {
    const cursor = useRef<HTMLDivElement>(null)
    const [isGrab, setIsGrab] = useState(false)
    const [isPointer, setIsPointer] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)
    const [hasMouseDevice, setHasMouseDevice] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const pathname = usePathname()

    // Ensure component only renders on client
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Detect if device has a mouse
    useEffect(() => {
        if (!isMounted) return

        // Check if device supports fine pointer (mouse)
        const hasFinePointer = window.matchMedia('(pointer: fine)').matches

        // Also check if it's not a touch-only device
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0

        // Enable cursor only if device has fine pointer and is not exclusively touch
        setHasMouseDevice(hasFinePointer && !isTouchDevice)
    }, [isMounted])

    const onMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!cursor.current || !hasMouseDevice) return
            gsap.to(cursor.current, {
                x: e.clientX,
                y: e.clientY,
                duration: hasMoved ? 0.6 : 0,
                ease: 'expo.out',
            })
            setHasMoved(true)
        },
        [hasMoved, hasMouseDevice]
    )

    useEffect(() => {
        if (!hasMouseDevice) return

        window.addEventListener('mousemove', onMouseMove, false)

        return () => {
            window.removeEventListener('mousemove', onMouseMove, false)
        }
    }, [onMouseMove, hasMouseDevice])

    useEffect(() => {
        if (!hasMouseDevice) return

        document.documentElement.classList.add('has-custom-cursor')

        return () => {
            document.documentElement.classList.remove('has-custom-cursor')
        }
    }, [hasMouseDevice])

    // Reset cursor state on page change
    useEffect(() => {
        setIsPointer(false)
        setIsGrab(false)
    }, [pathname])

    useEffect(() => {
        if (!hasMouseDevice) return

        let elements: Element[] = []
        let debounceTimer: NodeJS.Timeout

        const onMouseEnter = () => {
            setIsPointer(true)
        }
        const onMouseLeave = () => {
            setIsPointer(false)
        }

        const attachListeners = () => {
            try {
                // Remove old listeners
                elements.forEach((element) => {
                    if (element && element.removeEventListener) {
                        element.removeEventListener('mouseenter', onMouseEnter, false)
                        element.removeEventListener('mouseleave', onMouseLeave, false)
                    }
                })

                // Query new elements
                elements = [
                    ...Array.from(document.querySelectorAll(
                        "button,a,input,label,[data-cursor='pointer']"
                    )),
                ]

                // Attach new listeners
                elements.forEach((element) => {
                    if (element && element.addEventListener) {
                        element.addEventListener('mouseenter', onMouseEnter, false)
                        element.addEventListener('mouseleave', onMouseLeave, false)
                    }
                })
            } catch (error) {
                console.warn('Error attaching cursor listeners:', error)
            }
        }

        // Debounced version for MutationObserver
        const debouncedAttachListeners = () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(attachListeners, 150)
        }

        // Initial attachment with delay to ensure DOM is ready
        const timeoutId = setTimeout(attachListeners, 100)

        // Watch for DOM changes
        const observer = new MutationObserver(debouncedAttachListeners)

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        return () => {
            clearTimeout(timeoutId)
            clearTimeout(debounceTimer)
            observer.disconnect()
            elements.forEach((element) => {
                if (element && element.removeEventListener) {
                    element.removeEventListener('mouseenter', onMouseEnter, false)
                    element.removeEventListener('mouseleave', onMouseLeave, false)
                }
            })
        }
    }, [pathname, hasMouseDevice])

    useEffect(() => {
        if (!hasMouseDevice) return

        let elements: Element[] = []
        let debounceTimer: NodeJS.Timeout

        const onMouseEnter = () => {
            setIsGrab(true)
        }
        const onMouseLeave = () => {
            setIsGrab(false)
        }

        const attachListeners = () => {
            try {
                // Remove old listeners
                elements.forEach((element) => {
                    if (element && element.removeEventListener) {
                        element.removeEventListener('mouseenter', onMouseEnter, false)
                        element.removeEventListener('mouseleave', onMouseLeave, false)
                    }
                })

                // Query new elements
                elements = [
                    ...Array.from(document.querySelectorAll(
                        "[data-cursor='grab']"
                    )),
                ]

                // Attach new listeners
                elements.forEach((element) => {
                    if (element && element.addEventListener) {
                        element.addEventListener('mouseenter', onMouseEnter, false)
                        element.addEventListener('mouseleave', onMouseLeave, false)
                    }
                })
            } catch (error) {
                console.warn('Error attaching grab cursor listeners:', error)
            }
        }

        // Debounced version for MutationObserver
        const debouncedAttachListeners = () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(attachListeners, 150)
        }

        // Initial attachment with delay to ensure DOM is ready
        const timeoutId = setTimeout(attachListeners, 100)

        // Watch for DOM changes
        const observer = new MutationObserver(debouncedAttachListeners)

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        })

        return () => {
            clearTimeout(timeoutId)
            clearTimeout(debounceTimer)
            observer.disconnect()
            elements.forEach((element) => {
                if (element && element.removeEventListener) {
                    element.removeEventListener('mouseenter', onMouseEnter, false)
                    element.removeEventListener('mouseleave', onMouseLeave, false)
                }
            })
        }
    }, [pathname, hasMouseDevice])

    // Don't render cursor on touch devices or before mount
    if (!isMounted || !hasMouseDevice) {
        return null
    }

    return (
        <div style={{ opacity: hasMoved ? 1 : 0 }} className={s.container}>
            <div ref={cursor} className={cn(s.cursor, isGrab && s.grab, isPointer && s.pointer)} />
        </div>
    )
}

export { Cursor }