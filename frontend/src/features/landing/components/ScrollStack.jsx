import { useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import Lenis from 'lenis';

export const ScrollStackItem = ({ children, itemClassName = '', style }) => (
  <div
    className={`scroll-stack-card relative w-full my-6 p-0 rounded-[2.5rem] shadow-xl overflow-hidden box-border origin-top ${itemClassName}`.trim()}
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
  const isInitializedRef = useRef(false);

  const viewportHeightRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 0);
  const windowWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Detect mobile for adjusted stack behavior
  const isMobile = useCallback(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }, []);

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
        containerHeight: viewportHeightRef.current || window.innerHeight
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller?.scrollTop || 0,
        containerHeight: viewportHeightRef.current || scroller?.clientHeight || 0
      };
    }
  }, [useWindowScroll]);

  const cacheCardOffsets = useCallback(() => {
    if (!cardsRef.current.length) return;

    const scroller = scrollerRef.current;
    if (scroller) {
      void scroller.offsetHeight;
      void scroller.scrollTop;
    }

    if (useWindowScroll) {
      void document.body.offsetHeight;
      void window.scrollY;
    }

    // Only update viewport height on width changes to prevent mobile address bar glitch
    if (typeof window !== 'undefined' && window.innerWidth !== windowWidthRef.current) {
      viewportHeightRef.current = useWindowScroll ? window.innerHeight : scroller?.clientHeight || 0;
    } else if (viewportHeightRef.current === 0) {
      viewportHeightRef.current = useWindowScroll ? window.innerHeight : scroller?.clientHeight || 0;
    }

    const originalTransforms = [];
    cardsRef.current.forEach((card) => {
      originalTransforms.push(card.style.transform);
      card.style.transform = 'none';
    });

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

    cardsRef.current.forEach((card, i) => {
      card.style.transform = originalTransforms[i];
    });
  }, [useWindowScroll]);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current || !isInitializedRef.current) {
      tickingRef.current = false;
      return;
    }

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    
    // On mobile use a larger stackPosition so cards pin lower (below any sticky nav)
    const mobileStackOffset = isMobile() ? 0.22 : 0;
    const effectiveStackPosPx = (stackPositionPx + mobileStackOffset) * containerHeight;
    const scaleEndPosPx = scaleEndPositionPx * containerHeight;
    const cardCount = cardsRef.current.length;

    // On mobile reduce itemStackDistance so stacked cards don't overlap too much
    const effectiveStackDistance = isMobile()
      ? Math.min(itemStackDistance, 22)
      : itemStackDistance;

    const lastCardIndex = cardCount - 1;
    const lastCardTop = cardOffsetsRef.current[lastCardIndex] || 0;
    const lastStackOffset = effectiveStackDistance * lastCardIndex;
    const lastCardPinStart = lastCardTop - effectiveStackPosPx - lastStackOffset;
    const pinEnd = lastCardPinStart + itemDistance;

    for (let i = 0; i < cardCount; i++) {
      const card = cardsRef.current[i];
      if (!card) continue;

      const cardTop = cardOffsetsRef.current[i];
      const stackOffset = effectiveStackDistance * i;
      const triggerStart = cardTop - effectiveStackPosPx - stackOffset;
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
          const jStackOffset = effectiveStackDistance * j;
          const jTriggerStart = cardOffsetsRef.current[j] - effectiveStackPosPx - jStackOffset;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }
        if (i < topCardIndex) {
          blur = (topCardIndex - i) * blurAmount;
        }
      }

      let translateY = 0;

      if (scrollTop < pinStart) {
        translateY = 0;
      } else if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + effectiveStackPosPx + stackOffset;
      } else {
        translateY = pinEnd - cardTop + effectiveStackPosPx + stackOffset;
      }

      const newTransform = {
        translateY,
        scale,
        rotation,
        blur
      };

      const lastTransform = lastTransformsRef.current.get(i);

      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.05 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.01 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.01;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY.toFixed(3)}px, 0) scale(${newTransform.scale.toFixed(4)})${newTransform.rotation !== 0 ? ` rotate(${newTransform.rotation.toFixed(2)}deg)` : ''}`;
        card.style.transform = transform;

        if (newTransform.blur > 0) {
          card.style.filter = `blur(${newTransform.blur.toFixed(1)}px)`;
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
    itemScale, itemStackDistance, stackPositionPx, scaleEndPositionPx,
    baseScale, rotationAmount, blurAmount, itemDistance,
    onStackComplete, calculateProgress, getScrollData, isMobile
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

  const setupLenis = useCallback(() => {
    const lenisConfig = {
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      lerp: 0.1,
      // On mobile, don't override native touch scroll — it fights iOS momentum
      smoothTouch: false,
      touchMultiplier: 1,
    };

    if (useWindowScroll) {
      const lenis = new Lenis(lenisConfig);
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
        ...lenisConfig,
        wrapper: scroller,
        content,
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

    isInitializedRef.current = false;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    if (!cards.length) return;

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

    const waitForImages = () => {
      return new Promise((resolve) => {
        const images = scroller.querySelectorAll('img');
        if (images.length === 0) { resolve(); return; }

        let loadedCount = 0;
        const totalImages = images.length;

        const checkComplete = () => {
          loadedCount++;
          if (loadedCount >= totalImages) resolve();
        };

        images.forEach((img) => {
          if (img.complete && img.naturalHeight !== 0) {
            checkComplete();
          } else {
            img.addEventListener('load', checkComplete, { once: true });
            img.addEventListener('error', checkComplete, { once: true });
            setTimeout(() => { if (loadedCount < totalImages) checkComplete(); }, 3000);
          }
        });
      });
    };

    const initializeScrollStack = async () => {
      await waitForImages();
      void scroller.offsetHeight;
      cacheCardOffsets();
      await new Promise(resolve => requestAnimationFrame(resolve));
      cacheCardOffsets();
      setupLenis();
      await new Promise(resolve => requestAnimationFrame(resolve));
      isInitializedRef.current = true;
      updateCardTransforms();
      // Extra settle pass — mobile fonts/images can shift layout after first paint
      setTimeout(() => {
        cacheCardOffsets();
        updateCardTransforms();
      }, 150);
      setTimeout(() => {
        cacheCardOffsets();
        updateCardTransforms();
      }, 500);
    };

    initializeScrollStack();

    let resizeTimeout;
    const handleResize = () => {
      // Ignore pure vertical resize (mobile address bar show/hide)
      if (typeof window !== 'undefined' && window.innerWidth === windowWidthRef.current) {
        return;
      }
      if (typeof window !== 'undefined') {
        windowWidthRef.current = window.innerWidth;
        // Update frozen viewport height on real width change
        viewportHeightRef.current = useWindowScroll ? window.innerHeight : scrollerRef.current?.clientHeight || 0;
      }

      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isInitializedRef.current = false;
        cacheCardOffsets();
        requestAnimationFrame(() => {
          isInitializedRef.current = true;
          updateCardTransforms();
        });
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Also listen to orientationchange for tablets/phones
    const handleOrientation = () => {
      setTimeout(() => {
        viewportHeightRef.current = useWindowScroll ? window.innerHeight : scrollerRef.current?.clientHeight || 0;
        windowWidthRef.current = window.innerWidth;
        isInitializedRef.current = false;
        cacheCardOffsets();
        requestAnimationFrame(() => {
          isInitializedRef.current = true;
          updateCardTransforms();
        });
      }, 300);
    };

    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (lenisRef.current) lenisRef.current.destroy();

      isInitializedRef.current = false;
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cardOffsetsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
      tickingRef.current = false;
    };
  }, [itemDistance, useWindowScroll, setupLenis, updateCardTransforms, cacheCardOffsets]);

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
      <div className="scroll-stack-inner pt-[4vh] md:pt-[10vh] px-3 sm:px-4 md:px-6 pb-16 md:pb-24">
        {children}
        <div className="scroll-stack-end w-full h-[30vh] md:h-[60vh]" />
      </div>
    </div>
  );
};

export default ScrollStack;