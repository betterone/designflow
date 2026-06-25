import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Upload,
  MessageSquare,
  Layout,
  Sparkles,
  Layers,
  FileText,
  Check,
  Plus,
  Trash,
  Edit2,
  Printer,
  ArrowRight,
  ChevronRight,
  Info,
  Coins,
  Hammer,
  Palette,
  Package,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Scissors,
  CheckSquare,
  Square,
  Download,
  CheckCircle2
} from "lucide-react";
import {
  ChatMessage,
  FloorPlanPreset,
  LayoutOption,
  LocalSpaceRendering,
  MaterialItem,
  MoodBoard,
  BudgetOption
} from "./types";

// Static High-Quality Architectural & Interior presets
const FLOOR_PLAN_PRESETS: FloorPlanPreset[] = [
  {
    id: "preset_1",
    name: "两室一厅·精致小户型 (75㎡)",
    area: 75,
    layout: "两室一厅一卫",
    imageUrl: "https://images.unsplash.com/photo-1545464693-f1798a373343?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "preset_2",
    name: "三室两厅·舒适家庭型 (120㎡)",
    area: 120,
    layout: "三室两厅两卫",
    imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "preset_3",
    name: "大平层跃层·豪华奢享型 (180㎡)",
    area: 180,
    layout: "四室两厅三卫",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
  }
];

const STYLE_CASES = [
  {
    name: "原木和风 (Japandi Oak)",
    desc: "极致质朴，天然白橡木与原色亚麻相融，强调宁静舒适",
    tagColor: "bg-amber-100 text-amber-800",
    coverUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "侘寂风 (Wabi-Sabi Sand)",
    desc: "微水泥肌理与弧形美学，低明度沙色，透露时光的质感",
    tagColor: "bg-stone-200 text-stone-800",
    coverUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "现代极简 (Bauhaus Slate)",
    desc: "无主灯、悬空岩板与超细黑钢线条，黑白灰的高级韵律",
    tagColor: "bg-slate-200 text-slate-800",
    coverUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=500"
  },
  {
    name: "意式轻奢 (Luxury Gold)",
    desc: "大理石纹、香槟拉丝金属及柔光皮饰，都市雅致格调",
    tagColor: "bg-yellow-100 text-yellow-800",
    coverUrl: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=500"
  }
];

