import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import Lenis from 'lenis';

export const ScrollStackItem = ({ children, itemClassName = '', style }) => (
  <div
    className={`scroll-stack-card relative w-full h-auto min-h-75 my-6 p-0 rounded-4xl shadow-xl overflow-hidden box-border origin-top ${itemClassName}`.trim()}
    style={style}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 45,
  stackPosition = '8%',
  scaleEndPosition = '4%',
  baseScale = 0.35,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const cardOffsetsRef = useRef([]);
  const isUpdatingRef = useRef(false);
  const tickingRef = useRef(false);

  const stackPositionPx = useMemo(() => {
    if (typeof stackPosition === 'string' && stackPosition.includes('%')) {
      return parseFloat(stackPosition) / 100;
    }
    return parseFloat(stackPosition);
  }, [stackPosition]);

  const scaleEndPositionPx = useMemo(() => {
    if (typeof scaleEndPosition === 'string' && scaleEndPosition.includes('%')) {
      return parseFloat(scaleEndPosition) / 100;
    }
    return parseFloat(scaleEndPosition);
  }, [scaleEndPosition]);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller?.scrollTop || 0,
        containerHeight: scroller?.clientHeight || 0
      };
    }
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) {
      tickingRef.current = false;
      return;
    }

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPosPx = stackPositionPx * containerHeight;
    const scaleEndPosPx = scaleEndPositionPx * containerHeight;

    const lastCardIndex = cardsRef.current.length - 1;
    const endElementOffset = cardOffsetsRef.current[lastCardIndex] || 0;

    // Adding the itemDistance ensures the 'pinEnd' doesn't happen 
    // until the last card has actually traveled its full distance.
    const pinEnd = endElementOffset - containerHeight / 2 + itemDistance;

    const cardCount = cardsRef.current.length;

    for (let i = 0; i < cardCount; i++) {
      const card = cardsRef.current[i];
      if (!card) continue;

      const cardTop = cardOffsetsRef.current[i];
      const stackOffset = itemStackDistance * i;
      const triggerStart = cardTop - stackPosPx - stackOffset;
      const triggerEnd = cardTop - scaleEndPosPx;
      const pinStart = triggerStart;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount && i > 0) {
        let topCardIndex = 0;
        for (let j = 0; j < cardCount; j++) {
          const jTriggerStart = cardOffsetsRef.current[j] - stackPosPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          blur = (topCardIndex - i) * blurAmount;
        }
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPosPx + stackOffset;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPosPx + stackOffset;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 10000) / 10000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 10) / 10
      };

      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.8 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.0001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})${newTransform.rotation !== 0 ? ` rotate(${newTransform.rotation}deg)` : ''
          }`;

        card.style.transform = transform;

        if (newTransform.blur > 0) {
          card.style.filter = `blur(${newTransform.blur}px)`;
        } else if (lastTransform?.blur > 0) {
          card.style.filter = '';
        }

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardCount - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    }

    isUpdatingRef.current = false;
    tickingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPositionPx,
    scaleEndPositionPx,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    getScrollData
  ]);

  const requestTick = useCallback(() => {
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(updateCardTransforms);
    }
  }, [updateCardTransforms]);

  const handleScroll = useCallback(() => {
    requestTick();
  }, [requestTick]);

  const cacheCardOffsets = useCallback(() => {
    const offsets = [];
    cardsRef.current.forEach((card) => {
      if (useWindowScroll) {
        const rect = card.getBoundingClientRect();
        offsets.push(rect.top + window.scrollY);
      } else {
        offsets.push(card.offsetTop);
      }
    });
    cardOffsetsRef.current = offsets;
  }, [useWindowScroll]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };

      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const content = scroller.querySelector('.scroll-stack-inner');
      if (!content) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: content,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };

      animationFrameRef.current = requestAnimationFrame(raf);
      lenisRef.current = lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translate3d(0, 0, 0)';
      card.style.WebkitFontSmoothing = 'antialiased';
    });

    cacheCardOffsets();
    setupLenis();
    updateCardTransforms();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cacheCardOffsets();
        updateCardTransforms();
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();

      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
      tickingRef.current = false;
    };
  }, [
    itemDistance,
    useWindowScroll,
    setupLenis,
    updateCardTransforms,
    cacheCardOffsets
  ]);

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div
      className={containerClassName}
      ref={scrollerRef}
      style={{
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        ...(useWindowScroll ? {} : { scrollBehavior: 'auto' })
      }}
    >

      <div className="scroll-stack-inner pt-[5vh] px-6 pb-24">
        {children}
        <div className="scroll-stack-end w-full h-[35vh]" />
      </div>
    </div>
  );
};

export default ScrollStack;