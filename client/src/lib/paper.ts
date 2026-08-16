export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

/**
 * Blank band kept at the top and bottom of every sheet so the text never
 * touches the paper edge. The bands are drawn by `.resume-band` in
 * `index.css`; these constants only mirror that padding so the pagination
 * model knows how much of each sheet the flow actually gets. Change both
 * together.
 */
export const PAGE_MARGIN_TOP_MM = 10;
export const PAGE_MARGIN_BOTTOM_MM = 10;

/** Usable height of one printed sheet — one "page" as far as the flow cares. */
export const PAGE_CONTENT_HEIGHT_MM =
  A4_HEIGHT_MM - PAGE_MARGIN_TOP_MM - PAGE_MARGIN_BOTTOM_MM;

const PX_PER_INCH = 96;
const MM_PER_INCH = 25.4;

export function mmToPx(mm: number): number {
  return (mm / MM_PER_INCH) * PX_PER_INCH;
}

export function pxToMm(px: number): number {
  return (px / PX_PER_INCH) * MM_PER_INCH;
}

export const A4_WIDTH_PX = mmToPx(A4_WIDTH_MM);
export const A4_HEIGHT_PX = mmToPx(A4_HEIGHT_MM);
export const PAGE_CONTENT_HEIGHT_PX = mmToPx(PAGE_CONTENT_HEIGHT_MM);
