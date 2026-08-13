import { useLayoutEffect, useState, type RefObject } from "react";

import { A4_HEIGHT_PX } from "@/lib/paper";

const TOLERANCE_PX = 2;

export function usePageCount(
  refs: readonly RefObject<HTMLElement | null>[],
  options: { enabled?: boolean } = {}
): number {
  const { enabled = true } = options;
  const [pageCount, setPageCount] = useState(1);

  const latestRefs = useLatest(refs);

  useLayoutEffect(() => {
    if (!enabled) {
      setPageCount(1);
      return;
    }

    const elements = latestRefs.current
      .map(ref => ref.current)
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const recompute = () => {
      const tallest = Math.max(...elements.map(paginatedHeight));
      const next = Math.max(
        1,
        Math.ceil((tallest - TOLERANCE_PX) / A4_HEIGHT_PX)
      );
      setPageCount(previous => (previous === next ? previous : next));
    };

    recompute();

    const observer = new ResizeObserver(recompute);
    elements.forEach(element => observer.observe(element));
    window.addEventListener("resize", recompute);
    window.addEventListener("beforeprint", recompute);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recompute);
      window.removeEventListener("beforeprint", recompute);
    };
  }, [enabled, latestRefs]);

  return pageCount;
}

function paginatedHeight(root: HTMLElement): number {
  const rootTop = root.getBoundingClientRect().top;
  const items = Array.from(
    root.querySelectorAll<HTMLElement>(".resume-block, .resume-keep-next")
  );

  let shift = 0;

  for (let first = 0; first < items.length; first++) {
    let last = first;
    while (
      last + 1 < items.length &&
      items[last].classList.contains("resume-keep-next")
    ) {
      last += 1;
    }

    const top = items[first].getBoundingClientRect().top - rootTop + shift;
    const height =
      items[last].getBoundingClientRect().bottom - rootTop + shift - top;
    const offsetInPage = top % A4_HEIGHT_PX;

    if (
      offsetInPage > TOLERANCE_PX &&
      offsetInPage + height > A4_HEIGHT_PX + TOLERANCE_PX
    ) {
      shift += A4_HEIGHT_PX - offsetInPage;
    }

    first = last;
  }

  return root.scrollHeight + shift;
}

function useLatest<T>(value: T): { current: T } {
  const [box] = useState(() => ({ current: value }));
  box.current = value;
  return box;
}
