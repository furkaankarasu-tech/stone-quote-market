import { trGuides, type GuideArticle } from './guideContent';
import type { GuideLocale } from './guideRoutes';
export { guideLocales, guidePath, allGuideAlternates } from './guideRoutes';
export type { GuideLocale } from './guideRoutes';

export const guideSlugs = trGuides.map((guide) => guide.slug);

// Pages are translated editorial content, not client-side machine translation or Turkish fallbacks.
// Slugs remain stable across locales so changing language keeps readers on the same subject.
const enGuides: GuideArticle[] = [
  {
    slug: 'afyon-mermeri', title: 'Afyon Marble: Types, Colours and Selection Guide',
    description: 'Compare Afyon White, Sugar, Violet and Grey marble. Learn what to verify when choosing slabs or blocks and requesting a quotation.',
    summary: 'A practical guide to evaluating Afyon marble by appearance, format, finish and project specifications.', readingTime: '6 min', relatedStones: [],
    sections: [
      {heading: 'Why does Afyon marble come in different varieties?', paragraphs: [
        'Afyonkarahisar is an established natural-stone production area in Türkiye. Afyon marble is not a single fixed colour or product: appearance can vary between quarries, layers and production lots.',
        'A commercial name is a useful starting point, but request current slab or block photographs and, where possible, a representative sample before approving an order.'
      ]},
      {heading: 'Recognising commonly traded appearances', paragraphs: [
        'Afyon White and Afyon Sugar are names buyers may encounter while researching light-coloured stones. Afyon Violet is associated with pronounced purple veining, while Afyon Grey is an option for grey-toned projects.',
        'Trade names alone do not guarantee colour consistency, quality, stock or pricing. Compare the material from the specific production lot offered.'
      ]},
      {heading: 'Choosing blocks, slabs and cut-to-size products', paragraphs: [
        'Blocks suit buyers with processing capacity and a cutting plan. Slabs make it easier to inspect veining before cutting. Cut-to-size orders require approved drawings, dimensions, tolerances and packaging instructions.'
      ]},
      {heading: 'What to ask before requesting a quote', paragraphs: [
        'Compare offers using the same quantity, measurement unit, finish and delivery scope. Confirm actual production-lot availability rather than relying on illustrative catalogue textures.'
      ], bullets: ['Current lot photographs and, where feasible, an approved sample', 'Dimensions, thickness, tolerances and quantity', 'Required finish and relevant technical test documents', 'Packing, delivery schedule and transport terms']},
      {heading: 'Final checks before ordering', paragraphs: [
        'Ask the seller to confirm the exact material, format, lot, documentation and destination in writing. A trade name or sample texture is not an order confirmation.'
      ]}
    ]
  },
  {
    slug: 'mermer-blok-plaka', title: 'Marble Blocks vs Slabs: A Practical Buying Guide',
    description: 'Understand the differences between marble blocks, slabs and cut-to-size stone, including processing, inspection, dimensions and delivery.',
    summary: 'Compare stone formats and the technical details that matter before placing an order.', readingTime: '5 min', relatedStones: [],
    sections: [
      {heading: 'What is a marble block?', paragraphs: [
        'A block is a large piece of stone extracted from a quarry before final processing. Value depends not only on dimensions, but also on visible defects, internal structure, vein direction and the intended cutting plan.',
        'Request exact dimensions, weight or volume, clear images of each face and information about loading and transportation.'
      ]},
      {heading: 'When should you buy marble slabs?', paragraphs: [
        'Slabs are broad surfaces cut from blocks. They let designers and buyers assess veining, usable area and the sequence of adjoining pieces before final fabrication.',
        'Confirm thickness, usable dimensions, finish and lot consistency. If bookmatching matters, agree on the layout before cutting.'
      ]},
      {heading: 'Choosing cut-to-size stone', paragraphs: [
        'Cut-to-size products are prepared to specified project dimensions. Agree on approved drawings, edge treatments, tolerances, labelling and protective packaging before production begins.'
      ]},
      {heading: 'Compare like-for-like quotations', paragraphs: [
        'Blocks, slabs and finished pieces represent different processing stages. A price per cubic metre, tonne or square metre cannot be compared without checking the specification and included services.'
      ], bullets: ['Blocks: processing capacity, defects and transport', 'Slabs: appearance, usable area and consistency', 'Cut-to-size: drawings, tolerances and piece-by-piece packing']},
      {heading: 'Final purchasing checklist', paragraphs: [
        'Confirm who is responsible for cutting, testing, insurance, packing, loading and delivery. Use a written quotation with clear measurement units.'
      ]}
    ]
  },
  {
    slug: 'turkiye-mermer-cesitleri', title: 'Turkish Marble Varieties: Regions, Colours and Selection',
    description: 'Research natural stone from Afyon, Burdur, Bilecik, Muğla, Marmara and Denizli. Learn to compare marble and travertine.',
    summary: 'An introduction to regional Turkish natural stones, their appearance and the questions to ask suppliers.', readingTime: '7 min', relatedStones: [],
    sections: [
      {heading: 'Turkish natural stone is not one uniform product', paragraphs: [
        'Natural stone from Türkiye ranges from light white and beige to grey and strongly veined appearances. A regional or commercial name can describe an appearance, but is not a complete technical specification.',
        'Start with the intended application, desired visual range, quantity and format. Evaluate maintenance and performance needs as well as appearance.'
      ]},
      {heading: 'Afyon and other light-coloured options', paragraphs: [
        'Afyon White and Afyon Sugar are commonly researched for light-coloured projects, while Afyon Violet has prominent veining and Afyon Grey offers a different tonal direction. Muğla White is another name buyers may encounter.',
        'Actual patterns and technical properties vary; inspect the offered production lot and supporting documents.'
      ]},
      {heading: 'Burdur, Bilecik and Marmara', paragraphs: [
        'Burdur Beige and Bilecik Beige are commercial names worth comparing when considering beige tones. Marmara White is known for its linear veining.',
        'Check whether adjoining slabs will match visually and whether the quantity and format you need are available.'
      ]},
      {heading: 'Travertine is a different stone category', paragraphs: [
        'Denizli travertine is often listed beside marble, but it has a different formation and characteristic porous appearance. Ask about filling, finishing, maintenance and application-specific performance.'
      ]},
      {heading: 'How to narrow your selection', paragraphs: [
        'Use the project specification rather than commercial names alone. Verify sample approval, actual lot photographs and delivery terms.'
      ], bullets: ['Application and required performance', 'Current production-lot photos and sample', 'Stone type, finish, thickness and tolerances', 'Relevant tests, packing and delivery conditions']}
    ]
  },
  {
    slug: 'mermer-satin-alma', title: 'How to Buy Marble: A Step-by-Step Buyer Guide',
    description: 'Learn where to buy marble, how to calculate quantities, select samples and compare written quotations for natural stone.',
    summary: 'From application and measurements to supplier quotations and delivery: essential steps for buying marble.', readingTime: '8 min', relatedStones: [],
    sections: [
      {heading: 'Define your project before shopping', paragraphs: [
        'Clarify whether the stone will be used indoors or outdoors and for floors, walls or another application. Required performance depends on the location and intensity of use.',
        'Prepare drawings, dimensions, the desired vein direction and finishing requirements. An approximate area alone is rarely enough for comparable offers.'
      ]},
      {heading: 'Where can you buy marble?', paragraphs: [
        'Buyers may approach quarry operators, processing factories, project suppliers or retail natural-stone merchants. The right channel depends on quantity, processing needs and delivery location.',
        'Verify the seller’s actual capabilities and whether they can provide the requested format and documentation.'
      ]},
      {heading: 'Measure the required quantity', paragraphs: [
        'Calculate rectangular surfaces by multiplying length by width and add separate areas together. Stairs, skirting and vein-matched designs require additional planning.',
        'There is no universal waste percentage for every project. Agree on a cutting plan and final order quantity with the installer.'
      ]},
      {heading: 'Inspect samples, finishes and test reports', paragraphs: [
        'Natural stone varies from lot to lot. Request recent full-slab images and, when possible, a sample from the material to be supplied.',
        'Confirm whether polished, honed or other finishes suit the application. Obtain relevant test results where the project specification requires them.'
      ]},
      {heading: 'Compare written quotations on equal terms', paragraphs: [
        'Compare the same dimensions, thickness, grade or approved lot, processing scope and measurement unit. Include packing, taxes, transport and delivery responsibilities.'
      ], bullets: ['Stone type, application and technical specification', 'Approved lot, sample, thickness, finish and quantity', 'Cutting plan, tolerances and vein matching', 'Packing, delivery date, currency and total cost']}
    ]
  },
  {
    slug: 'mermer-fiyatlari', title: 'Marble Prices: What Determines the Cost?',
    description: 'Learn how stone type, thickness, finish, fabrication, quantity and freight affect marble quotations without relying on misleading flat prices.',
    summary: 'Understand which specifications matter when comparing marble prices per square metre and other pricing units.', readingTime: '7 min', relatedStones: [],
    sections: [
      {heading: 'Why is there no single marble price?', paragraphs: [
        'The same trade name can cover different lots, dimensions, thicknesses and finishes. Processing, packaging and delivery can also change the total cost.',
        'Treat an advertised unit price as an indication only until the seller confirms a complete written specification.'
      ]},
      {heading: 'How measurement units affect price', paragraphs: [
        'Blocks may be quoted by cubic metre or tonne; slabs and finished pieces may be quoted by square metre or piece. These prices are not directly comparable.',
        'Confirm the billable unit, usable quantity, tolerances and whether fabrication or losses are included.'
      ]},
      {heading: 'Thickness, finish and fabrication', paragraphs: [
        'Greater thickness, detailed edge work, surface processing, pattern matching and complex cuts may affect material usage and production cost. Ask what each quote actually includes.'
      ]},
      {heading: 'Freight and delivery terms', paragraphs: [
        'Natural stone is heavy and may require specialised packing or lifting. The destination, loading method, insurance, export requirements and agreed delivery terms can materially change total costs.'
      ]},
      {heading: 'A fair quotation comparison', paragraphs: [
        'Place competing offers side by side and compare the full scope, payment terms, schedule and procedures for damaged or nonconforming material.'
      ], bullets: ['Approved material and production lot', 'Unit, dimensions, thickness and usable quantity', 'Finish, fabrication and protective packing', 'Currency, taxes, payment, freight and delivery timing']}
    ]
  },
  {
    slug: 'mermer-cesitleri-kullanim-alanlari', title: 'Marble Types and Uses: White, Beige and Grey Stone',
    description: 'Explore marble colour groups, interior and exterior uses, surface finishes and practical material selection criteria.',
    summary: 'Understand how appearance, finish, care and technical requirements influence marble selection.', readingTime: '6 min', relatedStones: [],
    sections: [
      {heading: 'Choosing marble by colour and pattern', paragraphs: [
        'White, beige, grey and strongly veined stones suit different design objectives. Colour by itself does not describe strength, durability or suitability for a particular use.',
        'For large projects, inspect full-size slabs from the available lot alongside small samples.'
      ]},
      {heading: 'Floors and wall cladding', paragraphs: [
        'Floors face different wear and slip conditions from interior wall cladding. Confirm the project’s performance requirements, support system and installation plan with a qualified professional.'
      ]},
      {heading: 'Kitchens, bathrooms and wet areas', paragraphs: [
        'Some marble surfaces are sensitive to acids and staining. Evaluate cleaning habits, surface protection and maintenance expectations.',
        'For wet environments, check the specified finish and project-specific slip and water-exposure requirements.'
      ]},
      {heading: 'Polished, honed and textured finishes', paragraphs: [
        'Polishing usually produces a shinier appearance; honing produces a more matte look. Textured finishes can alter visual and contact properties. No one finish suits every application.'
      ]},
      {heading: 'Five questions before selecting stone', paragraphs: [
        'Balance design goals against real project requirements, technical evidence and long-term care.'
      ], bullets: ['Where and how will the stone be used?', 'Does the current lot match the required colour and veining?', 'What size, thickness and finish are needed?', 'Which test documents are required?', 'What are the long-term maintenance expectations?']}
    ]
  },
];

