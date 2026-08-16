import { useLayoutEffect, useState, type RefObject } from "react";

import { PAGE_CONTENT_HEIGHT_PX } from "@/lib/paper";

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
        Math.ceil((tallest - TOLERANCE_PX) / PAGE_CONTENT_HEIGHT_PX)
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
    while (last + 1 < items.length && weldsTo(items[last], items[last + 1])) {
      last += 1;
    }

    const top = items[first].getBoundingClientRect().top - rootTop + shift;
    const height = groupBottom(items[last]) - rootTop + shift - top;
    const offsetInPage = top % PAGE_CONTENT_HEIGHT_PX;

    if (
      offsetInPage > TOLERANCE_PX &&
      offsetInPage + height > PAGE_CONTENT_HEIGHT_PX + TOLERANCE_PX
    ) {
      shift += PAGE_CONTENT_HEIGHT_PX - offsetInPage;
    }

    first = last;
  }

  return root.scrollHeight + shift;
}

/**
 * `break-after: avoid` welds an item to the box that follows it in the flow —
 * not to the next marked item, which may be somewhere else entirely. The two
 * only belong to the same group when the next marked item is that box, or sits
 * inside it.
 */
function weldsTo(item: HTMLElement, next: HTMLElement): boolean {
  if (!item.classList.contains("resume-keep-next")) return false;
  const sibling = item.nextElementSibling;
  return sibling !== null && (sibling === next || sibling.contains(next));
}

/**
 * Where the group ends. A trailing `.resume-keep-next` is still welded to the
 * box after it even when that box carries no marker of its own — the browser
 * cannot break between them, so at least its first line rides along.
 */
function groupBottom(item: HTMLElement): number {
  const rect = item.getBoundingClientRect();
  if (!item.classList.contains("resume-keep-next")) return rect.bottom;

  const sibling = item.nextElementSibling;
  if (!(sibling instanceof HTMLElement)) return rect.bottom;

  const siblingRect = sibling.getBoundingClientRect();
  return (
    siblingRect.top + Math.min(siblingRect.height, firstLineHeight(sibling))
  );
}

function firstLineHeight(element: HTMLElement): number {
  const style = window.getComputedStyle(element);
  const lineHeight = Number.parseFloat(style.lineHeight);
  if (Number.isFinite(lineHeight)) return lineHeight;

  const fontSize = Number.parseFloat(style.fontSize);
  return Number.isFinite(fontSize) ? fontSize * 1.5 : 0;
}

function useLatest<T>(value: T): { current: T } {
  const [box] = useState(() => ({ current: value }));
  box.current = value;
  return box;
}
