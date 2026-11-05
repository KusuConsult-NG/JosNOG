/**
 * Visualization tokens.
 *
 * The categorical order below is fixed and validated — do not cycle it and do
 * not generate extra hues. Validated with the dataviz palette validator on a
 * light surface: lightness band PASS, chroma floor PASS, CVD separation PASS
 * (worst adjacent pair ΔE 12.5 protan / 13.4 tritan), normal-vision floor PASS
 * (ΔE 20.1), contrast vs surface PASS (all ≥ 3:1).
 *
 *   node scripts/validate_palette.js "#1B7339,#C4861A,#5B4BD6,#0891B2,#B4304E" --mode light
 */
export const CATEGORICAL = ['#1B7339', '#C4861A', '#5B4BD6', '#0891B2', '#B4304E'] as const;

/** Sequential ramp — one hue, light → dark (magnitude only). */
export const SEQUENTIAL = ['#ECF7F0', '#D2EDDC', '#A6DBB9', '#70C492', '#3FA96C', '#1B7339', '#104C26'] as const;

/** Reserved status palette — never reused as a categorical series. Always
 *  shipped with an icon and a text label, never colour alone. */
export const STATUS = {
  good: '#1F8F4A',
  warning: '#B45309',
  serious: '#C2410C',
  critical: '#A61B2B',
  neutral: '#64736D',
} as const;

export const GRID = '#E7ECEA';
export const AXIS_INK = '#8D9C96';
export const SURFACE = '#FFFFFF';

/** Fixed rail → hue assignment (colour follows the entity, never its rank). */
export const RAIL_COLOR: Record<string, string> = {
  enaira: CATEGORICAL[0],
  usdt: CATEGORICAL[1],
  usdc: CATEGORICAL[2],
  eth: CATEGORICAL[3],
};