const zhGuides: GuideArticle[] = [
  {
    slug: 'afyon-mermeri', title: '阿菲永大理石：品种、颜色与选购指南',
    description: '了解阿菲永白、糖白、紫纹和灰色大理石，掌握选购荒料、板材及询价前的核对要点。',
    summary: '根据纹理、规格、表面处理和项目要求选择合适的阿菲永大理石。', readingTime: '约6分钟', relatedStones: [],
    sections: [
      {heading:'为什么阿菲永大理石有多种外观？', paragraphs:['阿菲永卡拉希萨尔是土耳其重要的天然石材产区。同一地区的石材也会因采石场、矿层和生产批次不同而呈现不同色调与纹理。','商业名称只能作为初步参考，下单前应要求查看当前批次的整板或荒料照片，并尽可能确认实物样品。']},
      {heading:'常见商业品种', paragraphs:['阿菲永白与糖白适合比较浅色石材方案；阿菲永紫纹以较明显的紫色纹路为特点；阿菲永灰可用于研究灰色系项目。','商业名称不代表固定的颜色、等级、现货数量或价格，应以供应商实际提供的批次为准。']},
      {heading:'荒料、板材和定尺产品如何选择？', paragraphs:['具备切割能力的采购方可以考虑荒料；板材便于在加工前检查纹理及排版；定尺产品则需要确认施工图、尺寸公差、边缘处理和包装。']},
      {heading:'询价前应确认什么？', paragraphs:['只有在规格、数量、计价单位、表面处理与交货范围一致时，不同报价才有可比性。不要把展示纹理图当成真实库存证明。'],bullets:['当前生产批次的照片与可确认的样品','数量、尺寸、厚度及公差','表面处理和项目所需的检测文件','包装、交货时间与运输条款']},
      {heading:'订购前的最终检查', paragraphs:['要求卖方书面确认具体材料、批次、规格、技术文件和目的地。只有明确的订单条件才能作为交易依据。']}
    ]
  },
  {
    slug: 'mermer-blok-plaka', title: '大理石荒料与板材：采购区别及选择指南',
    description: '了解荒料、板材与定尺产品的区别，以及加工能力、尺寸检验和物流方面的重要事项。',
    summary: '按加工条件与项目需求选择石材形式，并学会核对不同形式的报价。', readingTime: '约5分钟', relatedStones: [],
    sections: [
      {heading:'什么是大理石荒料？', paragraphs:['荒料是从采石场开采、尚未加工成最终尺寸的大块石材。除了体积，还应评估裂纹、内部结构、纹理方向和预计切割方案。','询价时应取得准确尺寸、重量或体积、各面照片以及装卸运输信息。']},
      {heading:'何时选用大理石大板？', paragraphs:['大板由荒料切割而成，方便检查整体纹理、可用面积及相邻板材的连续性。签单前确认厚度、尺寸、表面处理和实际批次。']},
      {heading:'定尺产品适合哪些项目？', paragraphs:['定尺石材按项目尺寸预先加工。生产前应确认施工图、边缘处理、尺寸公差、标签及保护性包装，以免现场出现不匹配。']},
      {heading:'不要直接比较不同计价单位', paragraphs:['荒料、大板与成品的加工范围不同，立方米、吨、平方米或件的单价不能直接对比。需要先确认加工、运输和材料可用量。'],bullets:['荒料：切割能力、可见瑕疵和物流','大板：纹理、可用面积与批次一致性','定尺产品：图纸、公差与分件包装']},
      {heading:'采购前核对事项', paragraphs:['明确由谁负责切割、检测、保险、包装、装货和交付，并取得注明单位与范围的书面报价。']}
    ]
  },
  {
    slug: 'turkiye-mermer-cesitleri', title: '土耳其大理石种类：产区、颜色与选材指南',
    description: '认识阿菲永、布尔杜尔、比莱吉克、穆拉、马尔马拉及代尼兹利等产区的天然石材。',
    summary: '比较土耳其各地区的天然石材，了解采购前应核实的外观和技术条件。', readingTime: '约7分钟', relatedStones: [],
    sections: [
      {heading:'土耳其天然石材并不是单一产品', paragraphs:['土耳其天然石材具有白色、米色、灰色和多种纹理。产区或商业名称能帮助初筛，但不能代替实际批次照片、样品和技术资料。','先明确应用场景、颜色范围、采购数量、规格以及维护和性能要求。']},
      {heading:'阿菲永及其他浅色品种', paragraphs:['阿菲永白与糖白可用于浅色项目的选材比较，阿菲永紫纹有明显纹理，阿菲永灰可用于灰色系方案；穆拉白也是常见的浅色商业品种。','实际纹理和技术性能应以具体批次为准。']},
      {heading:'布尔杜尔、比莱吉克与马尔马拉', paragraphs:['布尔杜尔米黄和比莱吉克米黄适合研究米色系石材；马尔马拉白常见条状纹理。相邻大板的颜色和纹路是否连续，应在下单前检查。']},
      {heading:'洞石与大理石不同', paragraphs:['代尼兹利洞石经常与大理石同时销售，但地质形成和多孔外观不同。应根据应用环境考虑填孔、表面处理、维护和技术指标。']},
      {heading:'如何缩小选择范围？', paragraphs:['依据项目技术规格而不是仅凭商业名称作出决定，并核对样品、照片与交货范围。'],bullets:['用途与性能要求','当前批次照片和实物样品','石材类型、厚度、表面处理和公差','所需检测报告、包装与交货条件']}
    ]
  },
  {
    slug: 'mermer-satin-alma', title: '如何购买大理石：从选材到询价的完整指南',
    description: '了解大理石采购渠道、面积计算、样品选择、技术文件与报价比较的关键步骤。',
    summary: '从项目用途和测量到供应商报价及交付，掌握实用的大理石采购流程。', readingTime: '约8分钟', relatedStones: [],
    sections: [
      {heading:'采购前明确项目需求', paragraphs:['确定石材用于室内还是室外、地面还是墙面，以及实际使用强度。不同用途所需性能不同。','准备施工图、尺寸、纹理方向和表面处理要求，以便获得范围一致的报价。']},
      {heading:'从哪里购买大理石？', paragraphs:['可以向采石场、加工厂、项目供应商或天然石材零售商采购。合适的渠道取决于数量、加工要求和交货地点。','下单前应核实卖方的实际生产或供货能力。']},
      {heading:'如何计算采购面积与数量？', paragraphs:['矩形面积通常为长乘宽，多块区域应分别测量并相加。楼梯、踢脚线及纹理拼接可能需要额外的切割规划。','没有适合所有项目的统一损耗比例，应和施工人员一起确认切割方案。']},
      {heading:'检查样品、表面处理与检测报告', paragraphs:['天然石材在不同批次之间存在色差与纹理变化。尽可能获取当前批次的整板图片与样品。','根据使用位置选择抛光、哑光等处理，并取得项目要求的技术检测文件。']},
      {heading:'按相同条件比较书面报价', paragraphs:['不同报价应采用一致的材料、尺寸、厚度、加工范围和计量单位，另外注明包装、税费、运费与交货责任。'],bullets:['材料、用途与技术要求','批次、样品、厚度、处理与数量','切割图、公差与纹理拼接','包装、交期、币种和总成本']}
    ]
  },
  {
    slug: 'mermer-fiyatlari', title: '大理石价格如何计算？影响报价的关键因素',
    description: '了解石材种类、厚度、加工、采购量与运输如何影响大理石单价和总成本。',
    summary: '学会比较每平方米等不同计价方式，避免只看表面单价。', readingTime: '约7分钟', relatedStones: [],
    sections: [
      {heading:'为什么大理石没有统一价格？', paragraphs:['即使商业名称相同，不同批次、厚度、规格、表面处理和交付方式也会影响实际价格。','未确认完整规格的宣传单价只能作为初步参考。']},
      {heading:'计价单位如何影响报价？', paragraphs:['荒料可能按立方米或吨报价，大板或成品可能按平方米或件报价。不同单位不能直接比较，应确认可用数量及加工范围。']},
      {heading:'厚度、表面与加工成本', paragraphs:['厚度、边缘加工、表面处理、纹理拼接及复杂切割都会影响材料损耗和加工工作量。要求报价明确列出包含的服务。']},
      {heading:'运输与交付条款', paragraphs:['石材较重，可能需要特殊包装和装卸。目的地、保险、出口手续与约定的交付条件都会影响总成本。']},
      {heading:'如何公平比较不同报价？', paragraphs:['将材料、付款方式、交期、破损处理和交付范围列在同一张比较表中。'],bullets:['确认材料与生产批次','单位、尺寸、厚度与可用数量','加工、表面处理与包装','币种、税费、付款、运输和交期']}
    ]
  },
  {
    slug: 'mermer-cesitleri-kullanim-alanlari', title: '大理石种类与应用：白色、米色和灰色石材',
    description: '了解不同颜色大理石的应用、表面处理、保养方式及技术选材要求。',
    summary: '综合外观、使用场景、维护和技术指标选择天然石材。', readingTime: '约6分钟', relatedStones: [],
    sections: [
      {heading:'按颜色与纹理选择石材', paragraphs:['白色、米色、灰色与明显纹理的石材适用于不同设计目标，但颜色本身不能说明强度或适用性。','大型项目除小样外，还应检查实际批次的整板照片。']},
      {heading:'地面与墙面有什么不同？', paragraphs:['地面需要考虑磨损和防滑要求，墙面则需要考虑基层、固定方式和板材尺寸。请专业人员确认具体项目的技术指标。']},
      {heading:'厨房、浴室与潮湿环境', paragraphs:['部分大理石对酸性物质和污渍较敏感。选材时应同时考虑清洁方式、表面保护和维护成本。潮湿区域还应关注相应的防滑性能。']},
      {heading:'抛光、哑光和纹理表面', paragraphs:['抛光通常更有光泽，哑光处理视觉上更柔和。不同表面处理会改变外观和接触特性，不存在适合所有用途的唯一方案。']},
      {heading:'选材前的五个问题', paragraphs:['在美观、技术要求和长期维护之间取得平衡。'],bullets:['石材将用于哪里？','实际批次的颜色和纹理是否符合要求？','需要什么尺寸、厚度和表面处理？','项目要求哪些检测文件？','长期保养和清洁如何进行？']}
    ]
  }
];

