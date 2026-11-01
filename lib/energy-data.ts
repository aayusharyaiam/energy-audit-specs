export type CampusMonth = {
  month: string;
  label: string;
  shortLabel: string;
  consumption: number;
  cost: number;
};

export type AreaSeries = {
  code: string;
  name: string;
  shortName: string;
  kind: "monthly_series" | "equipment_snapshot" | "modeled_estimate";
  page: number;
  values?: number[];
  detail: string;
};

/**
 * Verbatim row-level transcription of the campus table on thesis PDF p. 32.
 * Aggregates are intentionally calculated by the website rather than copied
 * from the source's internally inconsistent average labels.
 */
export const campusMonthlyData: CampusMonth[] = [
  {
    month: "2025-01",
    label: "January 2025",
    shortLabel: "Jan ’25",
    consumption: 45_600,
    cost: 387_600,
  },
  {
    month: "2025-02",
    label: "February 2025",
    shortLabel: "Feb ’25",
    consumption: 48_180,
    cost: 414_630,
  },
  {
    month: "2025-03",
    label: "March 2025",
    shortLabel: "Mar ’25",
    consumption: 79_000,
    cost: 671_500,
  },
  {
    month: "2025-04",
    label: "April 2025",
    shortLabel: "Apr ’25",
    consumption: 134_665,
    cost: 1_101_237,
  },
  {
    month: "2025-05",
    label: "May 2025",
    shortLabel: "May ’25",
    consumption: 110_680,
    cost: 901_575,
  },
  {
    month: "2025-06",
    label: "June 2025",
    shortLabel: "Jun ’25",
    consumption: 103_775,
    cost: 797_042,
  },
  {
    month: "2025-07",
    label: "July 2025",
    shortLabel: "Jul ’25",
    consumption: 105_130,
    cost: 855_982,
  },
  {
    month: "2025-08",
    label: "August 2025",
    shortLabel: "Aug ’25",
    consumption: 154_030,
    cost: 1_317_378,
  },
  {
    month: "2025-09",
    label: "September 2025",
    shortLabel: "Sep ’25",
    consumption: 157_940,
    cost: 1_339_468,
  },
  {
    month: "2025-10",
    label: "October 2025",
    shortLabel: "Oct ’25",
    consumption: 111_385,
    cost: 947_808,
  },
  {
    month: "2025-11",
    label: "November 2025",
    shortLabel: "Nov ’25",
    consumption: 88_665,
    cost: 776_565,
  },
  {
    month: "2025-12",
    label: "December 2025",
    shortLabel: "Dec ’25",
    consumption: 77_235,
    cost: 698_493,
  },
  {
    month: "2026-01",
    label: "January 2026",
    shortLabel: "Jan ’26",
    consumption: 100_785,
    cost: 913_606,
  },
];

export const facultyQuarterSeries = [
  7_862.3, 5_451.3, 4_100.3, 6_771.3, 11_300.3, 14_706.3, 14_327.3,
  14_381.3, 13_925.3, 9_998.3, 5_290.3, 4_596.3, 6_715.3,
];

export const guestHouseSeries = [
  5_818.81, 5_818.81, 5_818.81, 6_714, 6_714, 6_714, 6_714, 6_714,
  6_714, 6_714, 5_818.81, 5_818.81, 5_818.81,
];

export const campusServicesSeries = [
  2_491, 2_633, 1_657, 3_721, 2_415, 3_751, 2_110, 4_091, 4_119,
  4_453, 2_609, 2_484, 2_182,
];

export const academicBlockSeries = [
  22_215.84, 8_313.84, 21_551.84, 44_265.79, 37_749.79, 46_432.32,
  36_573.32, 43_147.98, 40_048.98, 21_114.98, 18_443.51, 36_338.13,
  31_294.51,
];

export const auditAreas: AreaSeries[] = [
  {
    code: "pump_room",
    name: "Pump room",
    shortName: "Pumps",
    kind: "modeled_estimate",
    page: 24,
    detail: "Equipment calculation only · 20 HP peak-summer case: 6,714 kWh/month",
  },
  {
    code: "faculty_quarters",
    name: "Faculty quarters",
    shortName: "Faculty",
    kind: "monthly_series",
    page: 27,
    values: facultyQuarterSeries,
    detail: "13 monthly thesis rows · blocks A and B, stairs and parking",
  },
  {
    code: "hostels",
    name: "Hostels",
    shortName: "Hostels",
    kind: "equipment_snapshot",
    page: 30,
    detail: "Equipment snapshot only · 332,346 W connected; 165,034 W in use",
  },
  {
    code: "guest_house",
    name: "Guest house",
    shortName: "Guest house",
    kind: "monthly_series",
    page: 35,
    values: guestHouseSeries,
    detail: "13 monthly values reported in the thesis",
  },
  {
    code: "outdoor_lighting",
    name: "Street & court lighting",
    shortName: "Outdoor",
    kind: "modeled_estimate",
    page: 35,
    detail: "Equipment calculation only · court-light result is disputed in the source",
  },
  {
    code: "campus_services",
    name: "Campus services",
    shortName: "Services",
    kind: "monthly_series",
    page: 37,
    values: campusServicesSeries,
    detail: "Guard, security, shops, canteen, ATM, GAIL and Nescafé",
  },
  {
    code: "academic_block",
    name: "Academic block",
    shortName: "Academic",
    kind: "monthly_series",
    page: 38,
    values: academicBlockSeries,
    detail: "13 monthly thesis rows · highest reported value in June 2025",
  },
];

export const januaryApplianceData = [
  { name: "Geysers", value: 45_384 },
  { name: "Water coolers", value: 20_101.7 },
  { name: "Tube lights", value: 16_281.3 },
  { name: "Computers", value: 9_258.3 },
  { name: "Ground + street lights", value: 4_805 },
  { name: "Kitchen appliances", value: 3_041 },
  { name: "Lab apparatus", value: 793.104 },
  { name: "LEDs", value: 725.16 },
  { name: "Printer + projector", value: 395.5 },
];

export const auditStages = [
  {
    number: "01",
    title: "Plan",
    copy: "Define the audit scope, collect drawings and understand how the campus is supplied.",
  },
  {
    number: "02",
    title: "Observe",
    copy: "Review bills, inventory equipment and record operating hours during field visits.",
  },
  {
    number: "03",
    title: "Analyse",
    copy: "Compare connected loads, measured consumption and seasonal patterns by audit group.",
  },
  {
    number: "04",
    title: "Improve",
    copy: "Prioritise practical measures, verify projected economics and continue monitoring.",
  },
];

export const summary = {
  transformers: [200, 450],
  hostelConnectedWatts: 332_346,
  hostelInUseWatts: 165_034,
  streetLights: 96,
  streetLightCapital: 864_000,
  streetLightPaybackMonths: 58,
  waterHeatingAnnualSavings: 463_740,
  waterHeatingPaybackYears: 4,
};

export const computedBaseline = {
  totalConsumption: campusMonthlyData.reduce(
    (total, item) => total + item.consumption,
    0,
  ),
  totalCost: campusMonthlyData.reduce((total, item) => total + item.cost, 0),
  averageConsumption:
    campusMonthlyData.reduce((total, item) => total + item.consumption, 0) /
    campusMonthlyData.length,
  averageCost:
    campusMonthlyData.reduce((total, item) => total + item.cost, 0) /
    campusMonthlyData.length,
};
