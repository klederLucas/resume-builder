export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

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
