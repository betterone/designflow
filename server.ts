import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Lazy initialize Gemini client
  let aiClient: GoogleGenAI | null = null;
  const isGeminiAvailable = !!process.env.GEMINI_API_KEY;

  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && isGeminiAvailable) {
      try {
        aiClient = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Successfully initialized Gemini API Client.");
      } catch (err) {
        console.error("Failed to initialize Gemini API client:", err);
      }
    }
    return aiClient;
  }

  // ----------------------------------------------------------------------
  // API Routes
  // ----------------------------------------------------------------------

  // 1. Get current API key status
  app.get("/api/api-status", (req, res) => {
    res.json({
      hasKey: isGeminiAvailable,
      message: isGeminiAvailable 
        ? "Gemini API key is active. All generation is powered by Gemini 3.5." 
        : "Gemini API key is missing from secrets. Applet has automatically switched to local procedural generator."
    });
  });

  // 2. Chat Q&A Agent Endpoint
  app.post("/api/chat", async (req, res) => {
    const { history = [], currentInput = "" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const formattedContents = history.map((h: any) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.text }]
        }));
        formattedContents.push({ role: "user", parts: [{ text: currentInput }] });

        const systemInstruction = 
          "You are an expert interior designer gathering client requirements for a new house design. " +
          "Keep your tone warm, professional, and helpful. Ask short, punchy questions (one or two questions max) " +
          "to discover their style preferences, family members, pets, daily habits, space functions, or budget. " +
          "CRITICAL: Always output responses in JSON matching the following schema. " +
          "You MUST also provide 3 to 4 quick option chips (short text, 2-10 characters) " +
          "for the user to click to reply quickly, helping streamline requirement collection. " +
          "Output JSON only, do not wrap in markdown code blocks unless parsing handles it, but using config.responseMimeType is preferred.";

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                text: { 
                  type: Type.STRING, 
                  description: "The professional designer assistant message to the client, in Chinese." 
                },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "An array of 3-4 prompt chips / options for rapid clicking, e.g. ['极简现代', '原木风', '混搭'], in Chinese."
                }
              },
              required: ["text", "options"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
      } catch (err) {
        console.error("Gemini Chat Error, falling back:", err);
      }
    }

    // Fallback Simulation for Chat Interaction
    const defaultQuestions = [
      {
        text: "您好！我是您的智能整装美学顾问。为了给您定制最完美的家，首先想了解下这套房子的常住人口有哪些呢？是否有老人、小孩或者宠物需要特别照顾？",
        options: ["独居单身", "甜蜜新婚夫妻", "三口之家 (含幼儿)", "三代同堂", "有猫猫/狗狗"]
      },
      {
        text: "收到！关于设计风格，您和家人更向往哪种氛围感？这决定了我们后续色彩和材质的基调。",
        options: ["现代极简 (大平层感)", "温暖原木风 (日式治愈)", "复古法式 (精致浪漫)", "侘寂风 (宁静空灵)", "意式轻奢 (都市质感)"]
      },
      {
        text: "太棒了，这种风格非常耐看。您平时在家最主要的休闲方式是什么？比如喜欢下厨、在家办公、有大量影音阅读需求，还是希望客厅能成为开阔的亲子游乐区？",
        options: ["喜欢下厨/中西双厨", "经常居家办公/阅读", "家庭影音/游戏发烧友", "开阔亲子互动区", "平时接待朋友聚会"]
      },
      {
        text: "了解您的生活重心了。对于空间收纳，您有什么偏好？是更喜欢‘空无一物’的隐藏式全收纳，还是希望有精致的开放式展示柜？",
        options: ["全屋定制隐藏式收纳", "开放式展示+绿植", "适度收纳/断舍离", "需要独立衣帽间"]
      },
      {
        text: "最后一个重要的问题，对于整体的硬装与软装（不含电器），您目前的首选预算区间大概是多少呢？这能帮我更好地平衡主辅材与家具的品质配置。",
        options: ["15-25万 (高性价比)", "25-45万 (中高端定制)", "45-80万 (奢华整装)", "80万以上 (高端全案)"]
      },
      {
        text: "非常感谢您的配合！我已经完全掌握了您的核心需求。接下来，请点击下方的‘生成户型方案图’，我将为您深度规划3套专属的户型动线布局方案！",
        options: ["立即生成方案", "修改刚才的输入"]
      }
    ];

    const questionIndex = Math.min(Math.floor(history.length / 2), defaultQuestions.length - 1);
    const selectedQuestion = defaultQuestions[questionIndex];

    let replyText = selectedQuestion.text;
    if (currentInput && history.length > 0 && questionIndex > 0) {
      replyText = `收到您的反馈（“${currentInput}”）。${selectedQuestion.text}`;
    }

    return res.json({
      text: replyText,
      options: selectedQuestion.options
    });
  });

  // 3. Generate Layouts Option Endpoint
  app.post("/api/generate-layouts", async (req, res) => {
    const { preferences = "", layoutTypePreset = "three_rooms" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Based on the client's home layout preset "${layoutTypePreset}" and preferences "${preferences}", ` +
          `generate 3 highly professional alternative architectural floor plan layout solutions. ` +
          `Your description should be extremely professional and detailed, listing specific spatial changes (e.g. wall demolitions, multi-functional partitions). ` +
          `Provide the result in JSON format in Chinese. Output JSON only matching the schema structure.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                layouts: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING, description: "Layout scheme title, in Chinese, e.g. 现代洄游双动线" },
                      description: { type: Type.STRING, description: "Detailed architectural spatial planning explanation, in Chinese." },
                      pros: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of pros/advantages." },
                      cons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of potential tradeoffs." },
                      layoutType: { type: Type.STRING, description: "Technical key: open_flow, multi_functional, dynamic_circle" }
                    },
                    required: ["id", "title", "description", "pros", "cons", "layoutType"]
                  }
                }
              },
              required: ["layouts"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
      } catch (err) {
        console.error("Gemini Layout Generation failed, using simulation:", err);
      }
    }

    // Fallback Simulation for Floor Plan Layout Options
    const mockLayouts = [
      {
        id: "layout_1",
        title: "方案 A：全开敞 LDK 交互社交布局 (Modern Open Flow)",
        description: "打破传统的客餐厅隔断，将厨房、餐厅、客厅融为一体。拆除北阳台与厨房之间的非承重墙，引入双排一字型西厨中岛。玄关增设步入式大衣帽柜。主卧采用隐藏式隐形门，并将衣帽间与主卫打通，实现双向动线，大幅增强整体空间通透感与互动性。",
        pros: ["视线极度开阔，采光通风增加 30%", "LDK 一体化让家庭互动更亲密", "双向环状动线，日常起居更灵动"],
        cons: ["中式爆炒时油烟控制要求较高，需配备高吸力集成灶", "静区（卧室）与动区（客厅）间隔稍弱"],
        layoutType: "open_flow"
      },
      {
        id: "layout_2",
        title: "方案 B：多功能 X-Space 弹性成长期布局 (Flexible Growable Room)",
        description: "针对家庭全生命周期设计。保留客餐厅主体，将南向次卧墙体替换为超窄边框长虹玻璃联动移门。平时完全敞开作为开放式书房、瑜伽室或儿童娱乐区，与客厅无缝连接；宾客来访时合上移门，放下一体式墨菲床，即可秒变独立静谧客房。",
        pros: ["空间高弹可变，完美适应未来 5-10 年人口变化", "超大公共尺度感，视觉延展性极佳", "兼顾通透性与偶尔的独立隐秘度"],
        cons: ["玻璃移门隔音效果略逊于实体墙", "定制折叠家具的初期五金件预算较高"],
        layoutType: "multi_functional"
      },
      {
        id: "layout_3",
        title: "方案 C：日式侘寂收纳美学布局 (Hidden Storage Zen Plan)",
        description: "贯彻‘空无一物’的美学原则。沿着公共区北墙定制一整排高 2.7m 的无拉手隐藏式高柜，将冰箱、烤箱、杂物和零碎用品全部隐藏收纳。取消主卧传统床头柜，代之以定制悬空背景台板。次卧改造为日式榻榻米多功能地台，提供超大规格地台储物箱。",
        pros: ["收纳容量提升 180%，全屋整洁有序", "日式禅意氛围，空间温润纯粹", "极致利用走道等冗余空间进行嵌入收纳"],
        cons: ["全屋高定柜体较多，对定制板材环保及预算要求高", "格局偏稳重，缺少部分开放动线的活泼感"],
        layoutType: "hidden_storage"
      }
    ];

    return res.json({ layouts: mockLayouts });
  });

  // 4. Local Space Rendering details Generator
  app.post("/api/generate-rendering", async (req, res) => {
    const { spaceName = "客厅", style = "现代简约", shapeInfo = {} } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Generate a gorgeous localized interior design solution for the space "${spaceName}" with style "${style}". ` +
          `Include high-end design concept, professional color palette (4 hex colors), key furniture recommendation lists, and decorative materials. ` +
          `Return in JSON in Chinese. Output JSON only matching the schema format.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                concept: { type: Type.STRING },
                colors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 Hex colors for palette, e.g. ['#FFFFFF', '#D1C2A5']" },
                furniture: { type: Type.ARRAY, items: { type: Type.STRING } },
                materials: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "concept", "colors", "furniture", "materials"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
      } catch (err) {
        console.error("Gemini Rendering Generation failed, using simulation:", err);
      }
    }

    const mockRenderings: Record<string, any> = {
      "客厅": {
        title: `${style}·浮光流影巨幕客厅`,
        concept: `以大面积温润的中性色为基底，通过微水泥涂料与悬空岩板地台的材质碰撞，打破传统客厅边界。采用无主灯漫反射设计，点缀暖光线性灯带，打造极具艺术感与包容力的家庭核心互动场域。`,
        colors: ["#F5F2EB", "#DFD9CE", "#8C8370", "#2E2B27"],
        furniture: ["意大利超大体量羽绒面包沙发", "悬空黑色岩板多功能电视地台", "大师设计款单人羊羔绒休闲椅", "极简不锈钢圆形茶几组"],
        materials: ["西班牙微水泥墙面涂料", "1200x2700 哑光通体大理石瓷砖", "定制天然白橡木木饰面板", "超窄边黑钛无缝不锈钢边框"]
      },
      "主卧": {
        title: `${style}·静谧私享舒眠卧室`,
        concept: `主卧旨在过滤外界的喧嚣，重塑睡眠安全感。采用床头背景墙双拼设计，搭配吸音格栅板与柔哑皮革软包。低亮度的隐藏反光灯带避免直射光源，结合温柔的棉麻织物，营造静谧、舒缓的感官体验。`,
        colors: ["#EAE4D9", "#D3C8B5", "#6B6050", "#1C1916"],
        furniture: ["悬浮式定制软包床头大床", "双侧定制圆柱形哑光烤漆床头柜", "一体化极简隐形衣帽柜", "真丝材质柔纱窗帘配智能静音轨道"],
        materials: ["高环保哑光艺术乳胶漆", "比利时天然橡木三层实木地板", "超细纤维科技皮软包", "PET 静音柜体饰面板"]
      },
      "厨房": {
        title: `${style}·烟火与高定融合厨房`,
        concept: `将高效的中式爆炒区与精致的西餐岛台完美阶梯式集成。纯净的无把手橱柜门板呈现极致的线性序列，通过隐藏嵌入式管线机与大算力嵌入式厨电，建立有秩序且温暖的都市烹饪岛屿。`,
        colors: ["#F8F9FA", "#E9ECEF", "#ADB5BD", "#212529"],
        furniture: ["岩板中西厨岛台餐桌一体柜", "高定阻尼多功能收纳拉篮", "人体工学高脚真皮岛台凳", "智能防油烟静音集成灶"],
        materials: ["12mm 厚德赛斯超薄纯白岩板台面", "免漆抗指纹高分子板（柜门）", "高致密哑光通体釉面砖", "防潮防水石膏板吊顶"]
      },
      "书房": {
        title: `${style}·意境知性灵感书房`,
        concept: `旨在创造一个可以深度聚焦与激发创作灵感的多功能弹性工作区。大尺度的悬挑书桌仿佛在空间中飘浮，配合整面长虹玻璃柜，在光影流转中兼顾了隐私与光线的穿透。`,
        colors: ["#ECEAE2", "#D2CEBE", "#5E5A4D", "#22211E"],
        furniture: ["2.4m 悬挑式黑胡桃木原木书桌", "人体工学透气网面皮饰办公椅", "长虹玻璃铝框展示柜", "温暖落日氛围台灯"],
        materials: ["天然黑胡桃实木切片", "超窄铝合金玻璃边框", "意大利高光烤漆背板", "静音吸音壁布饰面"]
      }
    };

    const defaultSpace = mockRenderings[spaceName] || {
      title: `${style}·尊享格调局部空间`,
      concept: `针对${spaceName}进行的独家定制方案。通过考究的尺度划分与精心筛选的主材质，让${style}的精髓在每一寸细节中得到完美舒展，兼备超凡的使用功能与美学艺术体验。`,
      colors: ["#F0ECE3", "#DFD7C7", "#7A6E5C", "#332C24"],
      furniture: ["定制级人体工学高定家具", "轻奢金属边框点缀边柜", "极简线条感空间装饰物"],
      materials: ["精选环保级实木多层板", "新型生态级免维护艺术漆", "高耐磨进口微粒子涂层"]
    };

    return res.json(defaultSpace);
  });

  // 5. Generate Upgrades Endpoint
  app.post("/api/generate-upgrades", async (req, res) => {
    const { selectedLayoutId = "layout_1", style = "现代简约" } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Based on selected layout "${selectedLayoutId}" and style "${style}", ` +
          `generate a detailed material list (at least 6 rows) and mood board concept (with elements and vibe). ` +
          `Return in JSON in Chinese. Output JSON only matching the schema format.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                materials: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING, description: "Category, e.g. 地面/墙面/五金" },
                      name: { type: Type.STRING, description: "Material Item name" },
                      spec: { type: Type.STRING, description: "Specification, model, sizing" },
                      qty: { type: Type.STRING, description: "Estimated quantity needed with units" },
                      unitPrice: { type: Type.NUMBER, description: "Average market price per unit in CNY" },
                      brand: { type: Type.STRING, description: "Recommended high-quality brand name" }
                    },
                    required: ["category", "name", "spec", "qty", "unitPrice", "brand"]
                  }
                },
                moodBoard: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    vibeText: { type: Type.STRING, description: "Description of the sensory vibe of this palette." },
                    elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 key sensory element keywords, e.g. 质朴陶土, 雾面黑钢" }
                  },
                  required: ["title", "vibeText", "elements"]
                }
              },
              required: ["materials", "moodBoard"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
      } catch (err) {
        console.error("Gemini Upgrades Generation failed, using simulation:", err);
      }
    }

    const mockMaterials = [
      { category: "地面主材", name: "微水泥通体大理石大板瓷砖", spec: "750x1500mm 哑光柔抛面", qty: "85 ㎡", unitPrice: 280, brand: "东鹏瓷砖 (DONGPENG)" },
      { category: "墙面主材", name: "微晶艺术乳胶漆 (零醛防霉)", spec: "定制太空灰/燕麦色调色", qty: "220 ㎡", unitPrice: 85, brand: "立邦五代五合一 (NIPPON)" },
      { category: "地面卧室", name: "天然橡木三层实木复合地板", spec: "1200x190x15mm 锁扣拼", qty: "38 ㎡", unitPrice: 420, brand: "圣象地板 (POWERDEKOR)" },
      { category: "高定板材", name: "F4星级高环保免漆饰面板", spec: "18mm 双面同步木纹多层板", qty: "45 张", unitPrice: 310, brand: "兔子王板材 (RABBIT)" },
      { category: "基础辅料", name: "环保水性防潮界面剂胶水", spec: "高渗透无味强化配方", qty: "6 桶", unitPrice: 190, brand: "雨虹防水 (YUHONG)" },
      { category: "高档五金", name: "静音缓冲液压阻尼铰链门吸", spec: "3D 可调重载静音不锈钢", qty: "42 套", unitPrice: 45, brand: "奥地利百隆 (BLUM)" },
      { category: "灯光系统", name: "高显指无主灯嵌入式射灯", spec: "Ra>97 4000K 防眩调光型", qty: "28 盏", unitPrice: 120, brand: "雷士照明 (NVC)" }
    ];

    const mockMoodBoard = {
      title: `${style}·“自然协奏”质感生活情绪板`,
      vibeText: "本方案采用大地色系与低饱和度的灰色作为视觉主干，主张通过丰富的‘触觉温差’来唤醒空间生机。粗粝的微水泥质感与极其细腻的黑砂雾面钢材形成鲜明的冷暖、刚柔冲突，天然橡木的温润油脂感则起到了柔和的承接作用，传递出一种自持、优雅且回归初心的内敛生活格调。",
      elements: ["温润天然白橡木", "触感微水泥涂料", "18k 雾面拉丝香槟金", "高防污透气亚麻面料", "太空灰超柔超细科技皮"]
    };

    return res.json({
      materials: mockMaterials,
      moodBoard: mockMoodBoard
    });
  });

  // 6. Generate Budgets Comparison
  app.post("/api/generate-budgets", async (req, res) => {
    const { style = "现代极简", area = 100 } = req.body;
    const ai = getGeminiClient();

    if (ai) {
      try {
        const prompt = `Based on design style "${style}" and housing area ${area} sqm, ` +
          `generate 3 detailed construction budget options: Economic (经济舒适), Quality (臻选品质), and Luxury (尊享奢华). ` +
          `Include detailed breakdown lists with individual prices for: Demolition, Hard Decoration, Soft Customization, Smart Home, Sanitary & Kitchen Appliances, Design fee. ` +
          `Return in JSON in Chinese. Output JSON only matching the schema format.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                budgets: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, description: "Budget type: e.g. 经济舒适型 / 臻选品质级 / 尊享奢华款" },
                      total: { type: Type.NUMBER, description: "Total budget sum in CNY" },
                      items: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            name: { type: Type.STRING, description: "Budget block, e.g. 拆改及水电工程" },
                            cost: { type: Type.NUMBER, description: "Allocated cost in CNY" },
                            desc: { type: Type.STRING, description: "Brief specification details, e.g. 普乐美水管, 德力西开关" }
                          },
                          required: ["name", "cost", "desc"]
                        }
                      }
                    },
                    required: ["type", "total", "items"]
                  }
                }
              },
              required: ["budgets"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
      } catch (err) {
        console.error("Gemini Budget Generation failed, using simulation:", err);
      }
    }

    const mockBudgets = [
      {
        type: "经济舒适型 (Eco-Comfort)",
        total: Math.round(area * 1500),
        items: [
          { name: "硬装基础施工 (水电泥木)", cost: Math.round(area * 550), desc: "环保免检水泥黄沙，知名国标PPR水管与国标阻燃电线，全屋防水防潮涂装。" },
          { name: "主材主料配置 (地板瓷砖)", cost: Math.round(area * 350), desc: "国内一线品牌精工瓷砖(800x800)，E1级环保复合木地板，静音环保木门。" },
          { name: "定制柜体家具 (收纳高定)", cost: Math.round(area * 300), desc: "精选万华禾香板全屋柜体定制，隐藏拉手，百隆液压阻尼静音铰链配件。" },
          { name: "智能五金与灯光系统", cost: Math.round(area * 120), desc: "全屋高显指双重防眩 LED 无主灯射灯，智能指纹电子门锁。" },
          { name: "高性价比全屋卫浴洁具", cost: Math.round(area * 100), desc: "恒温防烫手持花洒，防雾超薄美妆浴室镜柜，静音虹吸防臭马桶。" },
          { name: "全案空间创意设计费", cost: Math.round(area * 80), desc: "优秀主案设计师全案深度规划，包含平面布局及硬装施工图指引。" }
        ]
      },
      {
        type: "臻选全屋定制级 (Quality Custom)",
        total: Math.round(area * 2800),
        items: [
          { name: "硬装基础施工 (精工交付)", cost: Math.round(area * 850), desc: "德国进口微卡阻燃线管，WAGO万可接线端子，雨虹超柔耐用双组份防水堵漏。" },
          { name: "中高端进口/合资主材", cost: Math.round(area * 650), desc: "1200x2400 哑光通体釉大板瓷砖，三层实木进口锁扣地板，定制隐形超高门。" },
          { name: "全屋高定PET门板柜体", cost: Math.round(area * 600), desc: "爱格板/克诺斯邦欧标环保板材，超感PET肤感门板，海蒂诗奢华轨道系统。" },
          { name: "全屋智能中控与光环境", cost: Math.round(area * 250), desc: "米家/欧瑞博智能家居全屋控制，电动梦幻帘，全色温智能无级调光系统。" },
          { name: "大牌卫浴及厨电深度集成", cost: Math.round(area * 250), desc: "TOTO/科勒智能一体化壁挂马桶，恒温雨淋系统，定制防油烟大吸力集成灶。" },
          { name: "资深总监级全案空间美学设计", cost: Math.round(area * 200), desc: "资深设计总监亲笔。提供 3D 全景效果渲染，材料样品板拼搭，硬装主材全程陪同选样。" }
        ]
      },
      {
        type: "奢华全案尊享款 (Luxury Bespoke)",
        total: Math.round(area * 4500),
        items: [
          { name: "德系金牌生态施工工艺", cost: Math.round(area * 1200), desc: "德标金牌金手指工艺，全屋进口无醛墙衬，铜水管热熔双向熔合工艺，顶面双层石膏板防裂。" },
          { name: "欧洲纯进口超豪华主材", cost: Math.round(area * 1100), desc: "意大利原产超薄岩板大板(1600x3200)，瑞典纯进口奢华三层实木鱼骨拼，超静音隐形幽灵门。" },
          { name: "大牌高定金属皮革工艺柜体", cost: Math.round(area * 1000), desc: "意大利顶级柜体工艺，玻璃烤漆拉丝铝框隔断，高定真皮衬垫衣帽间，萨莱尼顶级重载滑轨。" },
          { name: "全屋无线智能控制系统", cost: Math.round(area * 450), desc: "Control4 或 摩根全屋高定KNX有线智能控制，多维温湿度新风除湿一体智控。" },
          { name: "奢牌艺术级卫浴科技洁具", cost: Math.round(area * 450), desc: "杜拉维特/汉斯格雅艺术浴缸，智臻全功能体感智能马桶，高定超薄嵌入式大理石台盆。" },
          { name: "大师工作室全案美学高定设计", cost: Math.round(area * 300), desc: "设计大师工作室定制案，包含详尽色彩情绪分析、全套声光学规划，全套高精度效果，项目现场常驻总监监理。" }
        ]
      }
    ];

    return res.json({ budgets: mockBudgets });
  });

  // ----------------------------------------------------------------------
  // Vite Middleware / SPA fallback
  // ----------------------------------------------------------------------

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Ready! running on http://localhost:${PORT}`);
  });
}

startServer();
