export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  options?: string[];
  timestamp: string;
}

export interface FloorPlanPreset {
  id: string;
  name: string;
  area: number;
  layout: string;
  imageUrl: string;
}

export interface LayoutOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  layoutType: "open_flow" | "multi_functional" | "hidden_storage" | string;
}

export interface LocalSpaceRendering {
  spaceName: string;
  style: string;
  title: string;
  concept: string;
  colors: string[];
  furniture: string[];
  materials: string[];
  imageUrl: string;
  options: string[]; // List of other generated rendering options
  selectedImageIndex: number;
}

export interface MaterialItem {
  category: string;
  name: string;
  spec: string;
  qty: string;
  unitPrice: number;
  brand: string;
}

export interface MoodBoard {
  title: string;
  vibeText: string;
  elements: string[];
}

export interface BudgetItem {
  name: string;
  cost: number;
  desc: string;
}

export interface BudgetOption {
  type: string;
  total: number;
  items: BudgetItem[];
}