const arGuides: GuideArticle[] = [
  {
    slug:'afyon-mermeri', title:'رخام أفيون: الأنواع والألوان ودليل الاختيار',
    description:'تعرف على رخام أفيون الأبيض وسوغر وفيوليت والرمادي، وما ينبغي التحقق منه قبل شراء الكتل أو الألواح.',
    summary:'دليل عملي لمقارنة رخام أفيون بحسب الشكل والمقاس والتشطيب ومتطلبات المشروع.', readingTime:'6 دقائق', relatedStones:[],
    sections:[
      {heading:'لماذا يتوفر رخام أفيون بأشكال متعددة؟', paragraphs:['أفيون قره حصار من مناطق إنتاج الحجر الطبيعي المعروفة في تركيا. ولا يشير اسم رخام أفيون إلى لون واحد؛ فقد يختلف المظهر باختلاف المحجر والطبقة ودفعة الإنتاج.','الاسم التجاري نقطة بداية فقط. اطلب صور الألواح أو الكتل من الدفعة الحالية وعينة فعلية كلما أمكن قبل تأكيد الطلب.']},
      {heading:'أبرز الأنواع التجارية', paragraphs:['يمكن مقارنة أفيون وايت وأفيون سوغر عند البحث عن الألوان الفاتحة. ويتميز أفيون فيوليت بعروق بنفسجية ظاهرة، بينما يناسب أفيون غراي من يبحث عن درجات رمادية.','لا يضمن الاسم التجاري ثبات اللون أو الجودة أو توفر المخزون أو السعر، لذا تحقق من الدفعة المعروضة.']},
      {heading:'كيف تختار بين الكتل والألواح والقطع الجاهزة؟', paragraphs:['تناسب الكتل المشترين القادرين على القص ولديهم خطة إنتاج. وتتيح الألواح فحص العروق قبل التصنيع، بينما تتطلب القطع الجاهزة رسومات معتمدة ومقاسات وتفاوتات وتغليفا واضحا.']},
      {heading:'معلومات مطلوبة قبل عرض السعر', paragraphs:['قارن العروض فقط عندما تتطابق الكمية ووحدة القياس والتشطيب وشروط التسليم. الصور التوضيحية ليست إثباتا للمخزون الحالي.'], bullets:['صور دفعة الإنتاج الحالية وعينة معتمدة إن أمكن','المقاسات والسماكة والتفاوتات والكمية','التشطيب وتقارير الاختبار المطلوبة للمشروع','التغليف والموعد وشروط النقل والتسليم']},
      {heading:'الفحص الأخير قبل الشراء', paragraphs:['اطلب من المورد تأكيدا كتابيا لنوع الحجر والدفعة والشكل والمستندات ومكان التسليم. لا تعتمد على الاسم أو صورة خامة وحدهما.']}
    ]
  },
  {
    slug:'mermer-blok-plaka', title:'كتل الرخام أم الألواح؟ دليل الشراء والمقارنة',
    description:'اكتشف الفرق بين كتل الرخام والألواح والقطع حسب المقاس، ومتطلبات التصنيع والفحص والنقل.',
    summary:'اختر شكل الحجر المناسب لمشروعك وقارن عروض الأسعار بشروط واضحة.', readingTime:'5 دقائق', relatedStones:[],
    sections:[
      {heading:'ما هي كتلة الرخام؟', paragraphs:['الكتلة حجر كبير يستخرج من المحجر قبل القص النهائي. وتعتمد قيمتها على العيوب الظاهرة والبنية واتجاه العروق وخطة القص، وليس على الأبعاد وحدها.','اطلب قياسات دقيقة ووزنا أو حجما وصورا لجميع الجوانب وتفاصيل التحميل والنقل.']},
      {heading:'متى تختار ألواح الرخام؟', paragraphs:['الألواح أسطح واسعة تقطع من الكتل وتتيح فحص العروق ومساحة الاستخدام وتناسق القطع قبل التصنيع.','تأكد من السماكة والأبعاد الصالحة للاستخدام والتشطيب وتجانس دفعة الإنتاج.']},
      {heading:'المنتجات المقطوعة حسب الطلب', paragraphs:['تنتج هذه القطع وفقا لمقاسات المشروع. يجب الاتفاق مسبقا على الرسومات ومعالجة الحواف والتفاوتات وترقيم القطع والتغليف الواقي.']},
      {heading:'قارن عروض الأسعار على أساس واحد', paragraphs:['تختلف مراحل تصنيع الكتل والألواح والقطع الجاهزة. لا تقارن أسعار المتر المكعب والطن والمتر المربع مباشرة قبل تحديد نطاق الخدمات والكمية القابلة للاستخدام.'], bullets:['الكتل: القدرة على القص والعيوب والنقل','الألواح: العروق والمساحة وتناسق الدفعة','القطع الجاهزة: الرسومات والتفاوتات والتغليف']},
      {heading:'قائمة التحقق قبل الشراء', paragraphs:['حدد كتابة مسؤوليات القص والفحص والتأمين والتعبئة والتحميل والتسليم، وتأكد من وضوح وحدة القياس.']}
    ]
  },
  {
    slug:'turkiye-mermer-cesitleri', title:'أنواع الرخام التركي: المناطق والألوان ودليل الاختيار',
    description:'تعرف على الأحجار الطبيعية من أفيون وبوردور وبيلجيك وموغلا ومرمرة والترافرتين من دنيزلي.',
    summary:'مقدمة للمشترين عن الأحجار التركية واختلافاتها وكيفية التحقق من العينات والمواصفات.', readingTime:'7 دقائق', relatedStones:[],
    sections:[
      {heading:'الحجر الطبيعي التركي ليس منتجا واحدا', paragraphs:['تتنوع الأحجار الطبيعية في تركيا بين الأبيض والبيج والرمادي والأنماط ذات العروق البارزة. ولا يحل الاسم التجاري أو اسم المنطقة محل صور الدفعة الفعلية والتقارير الفنية.','حدد مكان الاستخدام والنطاق اللوني والكمية والشكل المطلوب قبل المقارنة.']},
      {heading:'أفيون والخيارات فاتحة اللون', paragraphs:['يمكن دراسة أفيون وايت وسوغر للمشاريع الفاتحة، وأفيون فيوليت للعروق البارزة وأفيون غراي للدرجات الرمادية. ويعد موغلا وايت خيارا آخر للبحث.','تحقق من المظهر الفعلي والخصائص الفنية للدفعة المتاحة.']},
      {heading:'بوردور وبيلجيك ومرمرة', paragraphs:['من الأسماء المتداولة للدرجات البيج بوردور بيج وبيلجيك بيج. ويشتهر مرمرة وايت بالعروق الخطية. افحص توافق الألواح المتجاورة وتوفر الكمية المطلوبة.']},
      {heading:'الترافرتين فئة مختلفة من الحجر', paragraphs:['يباع ترافرتين دنيزلي غالبا إلى جانب الرخام لكنه يختلف في تكوينه ومظهره المسامي. راجع الحشو والتشطيب والصيانة ومتطلبات الأداء وفق مكان التركيب.']},
      {heading:'كيف تضيق خياراتك؟', paragraphs:['اجعل مواصفات المشروع والعينات أساس قرارك بدلا من الاعتماد على الأسماء فقط.'], bullets:['الاستخدام والمتطلبات الفنية','صور الدفعة الحالية والعينة','نوع الحجر والتشطيب والسماكة والتفاوتات','تقارير الاختبار والتغليف وشروط التسليم']}
    ]
  },
  {
    slug:'mermer-satin-alma', title:'كيفية شراء الرخام: دليل عملي خطوة بخطوة',
    description:'تعرف على أماكن شراء الرخام وحساب الكميات واختيار العينات ومقارنة عروض الأسعار والتسليم.',
    summary:'خطوات شراء الرخام من تحديد الاستخدام والقياسات حتى التحقق من عرض المورد.', readingTime:'8 دقائق', relatedStones:[],
    sections:[
      {heading:'حدد احتياجات المشروع أولا', paragraphs:['حدد ما إذا كان الحجر للداخل أو الخارج وللأرضيات أو الجدران ودرجة الاستخدام المتوقعة. تختلف متطلبات الأداء بحسب مكان التركيب.','جهز المخططات والأبعاد واتجاه العروق والتشطيب المطلوب للحصول على عروض قابلة للمقارنة.']},
      {heading:'من أين يمكن شراء الرخام؟', paragraphs:['يمكن الشراء من المحاجر أو المصانع أو موردي المشاريع أو تجار الحجر الطبيعي. يعتمد الاختيار على الكمية والتصنيع والموقع.','تحقق من قدرة المورد الفعلية على تقديم الشكل المطلوب والمستندات اللازمة.']},
      {heading:'كيف تحسب المساحة والكمية؟', paragraphs:['احسب مساحة المستطيلات بضرب الطول في العرض واجمع المساحات. تتطلب السلالم والحواف ومطابقة العروق تخطيطا إضافيا.','لا توجد نسبة هدر ثابتة تناسب كل المشاريع، لذا اتفق على خطة القص مع المنفذ.']},
      {heading:'افحص العينات والتشطيبات والتقارير', paragraphs:['تختلف العروق والألوان بين دفعات الحجر الطبيعي. اطلب صور الألواح الكاملة وعينة من الدفعة المعروضة.','اختر التشطيب وفقا للاستخدام واحصل على نتائج الاختبارات المطلوبة في مواصفات المشروع.']},
      {heading:'قارن العروض المكتوبة بشروط متساوية', paragraphs:['قارن نفس الحجر والدفعة والأبعاد والسماكة والتشطيب ووحدة القياس، مع توضيح التعبئة والضرائب والنقل والتسليم.'],bullets:['نوع الحجر والاستخدام والمواصفات','الدفعة والعينة والسماكة والكمية','خطة القص والتفاوتات واتجاه العروق','التعبئة والعملة والموعد والتكلفة الإجمالية']}
    ]
  },
  {
    slug:'mermer-fiyatlari', title:'أسعار الرخام: ما الذي يحدد التكلفة؟',
    description:'تعرف على أثر نوع الحجر والسماكة والتشطيب والتصنيع والنقل في عرض السعر النهائي.',
    summary:'افهم عوامل أسعار المتر المربع وغيرها من الوحدات لتقارن العروض بدقة.', readingTime:'7 دقائق', relatedStones:[],
    sections:[
      {heading:'لماذا لا يوجد سعر موحد للرخام؟', paragraphs:['قد يختلف السعر لنفس الاسم التجاري بحسب الدفعة والمقاس والسماكة والتشطيب والمعالجة والتسليم.','لا تعتبر السعر المعلن نهائيا قبل استلام مواصفات وعرض مكتوبين.']},
      {heading:'تأثير وحدات القياس', paragraphs:['قد تباع الكتل بالمتر المكعب أو الطن وتباع الألواح والقطع بالمتر المربع أو بالقطعة. لا تقارن هذه الوحدات مباشرة دون تحديد كمية الاستخدام والخدمات المشمولة.']},
      {heading:'السماكة والتشطيب والتصنيع', paragraphs:['يمكن أن تؤثر السماكة والتشطيب والحواف ومطابقة العروق والقص المعقد في استخدام المواد وتكلفة العمل. اطلب تفصيلا لنطاق كل عرض.']},
      {heading:'الشحن وشروط التسليم', paragraphs:['الحجر ثقيل وقد يحتاج إلى تغليف ورفع متخصصين. تؤثر الوجهة والتأمين والتصدير وشروط التسليم المتفق عليها في التكلفة الإجمالية.']},
      {heading:'كيف تقارن العروض بعدل؟', paragraphs:['ضع المواصفات وشروط الدفع والمواعيد وآلية التعامل مع التلف أو عدم المطابقة في جدول واحد.'], bullets:['المادة والدفعة المعتمدة','الوحدة والأبعاد والسماكة والكمية','التشطيب والتصنيع والتغليف','العملة والضرائب والدفع والشحن والموعد']}
    ]
  },
  {
    slug:'mermer-cesitleri-kullanim-alanlari', title:'أنواع الرخام واستخداماتها: الأبيض والبيج والرمادي',
    description:'تعرف على ألوان الرخام وتطبيقاته والتشطيبات والصيانة والمعايير الفنية المناسبة لكل مشروع.',
    summary:'وازن بين المظهر والاستخدام والصيانة والمتطلبات الفنية عند اختيار الحجر الطبيعي.', readingTime:'6 دقائق', relatedStones:[],
    sections:[
      {heading:'اختيار الرخام بحسب اللون والعروق', paragraphs:['تخدم الأحجار البيضاء والبيج والرمادية وذات العروق الواضحة أهدافا تصميمية مختلفة. لكن اللون وحده لا يحدد المتانة أو الملاءمة.','في المشاريع الكبيرة افحص صور الألواح الكاملة من الدفعة الحقيقية إلى جانب العينات الصغيرة.']},
      {heading:'الأرضيات وتكسية الجدران', paragraphs:['تختلف شروط التآكل والانزلاق في الأرضيات عن شروط الجدران. حدد متطلبات الأداء ونظام التثبيت والأبعاد مع المختصين.']},
      {heading:'المطابخ والحمامات والمناطق الرطبة', paragraphs:['قد تتأثر بعض أنواع الرخام بالأحماض والبقع. ضع التنظيف والحماية والصيانة في الاعتبار. راجع كذلك شروط مقاومة الانزلاق في المناطق الرطبة.']},
      {heading:'التشطيب المصقول والمطفي والملمس', paragraphs:['يوفر الصقل عادة سطحا أكثر لمعانا بينما يعطي التشطيب المطفي مظهرا أهدأ. تؤثر التشطيبات في المظهر وخصائص اللمس، ولا توجد معالجة واحدة مناسبة لكل التطبيقات.']},
      {heading:'خمسة أسئلة قبل اختيار الحجر', paragraphs:['وازن بين التصميم والمتطلبات الفنية والصيانة طويلة الأمد.'], bullets:['أين سيستخدم الحجر وكيف؟','هل تتوافق ألوان وعروق الدفعة الفعلية مع المطلوب؟','ما المقاس والسماكة والتشطيب المناسب؟','ما تقارير الاختبار المطلوبة؟','ما متطلبات التنظيف والصيانة مستقبلا؟']}
    ]
  }
];

export const localizedGuides: Record<GuideLocale, GuideArticle[]> = { tr: trGuides, en: enGuides, zh: zhGuides, ar: arGuides };
export function getGuides(locale: GuideLocale): GuideArticle[] { return localizedGuides[locale]; }
