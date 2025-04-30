"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface SwipeableOptions {
  onSwipedLeft?: () => void
  onSwipedRight?: () => void
  onSwipedUp?: () => void
  onSwipedDown?: () => void
  preventDefaultTouchmoveEvent?: boolean
  trackMouse?: boolean
  swipeThreshold?: number
}

interface SwipeableHandlers {
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: (e: React.TouchEvent) => void
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseUp?: (e: React.MouseEvent) => void
}

export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  preventDefaultTouchmoveEvent = false,
  trackMouse = false,
  swipeThreshold = 50,
}: SwipeableOptions): SwipeableHandlers {
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchEndX, setTouchEndX] = useState(0)
  const [touchEndY, setTouchEndY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const isMouseDown = useRef(false)

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
    setIsSwiping(true)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (preventDefaultTouchmoveEvent) e.preventDefault()
    if (!isSwiping) return

    setTouchEndX(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!isSwiping) return

    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          onSwipedRight?.()
        } else {
          onSwipedLeft?.()
        }
      }
    } else {
      if (Math.abs(deltaY) > swipeThreshold) {
        if (deltaY > 0) {
          onSwipedDown?.()
        } else {
          onSwipedUp?.()
        }
      }
    }

    setIsSwiping(false)
  }

  const onMouseDown = trackMouse
    ? (e: React.MouseEvent) => {
        isMouseDown.current = true
        setTouchStartX(e.clientX)
        setTouchStartY(e.clientY)
        setIsSwiping(true)
      }
    : undefined

  const onMouseMove = trackMouse
    ? (e: React.MouseEvent) => {
        if (!isMouseDown.current) return

        setTouchEndX(e.clientX)
        setTouchEndY(e.clientY)
      }
    : undefined

  const onMouseUp = trackMouse
    ? () => {
        isMouseDown.current = false
        onTouchEnd()
      }
    : undefined

  // Clean up mouse events
  useEffect(() => {
    if (trackMouse) {
      const handleMouseUp = () => {
        isMouseDown.current = false
        setIsSwiping(false)
      }

      window.addEventListener("mouseup", handleMouseUp)

      return () => {
        window.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [trackMouse])

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }
}
