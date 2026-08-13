import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { A4_WIDTH_PX } from "@/lib/paper";

export function ScaledSheet({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const sheet = sheetRef.current;
    if (!container || !sheet) return;

    const update = () => {
      const available = container.clientWidth;
      if (available > 0) setScale(Math.min(1, available / A4_WIDTH_PX));
      setNaturalHeight(sheet.offsetHeight);
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(sheet);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full min-w-0 print:w-auto">
      <div
        className="mx-auto print:!h-auto print:!w-auto"
        style={{
          width: A4_WIDTH_PX * scale,
          height: naturalHeight * scale,
        }}
      >
        <div
          ref={sheetRef}
          className="origin-top-left print:!transform-none"
          style={{ width: A4_WIDTH_PX, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
