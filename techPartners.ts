export type TechPartner = {
  id: number;
  init?: string;
  name: string;
  desc?: string;
  imageUrl?: string;
};

export const TECH_PARTNERS: TechPartner[] = [
  { id: 1, init: "AHP", name: "AI in Healthcare Programme", desc: "Supports AI adoption and projects in healthcare.", imageUrl: "/assets/aiHealthcareLogo.jpg" },
  { id: 2, init: "ITL", name: "InterTradeIreland", desc: "Funds cross-border trade and innovation initiatives.", imageUrl: "/assets/interTradeIrelandLogo.png" },
  { id: 3, init: "TP", name: "The Pillar", desc: "Community-focused health services and support hub.", imageUrl: "/assets/thePillarLogo.png" },
  { id: 4, init: "MC", name: "Moic", desc: "Regional partnerships driving health improvement projects.", imageUrl: "/assets/moicLogo.jpg" },
  { id: 5, init: "ACBC", name: "Armagh City Banbridge & Craigavon", desc: "Local authority partnering on regional health programmes.", imageUrl: "/assets/ArmaghLogo.jpg" },
  { id: 6, init: "TH", name: "Tallaght Hospital", desc: "Major acute hospital providing specialist clinical care.", imageUrl: "/assets/tallaghtLogo.jpg" },
];
