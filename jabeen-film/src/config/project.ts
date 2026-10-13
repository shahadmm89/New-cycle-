/**
 * Everything the film states as fact about the project.
 *
 * Every field starts empty. The film shows ONLY what is filled in here, so
 * nothing reaches the screen until it has been confirmed against the
 * supplied project documents. In the animatic an empty field is drawn as a
 * bracketed placeholder; the final render (npm run render:film) refuses to
 * start while a field the storyboard needs is still empty.
 */

export type Room = {
  /** Name exactly as printed on the architect's plan. */
  name: string;
  /** Dimensions exactly as printed on the plan, e.g. "4.20 × 5.10 m". */
  dims?: string;
  /** Label anchor on the plan image, 0–1 from the image's left / top edge. */
  x: number;
  y: number;
};

export type Floor = {
  /** e.g. "Ground Floor" - as named on the drawings. */
  name: string;
  /** Path under public/, e.g. "project/villa-a/plan-ground.png". */
  planImage: string;
  /** Plan image width / height, so it is never stretched. */
  planAspect: number;
  rooms: Room[];
};

export type VillaType = {
  /** Short id used in asset slot names, e.g. "A" -> slot "s4-wide@A". */
  id: string;
  /** Model name as the developer markets it. */
  name: string;
  builtUpArea?: string; // e.g. "285 m²"
  plotArea?: string; // e.g. "400 m²"
  bedrooms?: number;
  bathrooms?: number;
  /** Outdoor / landscaping items stated on the drawings. */
  outdoor?: string[];
  floors: Floor[];
  /**
   * Interior shot -> on-screen room label (storyboard shots 5A-5F).
   * Leave a shot out and it gets no label. Remove a shot's footage slot
   * entirely if the design has no such room - see docs/STORYBOARD.md.
   */
  roomLabels?: Partial<Record<'living' | 'kitchen' | 'circulation' | 'masterBedroom' | 'bedroom' | 'bathroom', string>>;
};

export const PROJECT = {
  /** Employer name as approved for the title lockup. MISSING. */
  companyName: null as string | null,
  /** Company logo, path under public/. MISSING. */
  companyLogo: null as string | null,
  /** Official JABEEN logo (supplied PNG, transparent background). */
  jabeenLogo: 'brand/jabeen-logo.png',
  jabeenLogoAspect: 1497 / 1109,
  /**
   * Neighbourhood name(s) for the S3 place label. As written in the brief:
   * "Alaziziah, Aljabriah". Spelling, and whether the film should name one or
   * both, is NOT yet confirmed - so it stays empty until it is.
   */
  placeLabel: null as string | null,
  /** Shown under the place label once confirmed. */
  placeSub: 'Yanbu · Royal Commission' as string | null,
  /** Villa types, in the order the film should show them. MISSING. */
  villaTypes: [] as VillaType[],
};

/** Used for the animatic when no villa type has been supplied yet. */
export const PLACEHOLDER_VILLA: VillaType = {id: 'A', name: '', floors: []};

export const villasForFilm = (): VillaType[] =>
  PROJECT.villaTypes.length > 0 ? PROJECT.villaTypes : [PLACEHOLDER_VILLA];