// Helper images mapping space & style to realistic portfolio visuals
const MOCK_RENDERING_PHOTOS: Record<string, Record<string, string[]>> = {
  "客厅": {
    "原木和风 (Japandi Oak)": [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1615529182906-c3409a82ac7c?auto=format&fit=crop&q=80&w=1000"
    ],
    "侘寂风 (Wabi-Sabi Sand)": [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1000"
    ],
    "现代极简 (Bauhaus Slate)": [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1000"
    ],
    "意式轻奢 (Luxury Gold)": [
      "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  "主卧": {
    "原木和风 (Japandi Oak)": [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1000"
    ],
    "侘寂风 (Wabi-Sabi Sand)": [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=1000"
    ],
    "现代极简 (Bauhaus Slate)": [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1000"
    ],
    "意式轻奢 (Luxury Gold)": [
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  "厨房": {
    "原木和风 (Japandi Oak)": [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000"
    ],
    "侘寂风 (Wabi-Sabi Sand)": [
      "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80&w=1000"
    ],
    "现代极简 (Bauhaus Slate)": [
      "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=1000"
    ],
    "意式轻奢 (Luxury Gold)": [
      "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=1000"
    ]
  },
  "书房": {
    "原木和风 (Japandi Oak)": [
      "https://images.unsplash.com/photo-1507504038482-76210f6ecddb?auto=format&fit=crop&q=80&w=1000"
    ],
    "侘寂风 (Wabi-Sabi Sand)": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000"
    ],
    "现代极简 (Bauhaus Slate)": [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
    ],
    "意式轻奢 (Luxury Gold)": [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1000"
    ]
  }
};

const DEFAULT_RENDERING_PHOTOS = [
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1000",
  "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&q=80&w=1000"
];

export default function App() {
  // Current Flow Steps
  // 1: 需求探索 (Q&A / Plan Upload)
  // 2: 动线规划 (Layout Options Generator)
  // 3: 空间深化 (Zone render & reference matching)
  // 4: 增值赋能 (3D/Color plans, Material Lists, Mood Board)
  // 5: 终案总览 & 预算交付 (Preview, editable Budgets & printable proposal PDF)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // API Status & Key Indicator State
  const [apiStatus, setApiStatus] = useState({ hasKey: false, message: "" });

  // Step 1 States
  const [selectedPresetId, setSelectedPresetId] = useState<string>("preset_2");
  const [customFloorPlanUrl, setCustomFloorPlanUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  // Step 2 States
  const [layouts, setLayouts] = useState<LayoutOption[]>([]);
  const [isLayoutsLoading, setIsLayoutsLoading] = useState<boolean>(false);
  const [selectedLayoutIds, setSelectedLayoutIds] = useState<string[]>([]);
  const [activeLayoutIdForPreview, setActiveLayoutIdForPreview] = useState<string>("");

  // Step 3 States
  const [isDrawingBox, setIsDrawingBox] = useState<boolean>(false);
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>("客厅");
  const [selectedStyle, setSelectedStyle] = useState<string>("原木和风 (Japandi Oak)");
  const [renderings, setRenderings] = useState<LocalSpaceRendering[]>([]);
  const [isRenderingLoading, setIsRenderingLoading] = useState<boolean>(false);
  const [activeRenderingTab, setActiveRenderingTab] = useState<string>("");

  // Step 4 States (Optional Extras)
  const [enable3DLayout, setEnable3DLayout] = useState<boolean>(true);
  const [enableColorLayout, setEnableColorLayout] = useState<boolean>(true);
  const [enableMaterialList, setEnableMaterialList] = useState<boolean>(true);
  const [enableMoodBoard, setEnableMoodBoard] = useState<boolean>(true);
  const [materialList, setMaterialList] = useState<MaterialItem[]>([]);
  const [moodBoard, setMoodBoard] = useState<MoodBoard | null>(null);
  const [isUpgradesLoading, setIsUpgradesLoading] = useState<boolean>(false);

  // Step 5 States (Proposal compile & budgets)
  const [budgets, setBudgets] = useState<BudgetOption[]>([]);
  const [isBudgetsLoading, setIsBudgetsLoading] = useState<boolean>(false);
  const [editingBudgetIndex, setEditingBudgetIndex] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string>("");

  // Proposal Editability States
  const [proposalTitle, setProposalTitle] = useState<string>("星河湾·自然协奏整装空间交付提案");
  const [proposalSubtitle, setProposalSubtitle] = useState<string>("深度AI空间动线研判 & 局部精微材质渲染方案");
  const [proposalDesigner, setProposalDesigner] = useState<string>("自然美学主案团队");
  const [proposalClient, setProposalClient] = useState<string>("尊贵家装客户");
  const [proposalSummaryText, setProposalSummaryText] = useState<string>(
    "本方案以客户对自然安宁生活的向往为核，打破传统隔断格局，注入双环线人行动线，重点深化客厅及睡眠空间，匹配精控落地预算，致力于实现空无一物的极致整洁与温暖触感。"
  );

  // Dynamic Canvas references for interactive blueprints
  const blueprintCanvasRef = useRef<HTMLCanvasElement>(null);

  // Check API status on mount
  useEffect(() => {
    fetch("/api/api-status")
      .then((res) => res.json())
      .then((data) => {
        setApiStatus(data);
      })
      .catch((err) => console.error("Error fetching API key status:", err));

    // Boot default chat welcome message
    setChatMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "您好！我是您的智能整装空间美学顾问。我已准备好帮助您梳理户型潜能，规划最适合您与家人的起居动线。首先，我想了解下这套房子的常住人口都有谁呢？有没有宠物，或者有什么对空间的特别执念？",
        options: ["独居白领", "幸福二人世界", "三口之家 (含幼儿)", "三代同堂", "有猫猫/狗狗同行"],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  }, []);

  // Update CAD Blueprint Canvas when Layouts or Selections change
  useEffect(() => {
    drawBlueprint();
  }, [selectedPresetId, activeLayoutIdForPreview, currentStep, renderings, cropBox]);

  const drawBlueprint = () => {
    const canvas = blueprintCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Clear and draw grid
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#FAF9F6"; // Alabaster silk base
    ctx.fillRect(0, 0, w, h);

    // Fine Architectural Grid Lines (Graphite layout)
    ctx.strokeStyle = "#F1EFEB";
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Architectural Corner Crosshairs (Drafting Board Details)
    ctx.strokeStyle = "#D5D3CA";
    ctx.lineWidth = 0.75;
    const margin = 30;
    
    // Draw crosshair corners
    const crossHairSize = 15;
    const corners = [
      { x: margin, y: margin },
      { x: w - margin, y: margin },
      { x: margin, y: h - margin },
      { x: w - margin, y: h - margin }
    ];
    corners.forEach(c => {
      ctx.beginPath();
      ctx.moveTo(c.x - crossHairSize, c.y);
      ctx.lineTo(c.x + crossHairSize, c.y);
      ctx.moveTo(c.x, c.y - crossHairSize);
      ctx.lineTo(c.x, c.y + crossHairSize);
      ctx.stroke();
    });

    // Helper to draw realistic professional double-line architectural walls
    const drawWall = (x1: number, y1: number, x2: number, y2: number, thickness = 6) => {
      ctx.strokeStyle = "#2E2B27"; // Dark warm graphite
      ctx.fillStyle = "#EAE9E5"; // Cast concrete/stone fill
      ctx.lineWidth = 1;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;

      const px = -dy / len;
      const py = dx / len;

      const half = thickness / 2;

      ctx.beginPath();
      ctx.moveTo(x1 - px * half, y1 - py * half);
      ctx.lineTo(x2 - px * half, y2 - py * half);
      ctx.lineTo(x2 + px * half, y2 + py * half);
      ctx.lineTo(x1 + px * half, y1 + py * half);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // Helper to draw architectural glass window panels
    const drawWindow = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.strokeStyle = "#8C8774";
      ctx.lineWidth = 1;
      // Draw outer glass frame bounds
      drawWall(x1, y1, x2, y2, 4);
      // Draw center glass mullion
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    // Draw Outer Core Walls
    drawWall(40, 40, w - 40, 40, 8); // Top outer wall
    drawWall(w - 40, 40, w - 40, h - 40, 8); // Right outer wall
    drawWall(40, h - 40, w - 40, h - 40, 8); // Bottom outer wall
    drawWall(40, 40, 40, h - 40, 8); // Left outer wall

    // Inner Partition Walls
    drawWall(180, 40, 180, 150, 5); // Master bedroom divider
    drawWall(40, 150, 180, 150, 5); // Master bedroom bottom partition
    drawWall(280, 40, 280, 180, 5); // Guest bedroom divider
    drawWall(280, 180, w - 40, 180, 5); // Guest bedroom bottom partition
    drawWall(150, 150, 150, 240, 4); // Bath side partition
    drawWall(40, 240, 240, 240, 5); // Living/Kitchen divider

    // Windows openings (Triple lines representation)
    drawWindow(80, 40, 140, 40); // Master Bedroom window
    drawWindow(w - 140, 40, w - 80, 40); // Guest Bedroom window
    drawWindow(40, 300, 40, 350); // Living Room left balcony glass
    drawWindow(w - 40, 280, w - 40, 340); // Kitchen window

    // Draw Furnishings Outline to make it look incredibly real
    ctx.strokeStyle = "#D5D3CA";
    ctx.lineWidth = 1;

    // Master Bedroom Bed Outline (Top-Left)
    ctx.strokeRect(60, 55, 75, 70); // Bed frame
    ctx.strokeRect(65, 60, 30, 15); // Pillow 1
    ctx.strokeRect(100, 60, 30, 15); // Pillow 2
    ctx.beginPath(); // Quilt line
    ctx.moveTo(60, 90);
    ctx.lineTo(135, 90);
    ctx.stroke();

    // Living Room Sectional Sofa (Bottom-Left)
    ctx.strokeRect(55, 275, 50, 80); // Sofa L-shape main
    ctx.strokeRect(105, 315, 60, 40); // Sofa extension
    ctx.fillStyle = "rgba(229, 227, 221, 0.2)";
    ctx.fillRect(75, 315, 40, 20); // Rug / coffee table area
    ctx.strokeRect(75, 315, 40, 20);

    // Dining Table and Chairs (Center-Right)
    ctx.strokeRect(220, 205, 55, 30); // Dining table
    // 4 chairs
    ctx.strokeRect(225, 195, 12, 10);
    ctx.strokeRect(245, 195, 12, 10);
    ctx.strokeRect(225, 235, 12, 10);
    ctx.strokeRect(245, 235, 12, 10);

    // Room Label Typographies with luxury styling
    ctx.fillStyle = "#49453B";
    ctx.font = "bold 11px var(--font-sans)";
    ctx.fillText("主卧 M.BED", 70, 135);
    ctx.fillText("次卧 GUEST BED", 300, 135);
    ctx.fillText("社交客厅 SALON", 65, 265);
    ctx.fillText("回游餐厅 BISTRO", 215, 185);
    ctx.fillText("厨房 KITCHEN", 380, 265);
    ctx.fillText("卫浴 BATH", 85, 185);

    // Minimalist Compass Pointer (North Arrow) in top-right corner
    ctx.strokeStyle = "#8C8774";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w - 60, 70, 15, 0, Math.PI * 2);
    ctx.stroke();
    // North arrow needle
    ctx.beginPath();
    ctx.moveTo(w - 60, 58);
    ctx.lineTo(w - 64, 75);
    ctx.lineTo(w - 60, 71);
    ctx.lineTo(w - 56, 75);
    ctx.closePath();
    ctx.fillStyle = "#8C8774";
    ctx.fill();
    ctx.font = "bold 9px var(--font-sans)";
    ctx.fillText("N", w - 63, 50);

    // Scalebar indicator at the bottom-left
    ctx.strokeStyle = "#8C8774";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(45, h - 50);
    ctx.lineTo(145, h - 50);
    ctx.moveTo(45, h - 53); ctx.lineTo(45, h - 47);
    ctx.moveTo(95, h - 53); ctx.lineTo(95, h - 47);
    ctx.moveTo(145, h - 53); ctx.lineTo(145, h - 47);
    ctx.stroke();
    ctx.fillStyle = "#8C8774";
    ctx.font = "8px var(--font-mono)";
    ctx.fillText("0", 43, h - 57);
    ctx.fillText("2.5m", 88, h - 57);
    ctx.fillText("5.0m", 135, h - 57);
    ctx.fillText("SCALE 1 : 50 @ A3", 45, h - 68);

    // Active Layout Overlays
    if (activeLayoutIdForPreview === "layout_1") {
      // Modern Open Flow (LDK Integrated dynamic arrow)
      ctx.fillStyle = "rgba(197, 168, 128, 0.12)"; // Delicate warm gold tint
      ctx.strokeStyle = "rgba(163, 133, 90, 0.4)";
      ctx.lineWidth = 1.5;
      // Highlight the entire LDK area
      ctx.fillRect(45, 155, 410, 200);
      ctx.strokeRect(45, 155, 410, 200);

      // Draw elegant curved dotted flow path arrow
      ctx.strokeStyle = "#a3855a";
      ctx.lineWidth = 2.5;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(70, 310);
      ctx.bezierCurveTo(180, 340, 280, 250, 380, 280);
      ctx.stroke();
      ctx.setLineDash([]);

      // Custom arrow head
      ctx.fillStyle = "#a3855a";
      ctx.beginPath();
      ctx.arc(380, 280, 4, 0, Math.PI * 2);
      ctx.fill();

      // Flow description text
      ctx.fillStyle = "#a3855a";
      ctx.font = "italic 11px var(--font-serif)";
      ctx.fillText("✦ 敞开式 LDK 社交洄游主轴线 (Integrated Circulation Core)", 60, h - 68);
    } else if (activeLayoutIdForPreview === "layout_2") {
      // Flexible Room sliding door indicator
      ctx.strokeStyle = "#a3855a";
      ctx.lineWidth = 2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(280, 100);
      ctx.lineTo(280, 175);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(163, 133, 90, 0.08)";
      ctx.fillRect(285, 45, 120, 130);

      ctx.fillStyle = "#a3855a";
      ctx.font = "italic 11px var(--font-serif)";
      ctx.fillText("❖ 联动长虹玻璃移门 / 多维X空间 (Flexible X-Space Suite)", 190, h - 68);
    } else if (activeLayoutIdForPreview === "layout_3") {
      // Hidden wall cabinets block
      ctx.fillStyle = "#EAE9E5";
      ctx.strokeStyle = "#a3855a";
      ctx.lineWidth = 1.5;
      ctx.fillRect(45, 245, 10, 110);
      ctx.strokeRect(45, 245, 10, 110);

      ctx.fillStyle = "#a3855a";
      ctx.font = "italic 11px var(--font-serif)";
      ctx.fillText("❖ 隐形壁挂高定柜体系统 (Hidden Wall Storage)", 200, h - 68);
    }

    // Render spatial zone marks or box overlays
    renderings.forEach((r) => {
      ctx.fillStyle = "rgba(163, 133, 90, 0.12)";
      ctx.strokeStyle = "#a3855a";
      ctx.lineWidth = 1.5;

      // Draw a representative marker
      let mx = 50, my = 245, mw = 120, mh = 110;
      if (r.spaceName === "主卧") { mx = 45; my = 45; mw = 130; mh = 100; }
      if (r.spaceName === "厨房") { mx = 340; my = 185; mw = 115; mh = 110; }
      if (r.spaceName === "书房") { mx = 285; my = 45; mw = 130; mh = 130; }

      ctx.fillRect(mx, my, mw, mh);
      ctx.strokeRect(mx, my, mw, mh);

      // Checkmark icon
      ctx.fillStyle = "#a3855a";
      ctx.font = "bold 9px var(--font-sans)";
      ctx.fillText("✓ 深化方案已生成", mx + 8, my + 18);
    });

    // Draw active drawing crop box if drag-drawing
    if (cropBox) {
      ctx.fillStyle = "rgba(163, 133, 90, 0.18)";
      ctx.strokeStyle = "#a3855a";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.fillRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);
      ctx.setLineDash([]);

      ctx.fillStyle = "#2E2B27";
      ctx.font = "9px var(--font-mono)";
      ctx.fillText(`框选深化: ${Math.round(cropBox.w * 10)}x${Math.round(cropBox.h * 10)}mm`, cropBox.x + 5, cropBox.y + 15);
    }
  };

  // Drag-and-drop / Custom file simulation
  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      setTimeout(() => {
        setCustomFloorPlanUrl(URL.createObjectURL(e.target.files![0]));
        setIsUploading(false);
      }, 1200);
    }
  };

  // Quick Action clicking helper in step 1 Q&A
  const handleOptionClick = (optionText: string) => {
    sendChatMessage(optionText);
  };

  // Trigger server-side message sending
  const sendChatMessage = async (inputText: string) => {
    if (!inputText.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: newHistory.slice(0, -1),
          currentInput: inputText
        })
      });
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "assistant",
        text: data.text,
        options: data.options,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Step 2: Trigger layout alternatives generation
  const handleGenerateLayouts = async () => {
    setIsLayoutsLoading(true);
    try {
      const answersConcat = chatMessages
        .filter((m) => m.role === "user")
        .map((m) => m.text)
        .join(", ");

      const response = await fetch("/api/generate-layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: answersConcat,
          layoutTypePreset: selectedPresetId
        })
      });
      const data = await response.json();

      setLayouts(data.layouts);
      if (data.layouts.length > 0) {
        setSelectedLayoutIds([data.layouts[0].id]);
        setActiveLayoutIdForPreview(data.layouts[0].id);
      }
      setCurrentStep(2);
    } catch (err) {
      console.error("Layout generation failed:", err);
    } finally {
      setIsLayoutsLoading(false);
    }
  };

  // Step 3: Draw box drag events on blueprint canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (currentStep !== 3) return;
    const canvas = blueprintCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawingBox(true);
    setCropStart({ x, y });
    setCropBox({ x, y, w: 0, h: 0 });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingBox || !cropStart) return;
    const canvas = blueprintCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(cropStart.x, currentX);
    const y = Math.min(cropStart.y, currentY);
    const w = Math.abs(cropStart.x - currentX);
    const h = Math.abs(cropStart.y - currentY);

    setCropBox({ x, y, w, h });
  };

  const handleCanvasMouseUp = () => {
    setIsDrawingBox(false);
  };

  // Step 3: Generate Local space rendering details and case reference
  const handleGenerateRendering = async () => {
    setIsRenderingLoading(true);
    try {
      const response = await fetch("/api/generate-rendering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spaceName: selectedZone,
          style: selectedStyle,
          shapeInfo: cropBox
        })
      });
      const data = await response.json();

      // Pair generated data with high quality stock image according to style and room
      const styleCategory = selectedStyle;
      const candidates = MOCK_RENDERING_PHOTOS[selectedZone]?.[styleCategory] || DEFAULT_RENDERING_PHOTOS;

      const newRendering: LocalSpaceRendering = {
        spaceName: selectedZone,
        style: selectedStyle,
        title: data.title,
        concept: data.concept,
        colors: data.colors || ["#EADCC9", "#C5B49F", "#82715E", "#3A332B"],
        furniture: data.furniture || ["高定制沙发组合", "极简岩板大理石地台"],
        materials: data.materials || ["超高微水泥饰面板", "天然白橡复合木"],
        imageUrl: candidates[0],
        options: candidates, // Store references for optional multi-choice
        selectedImageIndex: 0
      };

      setRenderings((prev) => {
        const filtered = prev.filter((r) => r.spaceName !== selectedZone);
        return [...filtered, newRendering];
      });
      setActiveRenderingTab(selectedZone);
      setCropBox(null); // Clear crop box selection
    } catch (err) {
      console.error("Failed to generate spatial details:", err);
    } finally {
      setIsRenderingLoading(false);
    }
  };

  // Step 4: Generate extras (material tables, mood board, budget frameworks)
  const handleGenerateUpgradesAndBudgets = async () => {
    setIsUpgradesLoading(true);
    setIsBudgetsLoading(true);
    setCurrentStep(4);

    try {
      // Fetch materials lists & mood boards
      const upgradesRes = await fetch("/api/generate-upgrades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedLayoutId: selectedLayoutIds[0] || "layout_1",
          style: selectedStyle
        })
      });
      const upgradesData = await upgradesRes.json();
      setMaterialList(upgradesData.materials);
      setMoodBoard(upgradesData.moodBoard);

      // Fetch 3-Budget comparison options
      const selectedPreset = FLOOR_PLAN_PRESETS.find((p) => p.id === selectedPresetId);
      const totalArea = selectedPreset ? selectedPreset.area : 100;

      const budgetsRes = await fetch("/api/generate-budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          area: totalArea
        })
      });
      const budgetsData = await budgetsRes.json();
      setBudgets(budgetsData.budgets);

    } catch (err) {
      console.error("Upgrades compilation failed:", err);
    } finally {
      setIsUpgradesLoading(false);
      setIsBudgetsLoading(false);
    }
  };

  // Helper to dynamically update item prices and recalculate totals instantly
  const handleBudgetCostChange = (budgetIdx: number, itemIdx: number, val: string) => {
    const parsed = parseInt(val) || 0;
    const updatedBudgets = [...budgets];
    updatedBudgets[budgetIdx].items[itemIdx].cost = parsed;

    // Recalculate total sum
    const newTotal = updatedBudgets[budgetIdx].items.reduce((sum, item) => sum + item.cost, 0);
    updatedBudgets[budgetIdx].total = newTotal;

    setBudgets(updatedBudgets);
  };

  // Manual modifications of item labels directly by designers
  const handleBudgetNameChange = (budgetIdx: number, itemIdx: number, val: string) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[budgetIdx].items[itemIdx].name = val;
    setBudgets(updatedBudgets);
  };

  const handleBudgetDescChange = (budgetIdx: number, itemIdx: number, val: string) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[budgetIdx].items[itemIdx].desc = val;
    setBudgets(updatedBudgets);
  };

  // Edit Material list items
  const handleMaterialChange = (idx: number, field: keyof MaterialItem, val: any) => {
    const updatedList = [...materialList];
    updatedList[idx] = {
      ...updatedList[idx],
      [field]: val
    };
    setMaterialList(updatedList);
  };

  // Trigger standard operating system printing to save a crisp PDF output
  const handleExportPDF = () => {
    window.print();
  };

  // Save current proposal modifications
  const handleSaveProposalEdits = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccessMessage("✓ 提案已成功保存在本地云端！PDF格式排版已就绪。");
      setTimeout(() => setSaveSuccessMessage(""), 4000);
    }, 1500);
  };

  return (
    <div className={`min-h-screen ${currentStep < 5 ? "lg:h-screen lg:max-h-screen lg:overflow-hidden" : ""} bg-[#FBFBFA] text-[#1C1A17] flex flex-col relative overflow-x-hidden antialiased font-sans`}>
      
      {/* Upper Status Header Banner (No-Print) */}
      <header className="no-print w-full border-b border-[#EAE9E5] bg-white sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 border border-luxury-gold bg-[#FAF9F6] text-amber-800 rounded-md shadow-sm flex items-center justify-center">
              <Compass className="w-5 h-5 animate-spin-slow text-[#a3855a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-serif italic font-medium tracking-wide text-luxury-gold">
                  Nature's Atelier
                </h1>
                <span className="text-[11px] font-sans font-bold tracking-widest text-[#5C574B] bg-[#FAF9F6] border border-[#EAE9E5] px-2 py-0.5 rounded">
                  STUDIO
                </span>
              </div>
              <p className="text-xs text-[#8C8774] flex items-center gap-1.5 mt-0.5 font-sans">
                <span>智能高定整装提案交付系统</span>
                <span className="w-1 h-1 bg-[#d5d3ca] rounded-full"></span>
                <span className="text-brand-700 font-mono text-[10px] tracking-wider uppercase">V2.5 Premium Suite</span>
              </p>
            </div>
          </div>

          {/* Core Navigation progress chips with elegant Roman numerals */}
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full no-scrollbar py-1">
            {[
              { num: 1, roman: "I", label: "需求收集" },
              { num: 2, roman: "II", label: "户型动线" },
              { num: 3, roman: "III", label: "空间深化" },
              { num: 4, roman: "IV", label: "增值配置" },
              { num: 5, roman: "V", label: "方案交付" }
            ].map((step) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <React.Fragment key={step.num}>
                  <button
                    onClick={() => {
                      if (layouts.length > 0) {
                        setCurrentStep(step.num);
                      }
                    }}
                    disabled={layouts.length === 0}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? "bg-[#2E2B27] text-white shadow-sm font-semibold scale-102"
                        : isPast
                        ? "bg-[#EAE9E5] text-[#49453b] hover:bg-[#d5d3ca]"
                        : "bg-transparent text-[#B5B1A3] cursor-not-allowed"
                    }`}
                  >
                    <span className={`font-serif italic text-[13px] ${
                      isActive ? "text-amber-400 font-bold" : isPast ? "text-brand-800" : "text-[#B5B1A3]"
                    }`}>
                      {step.roman}
                    </span>
                    <span className="tracking-wide text-[11px]">{step.label}</span>
                  </button>
                  {step.num < 5 && <ChevronRight className="w-3 h-3 text-[#D5D3CA] shrink-0" />}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* API key activation notification */}
        <div className="w-full bg-[#f4f3ef] border-t border-[#eae9e5] py-1 px-4 text-center">
          <p className="text-[11px] text-[#6F6A5A] font-mono flex items-center justify-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${apiStatus.hasKey ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            <span>{apiStatus.message}</span>
          </p>
        </div>
      </header>

      {/* Main Work Surface Workspace */}
      <main className={`flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 ${currentStep < 5 ? "lg:h-[calc(100vh-170px)] lg:min-h-0 lg:overflow-hidden pb-4" : "pb-24"}`}>
        
        {/* LEFT WORKSPACE COLUMNS: Interactive Floorplan, Blueprints & spatial deepeners */}
        <section className={`lg:col-span-7 space-y-6 ${currentStep === 5 ? "lg:col-span-12" : ""} ${currentStep < 5 ? "lg:h-full lg:overflow-y-auto lg:pr-1" : ""}`}>
          
          {/* Blueprint Box Card Header */}
          {currentStep < 5 && (
            <div className="bg-white rounded-xl border border-[#EAE9E5] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F5F5F3] pb-3">
                <div className="flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[#a3855a]" />
                  <div>
                    <h2 className="font-serif italic text-lg tracking-[0.12em] leading-relaxed text-[#16181B]">
                      {currentStep === 1 ? "I. 房屋户型导入底图" : currentStep === 2 ? "II. 智能动线规划图演练" : "III. 局部深化精准圈定与效果图"}
                    </h2>
                    <p className="text-xs text-[#8C8774] mt-0.5">
                      {currentStep === 1 
                        ? "选择标准设计户型，或直接上传真实户型底图" 
                        : currentStep === 2 
                        ? "动态高亮流线设计。点击下方方案卡片切换显示流线"
                        : "用鼠标在户型图上框选（或点击下方房间标记），然后点击‘开始精细化深化’"}
                    </p>
                  </div>
                </div>
                {currentStep === 3 && (
                  <span className="text-[10px] bg-transparent text-[#a3855a] px-2 py-0.5 rounded border border-[#a3855a]/40 animate-pulse font-mono tracking-wider">
                    ❖ 支持鼠标框选特定深化区域
                  </span>
                )}
              </div>

              {/* Responsive interactive floor plan visualizer component */}
              <div className="relative border border-[#eae9e5] rounded-lg overflow-hidden bg-[#FAF9F6] flex items-center justify-center p-2 group shadow-inner">
                
                {/* Standard Preset view for Step 1 */}
                {currentStep === 1 && !customFloorPlanUrl && (
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-[11px] font-mono text-amber-300">SELECTED ARCHITECTURAL BLUEPRINT</span>
                    <h3 className="text-white font-medium text-sm">
                      {FLOOR_PLAN_PRESETS.find((p) => p.id === selectedPresetId)?.name}
                    </h3>
                  </div>
                )}

                {/* Main Blueprint Interactive Canvas */}
                <canvas
                  id="blueprint-canvas"
                  ref={blueprintCanvasRef}
                  width={520}
                  height={380}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  className="w-full max-w-full aspect-[4/3] rounded bg-[#FAF9F6] block cursor-crosshair shadow-sm"
                />

                {/* Standard Upload File Area inside layout view (No-Print) */}
                {currentStep === 1 && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-[#49453b] hover:text-[#1c1a17] text-xs font-medium rounded-lg shadow-sm border border-[#eae9e5] cursor-pointer transition-all">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{customFloorPlanUrl ? "更改图纸" : "上传图纸"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUploadSim}
                      />
                    </label>
                  </div>
                )}

                {/* Upload state spinner */}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 z-30 flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-8 h-8 text-[#8C8774] animate-spin" />
                    <p className="text-xs text-[#8C8774] font-mono">正在分析图纸框架及剪力墙结构...</p>
                  </div>
                )}
              </div>

              {/* Spatial zone quick clickable hotspots chips (For box matching) */}
              {currentStep === 3 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-[#6F6A5A]">核心独立空间快捷框定：</p>
                  <div className="flex flex-wrap gap-2">
                    {["客厅", "主卧", "厨房", "书房"].map((zone) => {
                      const hasRendered = renderings.some((r) => r.spaceName === zone);
                      const isSelected = selectedZone === zone;
                      return (
                        <button
                          key={zone}
                          onClick={() => {
                            setSelectedZone(zone);
                            setCropBox(null); // Clear custom crop to use default spatial overlays
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                            isSelected
                              ? "bg-brand-900 border-brand-900 text-white"
                              : "bg-[#FAF9F6] border-[#EBE8E0] text-[#5C5648] hover:bg-[#EBE8E0]"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-[#c5a880]" : "bg-[#8C8673]"}`} />
                          <span>{zone}</span>
                          {hasRendered && <span className="text-[9px] border border-[#a3855a] text-[#a3855a] px-1.5 py-0.5 rounded font-medium scale-90">✓ 已生成</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Style match gallery selector */}
              {currentStep === 3 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-brand-600" />
                    <p className="text-xs font-semibold text-[#6F6A5A]">匹配案例及风格（设计师臻选）：</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {STYLE_CASES.map((style) => {
                      const isSelected = selectedStyle === style.name;
                      return (
                        <button
                          key={style.name}
                          onClick={() => setSelectedStyle(style.name)}
                          className={`relative text-left rounded-lg overflow-hidden border transition-all p-1.5 flex flex-col gap-1.5 ${
                            isSelected ? "border-brand-900 bg-[#fbfbfa] ring-2 ring-brand-900/10" : "border-[#eae9e5] bg-white"
                          }`}
                        >
                          <img
                            src={style.coverUrl}
                            alt={style.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-16 object-cover rounded"
                          />
                          <div>
                            <p className="text-[11px] font-serif italic text-[#16181B] leading-tight">{style.name}</p>
                            <p className="text-[9px] text-[#8C8774] line-clamp-1 mt-0.5">{style.desc}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-brand-900 text-white p-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Render generator button */}
                  <div className="pt-3 border-t border-[#F5F5F3] flex justify-end">
                    <button
                      onClick={handleGenerateRendering}
                      disabled={isRenderingLoading}
                      className="px-5 py-2.5 bg-brand-900 hover:bg-brand-950 disabled:bg-[#d5d3ca] text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-all shadow-md"
                    >
                      {isRenderingLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>正在推演三维光影与材质细节...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>生成【{selectedZone}】空间深化效果图</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Render Active Renderings output tabs in Step 3 */}
          {currentStep === 3 && renderings.length > 0 && (
            <div className="bg-white rounded-xl border border-[#EAE9E5] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#F5F5F3] pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#a3855a] animate-pulse" />
                  <h3 className="font-serif italic text-sm tracking-[0.1em] leading-relaxed text-[#16181B]">已生成局部深化空间效果图集</h3>
                </div>
                <div className="flex gap-1.5">
                  {renderings.map((r) => (
                    <button
                      key={r.spaceName}
                      onClick={() => setActiveRenderingTab(r.spaceName)}
                      className={`px-3 py-1 rounded text-xs transition-all ${
                        activeRenderingTab === r.spaceName
                          ? "bg-brand-900 text-white animate-pulse"
                          : "bg-transparent border border-[#EBE8E0] text-[#5C5648] hover:bg-[#F5F2EB]"
                      }`}
                    >
                      {r.spaceName}
                    </button>
                  ))}
                </div>
              </div>

              {renderings.filter((r) => r.spaceName === activeRenderingTab).map((r, rIdx) => (
                <div key={rIdx} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  <div className="md:col-span-7 space-y-3">
                    <div className="relative rounded-lg overflow-hidden border border-[#EBE8E0] bg-[#FAF9F6] group">
                      <img
                        src={r.imageUrl}
                        alt={r.title}
                        referrerPolicy="no-referrer"
                        className="w-full aspect-[16/10] object-cover"
                      />
                      <div className="absolute top-2.5 left-2.5 border border-[#a3855a] bg-[#FAF9F5]/90 text-[#a3855a] px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider rounded backdrop-blur">
                        {r.style}
                      </div>

                      {/* Multichoice preview option toggle */}
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        {r.options.map((optUrl, optIdx) => (
                          <button
                            key={optIdx}
                            onClick={() => {
                              const updated = [...renderings];
                              const target = updated.find((x) => x.spaceName === r.spaceName);
                              if (target) {
                                target.imageUrl = optUrl;
                                target.selectedImageIndex = optIdx;
                                setRenderings(updated);
                              }
                            }}
                            className={`w-10 h-10 rounded overflow-hidden border-2 transition-all ${
                              r.selectedImageIndex === optIdx ? "border-amber-400 scale-110" : "border-white/50 opacity-70"
                            }`}
                          >
                            <img src={optUrl} alt="option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-center text-[#8C8774] italic">✦ 点击右下角微缩图，可即时切换并保存多款备选效果图 ✦</p>
                  </div>

                  <div className="md:col-span-5 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-serif italic text-base tracking-[0.08em] leading-relaxed text-[#16181B]">{r.title}</h4>
                        <p className="text-xs tracking-wider text-[#a3855a] mt-1 font-mono uppercase text-[10px]">{r.style} 深化定制</p>
                      </div>
                      <p className="text-xs text-[#5C574B] leading-relaxed bg-[#FAF9F6] p-3 rounded border border-[#EBE8E0]">
                        {r.concept}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* COMPLETE PROPOSAL WORKSPACE (Only Step 5 - Printable Container) */}
          {currentStep === 5 && (
            <div className="print-container bg-white border border-[#EAE9E5] rounded-xl shadow-md p-6 md:p-12 space-y-12 relative">
              
              {/* Proposal Header Banner */}
              <div className="border-b border-[#EAE9E5] pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-3 flex-1">
                  <div className="inline-flex items-center gap-2 text-[10px] text-[#a3855a] tracking-[0.2em] font-bold uppercase font-sans">
                    <Compass className="w-4 h-4 text-[#a3855a] animate-spin-slow" />
                    <span>NATURE'S ATELIER · ARCHITECTURAL PRESENTATION DOSSIER</span>
                  </div>
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={proposalTitle}
                      onChange={(e) => setProposalTitle(e.target.value)}
                      className="text-2xl md:text-3xl font-serif italic text-luxury-gold bg-transparent hover:bg-[#FAF9F6] border-b border-transparent focus:border-brand-300 transition-all outline-none py-1 w-full"
                    />
                    <input
                      type="text"
                      value={proposalSubtitle}
                      onChange={(e) => setProposalSubtitle(e.target.value)}
                      className="text-xs tracking-wider text-[#8C8774] font-sans bg-transparent hover:bg-[#FAF9F6] border-b border-transparent focus:border-brand-300 transition-all outline-none py-0.5 w-full"
                    />
                  </div>
                </div>

                <div className="text-right text-xs space-y-1.5 shrink-0 font-mono text-[#5C574B] border-l md:border-l-0 md:border-r border-[#EAE9E5] pl-4 md:pl-0 md:pr-4">
                  <p className="flex items-center md:justify-end gap-2 text-[11px]">
                    <span className="font-bold text-[#a3855a] uppercase tracking-wider">主案设计 Artist:</span>
                    <input
                      type="text"
                      value={proposalDesigner}
                      onChange={(e) => setProposalDesigner(e.target.value)}
                      className="bg-transparent hover:bg-[#FAF9F6] border-b border-transparent focus:border-brand-300 outline-none w-28 font-semibold text-[#2E2B27]"
                    />
                  </p>
                  <p className="flex items-center md:justify-end gap-2 text-[11px]">
                    <span className="font-bold text-[#a3855a] uppercase tracking-wider">尊享主业 Client:</span>
                    <input
                      type="text"
                      value={proposalClient}
                      onChange={(e) => setProposalClient(e.target.value)}
                      className="bg-transparent hover:bg-[#FAF9F6] border-b border-transparent focus:border-brand-300 outline-none w-28 font-semibold text-[#2E2B27]"
                    />
                  </p>
                  <p className="text-[10px] text-[#8C8774]">交付档期 Date: {new Date().toLocaleDateString("zh-CN")} (STUDIO LIVE)</p>
                </div>
              </div>

              {/* Proposal Executive Summary (Editable) */}
              <div className="space-y-3 bg-[#FAF9F6] p-5 rounded-lg border border-[#EAE9E5]">
                <h4 className="text-[11px] uppercase font-bold tracking-widest text-[#a3855a] flex items-center gap-1.5 font-sans">
                  <Info className="w-3.5 h-3.5" />
                  <span>全案策划美学阐述 / EXECUTIVE SUMMARY</span>
                </h4>
                <textarea
                  value={proposalSummaryText}
                  onChange={(e) => setProposalSummaryText(e.target.value)}
                  className="w-full text-xs text-[#5C574B] leading-relaxed bg-transparent focus:bg-white border border-transparent focus:border-brand-300 rounded p-1 transition-all outline-none font-sans"
                  rows={3}
                />
              </div>

              {/* SECTION: Blueprint & Floorplans */}
              <div className="space-y-6 print-avoid-break">
                <div className="flex items-center gap-3 border-b border-[#EAE9E5] pb-3">
                  <div className="font-serif italic text-lg text-[#a3855a] font-bold">I.</div>
                  <h3 className="font-serif text-lg tracking-wide text-[#2E2B27]">高定规划户型排布与空间洄游方案</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  <div className="md:col-span-6 flex flex-col items-center">
                    <p className="text-[9px] text-[#8C8774] mb-2 font-mono tracking-widest uppercase">SECTION SPECIFICATION DRAFT PREVIEW</p>
                    <div className="border border-[#EAE9E5] rounded p-2 bg-[#FAF9F6] w-full flex items-center justify-center shadow-inner">
                      {/* Copy canvas or display static schematics depending on layout */}
                      <canvas
                        ref={(ref) => {
                          if (ref) {
                            const ctx = ref.getContext("2d");
                            const srcCanvas = blueprintCanvasRef.current;
                            if (ctx && srcCanvas) {
                              ref.width = srcCanvas.width;
                              ref.height = srcCanvas.height;
                              ctx.drawImage(srcCanvas, 0, 0);
                            }
                          }
                        }}
                        className="w-full aspect-[4/3] max-w-sm rounded bg-[#FAF9F6]"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-6 space-y-4">
                    {layouts.filter((l) => selectedLayoutIds.includes(l.id)).map((layout) => (
                      <div key={layout.id} className="space-y-3">
                        <span className="text-[9px] bg-[#2E2B27] text-white px-2.5 py-1 rounded font-mono tracking-widest uppercase">SELECTED DESIGN CORE</span>
                        <h4 className="font-serif italic text-lg text-[#2E2B27]">{layout.title}</h4>
                        <p className="text-xs text-[#5C574B] leading-relaxed font-sans">{layout.description}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3">
                          <div className="bg-[#FAF9F6] p-3.5 rounded border-l-2 border-[#a3855a]">
                            <span className="font-bold text-[#a3855a] text-[10px] tracking-wider uppercase block mb-1">▲ 美学突破与动线增益 (PROS)</span>
                            <ul className="list-disc pl-4 space-y-1 text-[#5C574B] text-[11px]">
                              {layout.pros.map((p, pIdx) => (
                                <li key={pIdx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-[#FAF9F6] p-3.5 rounded border-l-2 border-[#8C8774]">
                            <span className="font-bold text-[#8C8774] text-[10px] tracking-wider uppercase block mb-1">▼ 技术考量与工艺规约 (CONS)</span>
                            <ul className="list-disc pl-4 space-y-1 text-[#5C574B] text-[11px]">
                              {layout.cons.map((c, cIdx) => (
                                <li key={cIdx}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION: Interactive Spatial Renderings Render Grid */}
              <div className="space-y-6 print-page-break print-avoid-break">
                <div className="flex items-center gap-3 border-b border-[#EBE8E0] pb-3">
                  <div className="font-serif italic text-lg text-[#a3855a] font-bold">II.</div>
                  <h3 className="font-serif text-lg tracking-[0.12em] leading-relaxed text-[#16181B]">局部深化三维空间高定效果图集</h3>
                </div>

                {renderings.length === 0 ? (
                  <div className="p-8 border border-dashed border-[#D8D4C9] text-center rounded-lg">
                    <p className="text-xs text-[#8C8774]">（您目前尚未生成局部空间效果图，可在‘第3步·空间深化’中圈选生成）</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderings.map((r, rIdx) => (
                      <div key={rIdx} className="border border-[#EBE8E0] rounded-xl overflow-hidden bg-[#FAF9F6] flex flex-col">
                        <img
                          src={r.imageUrl}
                          alt={r.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-48 object-cover border-b border-[#EBE8E0]"
                        />
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[9px] border border-[#a3855a] text-[#a3855a] px-2.5 py-0.5 rounded uppercase font-mono tracking-wider font-semibold">
                              {r.spaceName} Deepening · {r.style}
                            </span>
                            <h4 className="font-serif italic text-base tracking-[0.08em] leading-relaxed text-[#16181B] mt-2">{r.title}</h4>
                            <p className="text-xs text-[#5C574B] leading-relaxed mt-1 line-clamp-3">{r.concept}</p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-[#EBE8E0] mt-3">
                            <div className="flex gap-1">
                              {r.colors.map((color, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="w-4 h-4 rounded-full border border-white/50"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                            <div className="text-[10px] text-[#8C8774] flex justify-between">
                              <span>高定单品：{r.furniture.slice(0, 2).join(" / ")}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION: Upgrades (Material lists & sensory mood board) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 print-page-break print-avoid-break">
                
                {/* Mood Board card */}
                {enableMoodBoard && moodBoard && (
                  <div className="md:col-span-5 space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#EBE8E0] pb-3">
                      <div className="font-serif italic text-lg text-[#a3855a] font-bold">III.</div>
                      <h3 className="font-serif text-lg tracking-[0.12em] leading-relaxed text-[#16181B]">美学主板：主辅材情绪意境版</h3>
                    </div>

                    <div className="border border-[#EBE8E0] rounded-xl p-4 bg-[#FAF9F6] space-y-3 shadow-inner">
                      <h4 className="font-serif italic text-sm tracking-[0.08em] leading-relaxed text-[#16181B]">{moodBoard.title}</h4>
                      <p className="text-xs text-[#5C574B] leading-relaxed italic">{moodBoard.vibeText}</p>
                      
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-[#8C8774] uppercase tracking-wider">材质与感官锚点：</p>
                        <div className="flex flex-wrap gap-1.5">
                          {moodBoard.elements.map((el, elIdx) => (
                            <span key={elIdx} className="border border-[#D8D4C9] text-brand-900 text-[9px] font-mono tracking-wider px-2.5 py-1 rounded uppercase">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Material Table Lists */}
                {enableMaterialList && materialList.length > 0 && (
                  <div className="md:col-span-7 space-y-3">
                    <div className="flex items-center gap-3 border-b border-[#EBE8E0] pb-3">
                      <div className="font-serif italic text-lg text-[#a3855a] font-bold">IV.</div>
                      <h3 className="font-serif text-lg tracking-[0.12em] leading-relaxed text-[#16181B]">设计师精选整装材料工程清单</h3>
                    </div>

                    <div className="border border-[#EBE8E0] rounded-xl overflow-hidden shadow-inner">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#FAF9F6] border-b border-[#EBE8E0] text-[#16181B] font-serif">
                            <th className="p-2.5 font-bold tracking-wide">分类</th>
                            <th className="p-2.5 font-bold tracking-wide">材料品名</th>
                            <th className="p-2.5 font-bold tracking-wide">规格描述</th>
                            <th className="p-2.5 font-bold tracking-wide text-right">参考价格</th>
                            <th className="p-2.5 font-bold tracking-wide">推荐品牌</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F5F3] bg-white">
                          {materialList.map((item, idx) => (
                            <tr key={idx} className="hover:bg-[#FAF9F6]">
                              <td className="p-2 text-[#8C8774]">
                                <input
                                  type="text"
                                  value={item.category}
                                  onChange={(e) => handleMaterialChange(idx, "category", e.target.value)}
                                  className="w-full bg-transparent hover:bg-[#F5F5F3] outline-none rounded p-0.5"
                                />
                              </td>
                              <td className="p-2 font-medium">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleMaterialChange(idx, "name", e.target.value)}
                                  className="w-full bg-transparent hover:bg-[#F5F5F3] outline-none rounded p-0.5"
                                />
                              </td>
                              <td className="p-2 text-[#5C574B]">
                                <input
                                  type="text"
                                  value={item.spec}
                                  onChange={(e) => handleMaterialChange(idx, "spec", e.target.value)}
                                  className="w-full bg-transparent hover:bg-[#F5F5F3] outline-none rounded p-0.5 text-[11px]"
                                />
                              </td>
                              <td className="p-2 text-right text-amber-800 font-mono">
                                <input
                                  type="number"
                                  value={item.unitPrice}
                                  onChange={(e) => handleMaterialChange(idx, "unitPrice", e.target.value)}
                                  className="w-16 bg-transparent hover:bg-[#F5F5F3] outline-none rounded p-0.5 text-right font-mono"
                                />
                              </td>
                              <td className="p-2 text-[#8C8774] text-[11px]">
                                <input
                                  type="text"
                                  value={item.brand}
                                  onChange={(e) => handleMaterialChange(idx, "brand", e.target.value)}
                                  className="w-full bg-transparent hover:bg-[#F5F5F3] outline-none rounded p-0.5"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: 3 Decoration Budgets Matrix (Highly requested!) */}
              <div className="space-y-4 print-page-break print-avoid-break">
                <div className="flex items-center justify-between border-b border-[#EBE8E0] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="font-serif italic text-lg text-[#a3855a] font-bold">V.</div>
                    <h3 className="font-serif text-lg tracking-[0.12em] leading-relaxed text-[#16181B]">三档装修工程精控预算对比与编辑表 (双击输入框可即时编辑)</h3>
                  </div>
                  <div className="no-print flex gap-1.5">
                    {budgets.map((b, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEditingBudgetIndex(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-all border ${
                          editingBudgetIndex === idx 
                            ? "bg-brand-900 text-white border-brand-900 font-semibold" 
                            : "bg-transparent border-[#EBE8E0] text-[#5C5648] hover:bg-[#F5F2EB]"
                        }`}
                      >
                        编辑{b.type.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {budgets.map((b, bIdx) => {
                    const isEditing = editingBudgetIndex === bIdx;
                    return (
                      <div
                        key={bIdx}
                        className={`border rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
                          isEditing
                            ? "border-[#a3855a] bg-[#FAF9F6] ring-4 ring-[#a3855a]/5 shadow-md"
                            : "border-[#EAE9E5] bg-white shadow-sm"
                        }`}
                      >
                        {/* Header Box */}
                        <div className="p-4 bg-[#2E2B27] text-white flex justify-between items-center border-b border-[#a3855a]">
                          <div>
                            <span className="text-[9px] text-amber-400 font-bold tracking-widest block uppercase">BUDGET MODEL</span>
                            <h4 className="font-serif italic text-sm">{b.type}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] text-zinc-400 block uppercase tracking-wider">Estimated Total</span>
                            <span className="text-base font-extrabold text-[#c5a880] font-mono">
                              ¥{(b.total).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* List items with responsive edit triggers */}
                        <div className="p-4 divide-y divide-[#EAE9E5] flex-1 bg-white">
                          {b.items.map((item, itemIdx) => (
                            <div key={itemIdx} className="py-2.5 text-xs space-y-1">
                              <div className="flex justify-between items-start gap-2">
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleBudgetNameChange(bIdx, itemIdx, e.target.value)}
                                  className="font-bold text-[#2E2B27] bg-transparent hover:bg-[#FAF9F6] focus:bg-[#FAF9F6] outline-none rounded p-1 flex-1 font-sans text-[11px] border border-transparent focus:border-[#EAE9E5] transition-all"
                                />
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[#8C8774] font-mono text-[11px]">¥</span>
                                  <input
                                    type="number"
                                    value={item.cost}
                                    onChange={(e) => handleBudgetCostChange(bIdx, itemIdx, e.target.value)}
                                    className="font-mono font-bold text-[#a3855a] text-right bg-transparent hover:bg-[#FAF9F6] focus:bg-[#FAF9F6] outline-none rounded p-1 w-20 text-[11px] border border-transparent focus:border-[#EAE9E5] transition-all"
                                  />
                                </div>
                              </div>
                              <textarea
                                value={item.desc}
                                onChange={(e) => handleBudgetDescChange(bIdx, itemIdx, e.target.value)}
                                className="w-full text-[10px] text-[#8C8774] leading-relaxed bg-transparent hover:bg-[#FAF9F6] focus:bg-[#FAF9F6] outline-none rounded p-1 resize-none font-sans border border-transparent focus:border-[#EAE9E5] transition-all"
                                rows={2}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Summary Footer */}
                        <div className="p-3 bg-[#FAF9F6] border-t border-[#EAE9E5] text-center text-[10px] text-[#8C8774] font-mono">
                          包含基础辅材工程 + 高定柜体 + 知名合资品牌洁具主材
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Printed Contract signature panel (shows only during printing) */}
              <div className="hidden print:block pt-16 border-t border-[#D5D3CA] print-avoid-break">
                <div className="grid grid-cols-2 gap-10 text-xs">
                  <div>
                    <p className="border-b border-[#8C8774] pb-8 font-semibold text-[#16181B]">主案设计师签名签字盖章 (Signature):</p>
                    <p className="mt-2 text-[#8C8774]">Nature's Atelier Studio Core Team</p>
                  </div>
                  <div>
                    <p className="border-b border-[#8C8774] pb-8 font-semibold text-[#16181B]">尊贵家装客户签字审核 (Acceptance):</p>
                    <p className="mt-2 text-[#8C8774]">客户已现场核对空间红线及工程主材参考价格</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* RIGHT INTERACTIVE COLUMNS: Step instructions, Chat logs, and action items */}
        {currentStep < 5 && (
          <aside className="lg:col-span-5 no-print lg:h-full lg:flex lg:flex-col lg:gap-4 lg:overflow-y-auto lg:pr-1">
            
            {/* Action controls based on step */}
            <div className="bg-white rounded-xl border border-[#EAE9E5] p-5 shadow-sm space-y-4 shrink-0">
              <div className="flex items-center gap-2 border-b border-[#EBE8E0] pb-3">
                <Sparkles className="w-4 h-4 text-[#a3855a] animate-pulse" />
                <h3 className="font-serif italic text-sm tracking-[0.08em] leading-relaxed text-[#16181B]">
                  {currentStep === 1 ? "核心步骤 · 发现家装需求" : currentStep === 2 ? "核心步骤 · 户型方案确认" : "核心步骤 · 增值高级定制"}
                </h3>
              </div>

              {/* Step 1 instructions and preset selectors */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs text-[#5C574B] leading-relaxed">
                      请先选择一个经典户型作为设计蓝本，或者上传您真实的户型纸质图。接着在下方通过 Q&A 问答来告诉AI助手您的起居执念。
                    </p>
                    
                    <div className="space-y-2 pt-1">
                      <p className="text-xs font-bold text-[#5C5648] tracking-wide font-sans">选择底图案例：</p>
                      <div className="grid grid-cols-1 gap-2">
                        {FLOOR_PLAN_PRESETS.map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => {
                              setSelectedPresetId(preset.id);
                              setCustomFloorPlanUrl(null); // Clear custom upload
                            }}
                            className={`p-2.5 rounded-lg border text-left transition-all flex items-center justify-between ${
                              selectedPresetId === preset.id && !customFloorPlanUrl
                                ? "border-brand-900 bg-brand-50"
                                : "border-[#EBE8E0] bg-white"
                            }`}
                          >
                            <div>
                              <p className="text-xs font-bold text-[#16181B]">{preset.name}</p>
                              <p className="text-[10px] text-[#8C8774] mt-0.5">布局：{preset.layout} · 室内使用面积 {preset.area}㎡</p>
                            </div>
                            <span className="text-[10px] text-[#8C8774] border border-[#EBE8E0] px-2 py-0.5 rounded font-mono">
                              {preset.area}㎡
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#EBE8E0] pt-4">
                    <button
                      onClick={handleGenerateLayouts}
                      disabled={isLayoutsLoading}
                      className="w-full py-3 bg-brand-900 hover:bg-brand-950 disabled:bg-[#D5D3CA] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md animate-pulse"
                    >
                      {isLayoutsLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>AI 正在全力推演 3 套户型方案动线...</span>
                        </>
                      ) : (
                        <>
                          <span>分析核心诉求，生成户型方案图</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 choices and interactive layouts */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs text-[#5C574B] leading-relaxed">
                    AI 已经为您精心计算了 3 套不同的室内设计改造布局方案。您可以在下方查看细节，并<strong>选择一个或多个</strong>方案进入下一步：
                  </p>

                  <div className="space-y-2.5">
                    {layouts.map((layout) => {
                      const isSelected = selectedLayoutIds.includes(layout.id);
                      return (
                        <div
                          key={layout.id}
                          className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected ? "border-brand-900 bg-[#fbfbfa]" : "border-[#eae9e5] bg-white"
                          }`}
                          onClick={() => {
                            // Toggle multi-select as requested
                            if (isSelected) {
                              setSelectedLayoutIds(prev => prev.filter(id => id !== layout.id));
                            } else {
                              setSelectedLayoutIds(prev => [...prev, layout.id]);
                            }
                            // Highlight on visual CAD blueprint canvas
                            setActiveLayoutIdForPreview(layout.id);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-serif italic text-sm tracking-[0.08em] leading-relaxed text-[#16181B]">{layout.title}</h4>
                            <div className="flex items-center gap-2">
                              {/* Option selection checker */}
                              <span className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                isSelected ? "bg-brand-900 border-brand-900 text-white" : "border-[#EBE8E0] text-transparent"
                              }`}>
                                ✓
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#5C574B] mt-1.5 leading-relaxed">{layout.description}</p>
                          
                          <div className="flex flex-wrap gap-1 pt-2">
                            {layout.pros.slice(0, 1).map((p, idx) => (
                              <span key={idx} className="border border-emerald-200 text-emerald-800 text-[9px] px-2 py-0.5 rounded tracking-wide font-sans">
                                特色: {p}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-[#F5F5F3] pt-4 flex gap-2">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-3.5 py-2.5 border border-[#EAE9E5] hover:bg-[#F5F5F3] rounded-lg text-xs font-semibold text-[#5c574b] transition-all"
                    >
                      重新调整需求
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      disabled={selectedLayoutIds.length === 0}
                      className="flex-1 py-2.5 bg-brand-900 hover:bg-brand-950 disabled:bg-[#d5d3ca] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
                    >
                      <span>选择选定方案，进入局部深化</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 Spatial upgrades triggers */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-[#5C574B] leading-relaxed">
                    您现在已经将空间骨架确认。下一步，我们将为空间生成<strong>高价值增配项目</strong>（如彩平图、高精全屋材料采购单、美学情绪版、预算工程表），以便最终呈现给客户：
                  </p>

                  <div className="p-3 bg-[#FAF9F6] border border-[#EBE8E0] rounded-lg space-y-2.5">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#a3855a]" />
                      <p className="text-xs font-serif italic text-[#16181B] tracking-wide">包含以下可定制赋能项：</p>
                    </div>
                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enable3DLayout}
                          onChange={(e) => setEnable3DLayout(e.target.checked)}
                          className="rounded border-[#eae9e5]"
                        />
                        <span>3D 户型立体渲染图 (可选增项)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableColorLayout}
                          onChange={(e) => setEnableColorLayout(e.target.checked)}
                          className="rounded border-[#eae9e5]"
                        />
                        <span>艺术整装彩色平面图 (可选增项)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableMaterialList}
                          onChange={(e) => setEnableMaterialList(e.target.checked)}
                          className="rounded border-[#eae9e5]"
                        />
                        <span>精细化主辅材采购清单物料表</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enableMoodBoard}
                          onChange={(e) => setEnableMoodBoard(e.target.checked)}
                          className="rounded border-[#eae9e5]"
                        />
                        <span>设计师触觉与软装氛围情绪板</span>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-[#F5F5F3] pt-4 flex gap-2">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-3.5 py-2.5 border border-[#EAE9E5] hover:bg-[#F5F5F3] rounded-lg text-xs font-semibold text-[#5c574b] transition-all"
                    >
                      返回布局演练
                    </button>
                    <button
                      onClick={handleGenerateUpgradesAndBudgets}
                      className="flex-1 py-2.5 bg-brand-900 hover:bg-brand-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md animate-bounce"
                    >
                      <span>一键编译情绪板/材料清单/预算</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Loading & Confirm page */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-900 animate-pulse">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif italic text-base tracking-[0.08em] leading-relaxed text-[#16181B]">AI 智能整装方案正在最终整合编译中</h4>
                      <p className="text-xs text-[#8C8774] mt-1 leading-relaxed">
                        正在聚合主辅材品牌溢价系数、计算多套工艺预算、渲染高精度平面意境图...
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentStep(5)}
                    className="w-full py-3 bg-brand-900 hover:bg-brand-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>整装编译完成！进入全案总览与预算交付</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Q&A chat dialog card for requirement gathering */}
            {currentStep === 1 && (
              <div className="bg-white rounded-xl border border-[#EAE9E5] p-5 shadow-sm space-y-4 flex flex-col justify-between lg:flex-1 lg:min-h-0 h-[380px] shrink-0">
                <div className="flex items-center gap-2 border-b border-[#EBE8E0] pb-3 shrink-0">
                  <MessageSquare className="w-5 h-5 text-[#a3855a]" />
                  <div>
                    <h3 className="font-serif italic text-sm tracking-[0.08em] leading-relaxed text-[#16181B]">美学探针 · 设计师AI智能问答</h3>
                    <p className="text-[10px] text-[#8C8774]">深度探索全屋居住核心理念、家庭成员与功能执念</p>
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto space-y-3 p-1.5 no-scrollbar">
                  {chatMessages.map((msg) => {
                    const isAi = msg.role === "assistant";
                    return (
                      <div key={msg.id} className={`flex flex-col ${isAi ? "items-start" : "items-end"} space-y-1`}>
                        <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          isAi 
                            ? "bg-[#FAF9F6] text-[#16181B] border border-[#EBE8E0] rounded-tl-sm" 
                            : "bg-brand-900 text-white rounded-tr-sm shadow-sm"
                        }`}>
                          <p>{msg.text}</p>

                          {/* Quick clickable option chips */}
                          {isAi && msg.options && msg.options.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5 pt-2 border-t border-[#eae9e5]">
                              {msg.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  onClick={() => handleOptionClick(opt)}
                                  className="bg-white hover:bg-[#eae9e5] border border-[#d5d3ca] hover:border-[#8c8774] text-[#5c574b] text-[10px] px-2 py-1 rounded transition-all shadow-sm shrink-0"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-[#B5B1A3] px-1 font-mono">{msg.timestamp}</span>
                      </div>
                    );
                  })}

                  {isChatLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#8C8774] font-mono p-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>美学顾问正在深度拆解您的偏好...</span>
                    </div>
                  )}
                </div>

                {/* Input block */}
                <div className="pt-3 border-t border-[#F5F5F3] flex gap-2 shrink-0">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage(chatInput)}
                    placeholder="输入或点击上方气泡选项回复..."
                    className="flex-1 border border-[#EAE9E5] hover:border-[#D5D3CA] focus:border-brand-500 rounded-lg px-3 py-2 text-xs bg-white outline-none transition-all shadow-inner"
                  />
                  <button
                    onClick={() => sendChatMessage(chatInput)}
                    className="px-4 py-2 bg-brand-900 hover:bg-brand-950 text-white rounded-lg text-xs font-semibold transition-all"
                  >
                    发送
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </main>

      {/* FLOAT ACTION DOCK (No-Print) */}
      <footer className="no-print w-full border-t border-[#EBE8E0] bg-white/90 backdrop-blur fixed bottom-0 left-0 right-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#8C8774] hidden sm:inline-block">
              当前编辑中方案：<strong className="text-[#16181B]">{proposalTitle}</strong>
            </span>
            {saveSuccessMessage && (
              <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                {saveSuccessMessage}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep === 5 && (
              <>
                <button
                  onClick={handleSaveProposalEdits}
                  disabled={isSaving}
                  className="px-4 py-2 border border-brand-900 hover:bg-brand-50 text-brand-900 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all"
                >
                  {isSaving ? "正在同步方案..." : "同步保存提案"}
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-all shadow-lg animate-pulse"
                >
                  <Printer className="w-4 h-4" />
                  <span>导出 PDF 完整图文方案</span>
                </button>
              </>
            )}

            {currentStep < 5 && layouts.length > 0 && (
              <button
                onClick={() => setCurrentStep(5)}
                className="px-6 py-2.5 bg-brand-900 hover:bg-brand-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md"
              >
                <span>立即跳至终版预览</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
