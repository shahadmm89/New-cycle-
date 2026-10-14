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
  /** Arabic room name exactly as printed on the architect's plan. */
  name: string;
  /** Dimensions exactly as printed on the plan, e.g. "4.20 × 5.10 م". */
  dims?: string;
  /** Label anchor on the plan image, 0–1 from the image's left / top edge. */
  x: number;
  y: number;
};

export type Floor = {
  /** e.g. "الدور الأرضي" - as named on the drawings. */
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
  /** Model name in Arabic, as the developer markets it. */
  name: string;
  builtUpArea?: string; // e.g. "285 م²" - digits exactly as on the drawings
  plotArea?: string; // e.g. "400 م²"
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

/**
 * All on-screen copy is Arabic only. Lines marked "default" are the
 * recommended options from the choices page and change once the client picks;
 * null means "not confirmed", and is shown as a bracketed placeholder in the
 * animatic and blocks the release render.
 */
export const PROJECT = {
  /** Employer, as it should read in the lockup. Public sources: Yasref. NOT CONFIRMED. */
  companyName: null as string | null,
  /** Company logo, path under public/. MISSING. */
  companyLogo: null as string | null,
  /** JABEEN's name in Arabic as it should read in the lockup. NOT CONFIRMED. */
  jabeenName: null as string | null,
  /** Official JABEEN logo (supplied PNG, transparent background). */
  jabeenLogo: 'brand/jabeen-logo.png',
  jabeenLogoAspect: 1497 / 1109,
  copy: {
    /** "A New Home Ownership Opportunity" (default). */
    subtitle: 'فرصة جديدة لتملّك منزلك',
    /** "Your Future Home Begins Here" (default). */
    closing: 'بيتك المستقبلي يبدأ هنا',
  },
  /**
   * The S3 place label. One project across two neighbourhoods. The brief says
   * "Alaziziah, Aljabriah"; the Royal Commission announcement says Al-Aziziyah
   * and Al-Nakhil. Stays empty until JABEEN confirms.
   */
  placeLabel: null as string | null,
  /** Second line of the place label (default). */
  placeSub: 'الهيئة الملكية بينبع' as string | null,
  /** The one villa model the film presents. MISSING. */
  villaTypes: [] as VillaType[],
};

/** Spec-panel captions on the floor-plan reveal. */
export const SPEC_LABELS = {
  villaType: 'نموذج الفيلا',
  builtUpArea: 'مساحة البناء',
  plotArea: 'مساحة الأرض',
  bedrooms: 'غرف النوم',
  bathrooms: 'دورات المياه',
  outdoor: 'المساحات الخارجية',
};

/** Used for the animatic when no villa type has been supplied yet. */
export const PLACEHOLDER_VILLA: VillaType = {id: 'A', name: '', floors: []};

export const villasForFilm = (): VillaType[] =>
  PROJECT.villaTypes.length > 0 ? PROJECT.villaTypes : [PLACEHOLDER_VILLA];
