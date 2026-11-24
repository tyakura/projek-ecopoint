import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type FlowSectionProps = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  pin?: boolean;
  'aria-label'?: string;
};

export function FlowSection({
  className,
  style,
  children,
  pin = true,
  'aria-label': ariaLabel,
}: FlowSectionProps) {
  return (
    <section
      data-flow-section
      data-flow-pin={pin ? 'true' : 'false'}
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <div className="flow-art-container">{children}</div>
    </section>
  );
}

type FlowArtProps = {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
};

export default function FlowArt({
  children,
  className,
  'aria-label': ariaLabel = 'Landing page story',
}: FlowArtProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let context: gsap.Context | undefined;

    const setup = () => {
      context?.revert();
      context = undefined;

      if (motionPreference.matches) return;

      const sections = Array.from(
        root.querySelectorAll<HTMLElement>('[data-flow-section]'),
      );
      if (sections.length < 2) return;

      context = gsap.context(() => {
        sections.forEach((section, index) => {
          gsap.set(section, { zIndex: index + 1 });

          const inner = section.querySelector<HTMLElement>('.flow-art-container');
          if (!inner) return;

          if (index > 0) {
            gsap.set(inner, { rotation: 30, transformOrigin: 'bottom left' });
            gsap.to(inner, {
              rotation: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top 25%',
                scrub: true,
              },
            });
          }

          if (index < sections.length - 1 && section.dataset.flowPin !== 'false') {
            ScrollTrigger.create({
              trigger: section,
              start: 'bottom bottom',
              end: 'bottom top',
              pin: true,
              pinSpacing: false,
            });
          }
        });
      }, root);

      ScrollTrigger.refresh();
    };

    setup();
    motionPreference.addEventListener('change', setup);

    const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
    resizeObserver.observe(root);

    return () => {
      motionPreference.removeEventListener('change', setup);
      resizeObserver.disconnect();
      context?.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label={ariaLabel}
      className={['flow-art', className].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  );
}
