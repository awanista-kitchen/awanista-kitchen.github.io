
(function(){
"use strict";
/* ---------- helpers ---------- */
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
const AR_D=['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
const arInt=n=>String(n).replace(/\d/g,d=>AR_D[d]);
const arDec=(v,d)=>{const s=v.toFixed(d);return s.replace(/\d/g,d=>AR_D[d])};
const ar2num=t=>parseInt(String(t).replace(/[٠-٩]/g,d=>AR_D.indexOf(d)).replace(/[^0-9]/g,''))||0;
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches||/[?&#]motion=0/.test(location.search+'#'+location.hash);
const savedTheme=localStorage.getItem('awanista-theme-v3')||'light';
document.documentElement.setAttribute('data-theme',savedTheme);
const themeBtn=$('#theme-btn');
if(themeBtn)themeBtn.addEventListener('click',()=>{
  const nt=document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark';
  document.documentElement.setAttribute('data-theme',nt);
  localStorage.setItem('awanista-theme-v3',nt);
});
$('#yr').textContent=arInt(new Date().getFullYear());
window.addEventListener('error',e=>{window.__lastErr=String(e.message||e)+' @'+String(e.filename||'').split('/').pop()+':'+e.lineno});
function maxY(){return Math.max(0,document.documentElement.scrollHeight-innerHeight)}

/* ---------- page ready (no loading screen) ---------- */
document.body.classList.add('loaded');
const navLogo=$('.logo-img');
if(navLogo)$$('img[data-logo]').forEach(im=>{im.src=navLogo.getAttribute('src')});

/* ---------- NAV: glass bg + active section sync ---------- */
const nav=$('#nav');
const navSecs=['home','store','reviews','contact'].map(id=>document.getElementById(id)).filter(Boolean);
const navLinks=$$('.nav-links a');
function navActive(){
  const shopOpen=document.body.classList.contains('shop-open');
  let cur=null;
  if(shopOpen)cur='store';
  else for(const s of navSecs){if(s.id==='store')continue;if(s.getBoundingClientRect().top<=160)cur=s.id}
  if(cur)navLinks.forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+cur));
}

/* burger + close on link / outside click */
const burger=$('#burger');
burger.addEventListener('click',e=>{e.stopPropagation();document.body.classList.toggle('menu-open')});
$$('.m-menu a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));
document.addEventListener('click',e=>{
  if(document.body.classList.contains('menu-open')&&!e.target.closest('.m-menu')&&!e.target.closest('#burger'))
    document.body.classList.remove('menu-open');
});

/* ---------- REVEALS on scroll ---------- */
const revObs=new IntersectionObserver(es=>{
  es.forEach(en=>{
    if(!en.isIntersecting)return;
    const el=en.target,d=+(el.dataset.delay||0);
    el.style.transitionDelay=d+'ms';
    el.classList.add('in');
    setTimeout(()=>{el.style.transitionDelay='0ms'},d+950);
    revObs.unobserve(el);
  })
},{threshold:.1,rootMargin:'0px 0px -2% 0px'});
$$('[data-rv]').forEach(el=>revObs.observe(el));

/* ---------- PRODUCT ART ---------- */
const GRAD=(id,c1,c2)=>`<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
const ART={
pan:`<svg viewBox="0 0 200 200"><defs>${GRAD('g-pan','#4a3f31','#2c251c')}</defs>
 <rect x="146" y="98" width="50" height="20" rx="10" fill="#c96f4a"/><circle cx="188" cy="108" r="4.5" fill="#f8f3ea"/>
 <circle cx="88" cy="108" r="60" fill="#e4dccd"/><circle cx="88" cy="108" r="52" fill="url(#g-pan)" stroke="#c96f4a" stroke-opacity=".6" stroke-width="2.5"/>
 <circle cx="70" cy="92" r="2" fill="#f2c49b" opacity=".6"/><circle cx="98" cy="84" r="1.6" fill="#f2c49b" opacity=".5"/>
 <circle cx="112" cy="112" r="2.2" fill="#f2c49b" opacity=".55"/><circle cx="78" cy="126" r="1.7" fill="#f2c49b" opacity=".45"/>
 <path d="M52 84 A46 46 0 0 1 96 62" stroke="#fff" stroke-opacity=".18" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`,
knives:`<svg viewBox="0 0 200 200"><defs>${GRAD('g-kn','#eceef1','#a9b1ba')}</defs>
 <g transform="rotate(-16 100 150)"><path d="M100 42 L100 128 L86 128 C84 96 90 64 100 42Z" fill="url(#g-kn)"/><rect x="90" y="128" width="18" height="44" rx="8" fill="#a4713f"/><circle cx="99" cy="140" r="2" fill="#c96f4a"/></g>
 <path d="M100 52 L100 132 L84 132 C82 98 90 70 100 52Z" fill="url(#g-kn)" stroke="#8a7d6b" stroke-width="1"/><rect x="88" y="132" width="22" height="48" rx="9" fill="#a4713f"/><circle cx="99" cy="146" r="2.2" fill="#c96f4a"/>
 <g transform="rotate(16 100 150)"><path d="M100 42 L100 128 L86 128 C84 96 90 64 100 42Z" fill="url(#g-kn)"/><rect x="90" y="128" width="18" height="44" rx="8" fill="#a4713f"/><circle cx="99" cy="140" r="2" fill="#c96f4a"/></g></svg>`,
whisk:`<svg viewBox="0 0 200 200" fill="none" stroke="#c96f4a" stroke-width="7" stroke-linecap="round">
 <path d="M100 26 L100 66"/>
 <path d="M100 66 C90 82 90 124 100 146 C110 124 110 82 100 66 Z"/>
 <path d="M100 66 C78 84 78 120 100 146 C122 120 122 84 100 66 Z"/>
 <path d="M100 66 C66 86 66 116 100 146 C134 116 134 86 100 66 Z" stroke="#e0924f"/></svg>`,
pot:`<svg viewBox="0 0 200 200"><defs>${GRAD('g-po','#fdfaf3','#dcd4c5')}</defs>
 <rect x="36" y="100" width="18" height="13" rx="6" fill="#c96f4a"/><rect x="146" y="100" width="18" height="13" rx="6" fill="#c96f4a"/>
 <rect x="52" y="90" width="96" height="72" rx="14" fill="url(#g-po)" stroke="#e7dfd0"/>
 <rect x="64" y="98" width="11" height="56" rx="5.5" fill="#fff" opacity=".65"/>
 <rect x="46" y="74" width="108" height="20" rx="10" fill="#3a3126"/>
 <circle cx="100" cy="66" r="8" fill="#8a6b25"/></svg>`,
board:`<svg viewBox="0 0 200 200"><defs>${GRAD('g-bo','#d3a567','#a4713f')}</defs>
 <rect x="56" y="44" width="88" height="128" rx="18" fill="url(#g-bo)"/>
 <circle cx="100" cy="62" r="7" fill="#f8f3ea"/>
 <rect x="68" y="80" width="64" height="80" rx="11" fill="none" stroke="#7c5426" stroke-width="2.5" stroke-dasharray="5 6"/>
 <circle cx="90" cy="118" r="14" fill="#d94f3d"/><path d="M90 104 q4 -8 12 -9 q-2 9 -12 9" fill="#8a6b25"/>
 <circle cx="116" cy="136" r="7" fill="#e0924f"/></svg>`,
kettle:`<svg viewBox="0 0 200 200"><defs>${GRAD('g-ke','#fdfaf3','#d5cdbd')}</defs>
 <path d="M140 112 C154 106 158 92 156 78" stroke="url(#g-ke)" stroke-width="10" fill="none" stroke-linecap="round"/>
 <path d="M58 152 C58 104 76 86 100 86 C124 86 142 104 142 152 Z" fill="url(#g-ke)" stroke="#e7dfd0"/>
 <rect x="62" y="152" width="76" height="11" rx="5.5" fill="#a4713f"/>
 <ellipse cx="100" cy="86" rx="20" ry="6" fill="#3a3126"/><circle cx="100" cy="77" r="5.5" fill="#c96f4a"/>
 <path d="M78 90 C68 58 132 58 122 90" stroke="#3a3126" stroke-width="8" fill="none" stroke-linecap="round"/>
 <rect x="72" y="106" width="9" height="36" rx="4.5" fill="#fff" opacity=".6"/></svg>`
};

const MODELS=[
    {img:'img/i002.webp',src:'models/granite-pan.glb',  name:'مقلاية الجرانيت — Evita',   prodName:'طقم حلل Evita الحداد التركي الأصلي', cat:'مقالي',     desc:'من طقم Evita الحداد التركي — جرانيت غير لاصق بيقلل الزيوت وبتوزع الحرارة بالتساوي، الطقم متوفر بـ 3 مقاسات', rate:'4.9', revs:154, specs:['جرانيت غير لاصق','أغطية زجاج حراري','3 مقاسات'], art:'pan'},
    {img:'img/i003.webp',src:'models/cooking-pot.glb', name:'قدر السيراميك — لزينون',   prodName:'طقم حلل سيراميك كوري لزينون - 11 قطعة', cat:'أواني',     desc:'من طقم لزينون السيراميك الكوري — غير لاصق وسهل التنظيف وأغطية زجاج حراري، متوفر بألوان ومقاسات مختلفة', rate:'4.8', revs:142,  specs:['سيراميك عالي الجودة','غطاء زجاج حراري','11 قطعة'], art:'pot'},
    {img:'img/i004.webp',src:'models/frying-pan.glb',  name:'مقلاية الجرانيت — Martev', prodName:'طقم مقالي جرانيت تركي 3 قطع Martev (20/24/28)', cat:'مقالي',     desc:'من طقم Martev التركي — 3 مقاسات وجرانيت تقيل غير لاصق بيوزع الحرارة بالتساوي', rate:'4.8', revs:74,  specs:['3 مقاسات','جرانيت تقيل','غير لاصق'], art:'pan'}
  ];
const products=[
 {img:'img/i005.webp', imgs:['img/i005.webp','img/i006.webp','img/i007.webp','img/i008.webp'],
  cat:'أواني', name:'حلة ضغط NETLON الأصلية - 12 لتر صناعة تركية',
  price:'٣٢٤٩', n:3249, old:'٤٣٢٩', rate:'4.9', revs:88, tag:'خصم 25٪',
  desc:'حلة ضغط NETLON الأصلية — صناعة تركية فائقة الجودة من الوكيل الوحيد في مصر، توفر وقتك ومجهودك في المطبخ وتخلي العزومة تجي على قدّها.\nسعة 12 لتر تناسب العزومات والكميات الكبيرة، بجسم استانلس ستيل قوي ولامع وتصميم مميز بغطاء ومقابض حمراء.\nالمميزات:\nسعة 12 لتر كبيرة تناسب العزومات والكميات الكبيرة.\nنظام غلق وفتح بيد واحدة — اختراع حصري سهل وآمن.\nأعلى درجات الأمان بـ 4 نقاط غلق مع صمام أمان وضغط.\nجسم استانلس ستيل قوي ولامع بهيكل متين يدوم سنين.\nتصميم مميز بغطاء ومقابض حمراء يزيّن مطبخك.\nمنتج أصلي بختم الوكيل وضمانه — جودة إبراهيم حداد، الوكيل الوحيد في مصر.\nسعر تنافسي يجمع بين الجودة والقيمة.\nالشحن متاح لجميع محافظات مصر.\nمتوفرة الآن بكميات محدودة — اطلبيها قبل نفاد الكمية.'},
 {img:'img/i009.webp', imgs:['img/i009.webp','img/i010.webp','img/i011.webp','img/i012.webp'],
  cat:'إكسسوارات', name:'شنطة معالق ARSHIA الألمانية الأصلية - 86 قطعة لـ 12 فرد',
  price:'٧٤٩٩', n:7499, old:'٩٩٩٩', rate:'5.0', revs:47, tag:'خصم 25٪',
  desc:'شنطة معالق ARSHIA الألمانية الأصلية — أناقة وجودة ألمانية تليق بسفرتك وتخلي ضيوفك يتكلموا.\n86 قطعة تكفي 12 فرد بخامة استانلس ستيل 18/10 عالية الجودة وسمك 3 مم، بتصميم دهبي فاخر يجمع بين الأصالة والعملية.\nالمميزات:\nاستانلس ستيل 18/10 أصلي بسمك 3 مم — متين ومقاوم للصدأ ولا يتغير لونه مع الاستخدام.\n86 قطعة كاملة تكفي 12 فرد — كل اللي محتاجاه لسفرة كاملة من أول الشوربة لآخر الحلو.\nشنطة خشبية أنيقة بدرجين لحفظ وتنظيم القطع بأمان وسهولة.\nطلاء دهبي فاخر يضيف لمسة راقية للسفرة اليومية والمناسبات الخاصة.\nهدية مجانية: ملعقة عسل ARSHIA مع كل شنطة.\nضمان الوكيل 25 سنة — جودة ألمانية وراحة بال تدوم سنين.\nمنتج ألماني أصلي من ARSHIA مع كارت ضمان وكتيب استخدام رسمي.\nمحتويات الطقم: 86 قطعة تكفي 12 فرد + ملعقة عسل هدية.\nالشحن متاح لجميع محافظات مصر.\nمتوفر الآن بكميات محدودة — اطلبيه قبل نفاد الكمية.'},
 {img:'img/i013.webp', imgs:['img/i013.webp','img/i014.webp','img/i015.webp'],
  cat:'إكسسوارات', name:'طقم أدوات مطبخ سيليكون بيد خشب مع حامل',
  price:'٨٤٩', n:849, old:'١٢٠٩', rate:'4.9', revs:203, tag:'وصل حديثًا', model:'models/wooden-spatula.glb',
  desc:'طقم عملي وأنيق يجمع بين جودة الخامات والتصميم العصري، ليساعدك في تجهيز وجباتك اليومية مع الحفاظ على ترتيب المطبخ.\nالمميزات:\nسيليكون غذائي عالي الجودة مقاوم للحرارة.\nمناسب للاستخدام مع أواني التيفال والسيراميك والجرانيت دون التسبب في خدوش.\nمقابض خشبية مريحة وثابتة أثناء الاستخدام.\nسهل التنظيف ولا يمتص الروائح أو الألوان.\nحامل أنيق يحافظ على ترتيب الأدوات ويوفر مساحة في المطبخ.\nخامات متينة مناسبة للاستخدام اليومي.\nألوان عصرية تناسب مختلف ديكورات المطابخ.\nمحتويات الطقم: 12 قطعة لتغطية احتياجات الطهي والتقليب والتقديم.\nمتوفر الآن بكميات محدودة، اطلبيه قبل نفاد الكمية.'},
 {img:'img/i002.webp', imgs:['img/i002.webp','img/i034.webp','img/i035.webp','img/i036.webp','img/i034.webp','img/i035.webp'],
  cat:'أواني', name:'طقم حلل Evita الحداد التركي الأصلي',
  price:'٥٥٠٠', n:5500, old:'٧٣٣٣', rate:'4.9', revs:154, tag:'الأكثر مبيعًا',
  opts:[{k:'16 قطعة',n:5500,old:7333},{k:'18 قطعة',n:6500,old:8667},{k:'20 قطعة',n:7500,old:10000}],
  desc:'استمتعي بتجربة طهي احترافية مع طقم حلل Evita الحداد التركي الأصلي، المصمم بجودة عالية ليجمع بين الأداء العملي والتصميم الأنيق، ويمنحك أفضل النتائج في كل استخدام.\nالمميزات:\nطبقة جرانيت غير لاصقة عالية الجودة تقلل استخدام الزيوت وتسهل التنظيف.\nتوزيع متساوٍ للحرارة للحصول على طهي مثالي في وقت أقل.\nخامات متينة تتحمل الاستخدام اليومي وتدوم لسنوات.\nأغطية زجاج حراري لمتابعة الطعام أثناء الطهي.\nمقابض مريحة وعازلة للحرارة لسهولة وأمان الاستخدام.\nمناسب لمعظم أنواع البوتاجازات.\nتصميم تركي عصري يضيف لمسة راقية لمطبخك.\nالمقاسات المتاحة: 16 و18 و20 قطعة — اختار المقاس من أزرار المقاسات قبل ما تضيفه للسلة.\nالأسعار: 16 قطعة ٥٥٠٠ ج.م بدل ٧٣٣٣ — 18 قطعة ٦٥٠٠ ج.م بدل ٨٦٦٧ — 20 قطعة ٧٥٠٠ ج.م بدل ١٠٠٠٠ — خصم 25٪ على كل المقاسات.\nأكواد المنتجات: 1012 (16 قطعة) و1013 (18 قطعة) و1014 (20 قطعة) — اذكر كود الطقم في طلب الواتساب.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i019.webp', imgs:['img/i019.webp','img/i095.webp'],
  cat:'أواني', stl:1, name:'طقم حلل استيل الحداد التركي - 10 قطع',
  price:'٦٠٠٠', n:6000, old:'٦٩٩٩', rate:'4.9', revs:167, tag:'فخم', model:'models/steel-pot.glb',
  desc:'استمتعي بأعلى مستويات الجودة مع طقم حلل استيل الحداد التركي، المصنوع من استانلس ستيل عالي الجودة ليمنحك أداءً مميزًا وعمرًا افتراضيًا طويلًا، مع تصميم أنيق يناسب كل مطبخ عصري.\nالمميزات:\nمصنوع من استانلس ستيل عالي الجودة مقاوم للصدأ والتآكل.\nتوزيع متساوٍ للحرارة للحصول على أفضل نتائج أثناء الطهي.\nخامة متينة تتحمل الاستخدام اليومي لسنوات.\nأغطية استانلس محكمة للحفاظ على حرارة الطعام ونكهته.\nسهل التنظيف ويحافظ على لمعانه مع الاستخدام.\nمقابض قوية وآمنة لسهولة الحمل.\nمناسب لمعظم أنواع البوتاجازات.\nيحمل علامة الجودة الخاصة بالمصنع، لضمان مطابقة المنتج لمعايير التصنيع.\nمحتويات الطقم: 10 قطع.\nمتوفر الآن بكميات محدودة.'},
 {img:'img/i021.webp', imgs:['img/i021.webp','img/i022.webp'],
  cat:'أواني', stl:1, name:'طقم حلل استانلس 10 قطع - Axis Stand 304',
  price:'٣٨٤٩', n:3849, old:'٥١٢٩', rate:'4.8', revs:129, tag:'جديد',
  desc:'احصلي على أفضل أداء في مطبخك مع طقم حلل Axis Stand المصنوع من استانلس ستيل 304، المصمم ليتحمل الاستخدام اليومي ويمنحك جودة تدوم مع تصميم أنيق يناسب جميع المطابخ.\nالمميزات:\nمصنوع من استانلس ستيل 304 عالي الجودة، مقاوم للصدأ والتآكل.\nتوزيع متساوٍ للحرارة للحصول على نتائج طهي أفضل.\nخامة قوية تتحمل الاستخدام اليومي لسنوات.\nأغطية استانلس محكمة للحفاظ على حرارة الطعام ونكهته.\nسهل التنظيف ويحافظ على لمعانه.\nمناسب لمعظم أنواع البوتاجازات.\nتصميم عصري يجمع بين الأناقة والعملية.\nمحتويات الطقم: 10 قطع.\n'},
 {img:'img/i041.webp', imgs:['img/i041.webp','img/i042.webp','img/i043.webp','img/i044.webp'],
  cat:'أواني', stl:1, name:'طقم حلل استانلس YONCA 10 قطع',
  price:'٦٥٠٠', n:6500, old:'٨٦٦٧', rate:'4.8', revs:67, tag:'خصم 25٪',
  desc:'طقم حلل استانلس YONCA التركي 10 قطع — غطاء محكم وتوزيع حرارة متساوي يخلي أي أكلة طعمها مختلف.\nالمميزات:\nاستانلس ستيل سميك مقاوم للصدأ.\nأغطية محكمة بيحفظوا الحرارة والنكهة.\nتوزيع حرارة متساوي على كل الاتجاهات.\nأيادي مريحة ومقاومة للحرارة.\nصناعة تركية أصيلة.\nالسعر: ٦٥٠٠ ج.م بدل ٨٦٦٧ — خصم 25٪.\nكود المنتج: 1001 — اذكره في طلب الواتساب.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i045.webp', imgs:['img/i045.webp','img/i046.webp','img/i047.webp','img/i048.webp'],
  cat:'أواني', stl:1, name:'طقم حلل SAMA & RIMAS استانلس 10 قطع',
  price:'٥٩٩٩', n:5999, old:'٧٩٩٩', rate:'4.8', revs:54, tag:'وصل حديثًا',
  desc:'طقم حلل SAMA & RIMAS استانلس 10 قطع بأيادي ذهبية — شكل فخم يستاهل يكون في نص السفرة أو يكون هدية مميزة.\nالمميزات:\nاستانلس ستيل لامع عالي الجودة.\nأيادي ذهبية فخمة للعرض والإهداء.\nأغطية محكمة مع توزيع حرارة متساوي.\nمقاسات متدرجة تناسب كل الأطباق.\nالسعر: ٥٩٩٩ ج.م بدل ٧٩٩٩ — خصم 25٪.\nكود المنتج: 1003 — وصل حديثًا.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i049.webp', imgs:['img/i049.webp','img/i050.webp','img/i051.webp','img/i052.webp'],
  cat:'أواني', stl:1, name:'طقم حلل استانلس 5 حلل بأغطية',
  price:'٣٨٤٩', n:3849, old:'٥٤٩٩', rate:'4.7', revs:41, tag:'وصل حديثًا',
  desc:'طقم حلل استانلس 5 حلل بأغطية — لامع بأيادي معدنية ومقاسات متدرجة تخليك مستغني عن أي حلة تانية.\nالمميزات:\nاستانلس ستيل لامع وسهل التنظيف.\n5 مقاسات متدرجة بأغطية محكمة.\nأيادي معدنية قوية ومقاومة للحرارة.\nمناسبة لكل أنواع المواقد.\nالسعر: ٣٨٤٩ ج.م بدل ٥٤٩٩ — خصم 30٪.\nكود المنتج: 1004 — وصل حديثًا.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i053.webp', imgs:['img/i053.webp','img/i054.webp','img/i055.webp','img/i056.webp'],
  cat:'أواني', stl:1, name:'غلاية شاي استانلس بنقوش',
  price:'٩٩٩', n:999, old:'١٤٢٩', rate:'4.7', revs:58, tag:'خصم 30٪',
  desc:'غلاية شاي استانلس بنقوش من الحداد التركي — تصميم عصري بيد مقاومة للحرارة ولمعة بتجذب العين من أول نظرة.\nالمميزات:\nاستانلس ستيل بنقوش فخمة.\nيد مقاومة للحرارة ما بتسخنش.\nتوصيل حرارة سريع ومتساوي.\nصناعة تركية أصيلة — الحداد التركي.\nالسعر: ٩٩٩ ج.م بدل ١٤٢٩ — خصم 30٪.\nكود المنتج: 1006.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i003.webp', imgs:['img/i003.webp','img/i018.webp'],
  cat:'أواني', name:'طقم حلل سيراميك كوري لزينون - 11 قطعة',
  price:'٤٧٤٩', n:4749, old:'٦٣٢٩', rate:'4.8', revs:142, tag:'ألوان متعددة', model:'models/cooking-pot.glb',
  desc:'استمتعي بجودة الطهي مع طقم حلل سيراميك كوري لزينون الأصلي، المصمم ليجمع بين الأداء العملي والتصميم الأنيق ليكون إضافة مميزة لمطبخك.\nالمميزات:\nطبقة سيراميك كوري عالية الجودة غير لاصقة.\nتوزيع متساوٍ للحرارة للحصول على أفضل نتائج أثناء الطهي.\nخامات متينة تتحمل الاستخدام اليومي.\nسهل التنظيف ويوفر الوقت والمجهود.\nأغطية زجاج حراري لمتابعة الطعام أثناء الطهي.\nمناسب لمعظم أنواع البوتاجازات.\nتصميم عصري وألوان متعددة أنيقة تناسب جميع المطابخ.\nالسعر: ٤٧٤٩ ج.م بدل ٦٣٢٩ — خصم 25٪.\nكود المنتج: 1009 — ألوان متعددة.\nمحتويات الطقم: 11 قطعة، متوفر بألوان ومقاسات مختلفة.\nاطلبه الآن قبل نفاد الكمية.'},
 {img:'img/i057.webp', imgs:['img/i057.webp','img/i058.webp','img/i059.webp','img/i060.webp'],
  cat:'أواني', name:'طقم حلل جرانيت سافلون كوري الأصلي',
  price:'٤٧٤٩', n:4749, old:'٦٣٢٩', rate:'4.9', revs:203, tag:'الأكثر مبيعاً',
  desc:'طقم حلل جرانيت سافلون الكوري الأصلي — جرانيت ثقيل بيوزع الحرارة بالتساوي وبيخلي الأكل أحلى وأسهل في التنظيف.\nالمميزات:\nجرانيت كوري أصلي ثقيل — الأصلي بيدوم أطول.\nغير لاصق — قليل الزيت وأصح ليك.\nتوزيع حرارة متساوي على كل الاتجاهات.\nسهل التنظيف بمسحة واحدة.\nالأكثر مبيعاً في المتجر.\nالسعر: ٤٧٤٩ ج.م بدل ٦٣٢٩ — خصم 25٪.\nكود المنتج: 1008.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/kt1020.webp', imgs:['img/kt1020.webp','img/i023.webp','img/i025.webp','img/i026.webp'],
  cat:'إكسسوارات', name:'طقم كنك قهوة تركي - 3 قطع مع حامل',
  price:'٨٤٩', n:849, old:'١٢٠٩', rate:'4.8', revs:151, tag:'خصم 30٪', otag:'خامات',
  opts:[{k:'جرانيت',n:849,old:1209,img:'img/kt1020.webp',imgs:['img/kt1020.webp','img/i023.webp','img/i025.webp','img/i026.webp'],d:'كنك القهوة بخامة الجرانيت — الطبقة الجرانيت السميكة بتوزع الحرارة بالتساوي وبتحافظ على حرارة القهوة وقت أطول، علشان القشطة تطلع مظبوطة من أول مرة.\nالمميزات:\nجرانيت سميك غير لاصق — القهوة ما بتلزقش والتنظيف بمسحة واحدة.\nيحافظ على حرارة القهوة أطول من الاستانلس.\nألوان جرانيت فخمة تليق بتقديم الضيافة.\n3 مقاسات مع حامل معدني أنيق.\nالمحتويات: 3 كنك جرانيت + حامل معدني.\nسعر خامات الجرانيت: ٨٤٩ ج.م بدل ١٢٠٩ — خصم 30٪.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},{k:'استانلس',n:899,old:1279,img:'img/kt1019.webp',imgs:['img/kt1019.webp','img/i027.webp'],d:'كنك القهوة بخامة الاستانلس اللامع — استانلس ستيل عالي الجودة بيسخّن أسرع وبيوصّل الحرارة بالتساوي، بيدّيك قهوة بمذاق نقي وشكل لامع يليق بالضيافة.\nالمميزات:\nاستانلس ستيل لامع عالي الجودة — ما بيصدأش وبيلمع زي الفل.\nتسخين أسرع من الجرانيت — مناسب للصبح على السريع.\nخفيف وسهل الاستخدام والتنظيف يوميًا.\n3 مقاسات مع حامل معدني أنيق.\nالمحتويات: 3 كنك استانلس + حامل معدني.\nسعر خامات الاستانلس: ٨٩٩ ج.م بدل ١٢٧٩ — خصم 30٪.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},{k:'LINES - 4 قطع',n:599,old:859,img:'img/kt1021.webp',imgs:['img/kt1021.webp','img/i077.webp','img/i078.webp','img/i079.webp','img/i080.webp'],d:'طقم كنكة قهوة تركي LINES 4 قطع — استانلس ستيل عالي الجودة بحامل معدني، تصميم إيطالي وصناعة تركية بيرفع مستوى ضيافتك.\nالمميزات:\n4 كنك استانلس ستيل لامع بأحجام متدرجة.\nحامل معدني أنيق للعرض والتقديم.\nتصميم إيطالي وصناعة تركية.\nهدية شيك لكل بيت جديد وللعروس.\nسعر خامات LINES: ٥٩٩ ج.م بدل ٨٥٩ — خصم 30٪.\nكود المنتج: 1021.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'}],
  desc:'استمتعي بتحضير القهوة التركية بأناقة مع طقم الكنك بالحامل المعدني — متوفر بـ 3 خامات تختار بينهم من أزرار الخامات: جرانيت، استانلس، وطقم LINES 4 قطع الإيطالي، وكل خامة ليها وصفها وصورها وسعرها.\nالمميزات:\n3 خامات: جرانيت بـ ٨٤٩ ج.م — استانلس بـ ٨٩٩ ج.م — LINES 4 قطع بـ ٥٩٩ ج.م — خصم 30٪ على كل الخامات.\nاضغط على زر الخامة والصور كلها بتتغير مع الوصف والسعر.\nجرانيت بيحافظ على حرارة القهوة أطول — استانلس بيسخّن أسرع — LINES بتصميم إيطالي فاخر.\nتوزيع متساوٍ للحرارة لتحضير قهوة غنية بالمذاق وقشطة مظبوطة.\nيد مريحة وعازلة للحرارة لسهولة الاستخدام.\nسهل التنظيف ومناسب للاستخدام اليومي.\nحامل معدني أنيق يحافظ على ترتيب الكنك ويضيف لمسة مميزة للمطبخ.\nمناسب لتحضير القهوة التركية، الحليب، والنسكافيه والمشروبات الساخنة.\nأكواد المنتجات: 1020 جرانيت — 1019 استانلس — 1021 LINES — اذكر كود الخامة في طلب الواتساب.\nمحتويات الطقم: 3 كنك + حامل معدني (LINES: 4 قطع + حامل).\nالخامات المتاحة: جرانيت واستانلس وLINES — اختار الخامة من أزرار الخامات قبل ما تضيفه للسلة.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i061.webp', imgs:['img/i061.webp','img/i062.webp','img/i063.webp','img/i064.webp'],
  cat:'أواني', name:'طقم حلل HYDRA جرانيت - 4 حلل ومقلاة',
  price:'٣٨٤٩', n:3849, old:'٥١٢٩', rate:'4.8', revs:63, tag:'وصل حديثًا',
  desc:'طقم حلل HYDRA جرانيت بلون أحمر مميز — 4 حلل بأغطية ومقلاة مع ماسكات سيليكون، شكل يخطف العين وأداء أقوى.\nالمميزات:\nجرانيت غير لاصق عالي الجودة.\n4 حلل بأغطية + مقلاة.\nماسكات سيليكون آمنة على اليد.\nلون أحمر فخم يليق بمطبخك.\nالسعر: ٣٨٤٩ ج.م بدل ٥١٢٩ — خصم 25٪.\nكود المنتج: 1010 — وصل حديثًا.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i004.webp', imgs:['img/i004.webp','img/i028.webp','img/i029.webp'],
  cat:'مقالي', name:'طقم مقالي جرانيت تركي 3 قطع Martev (20/24/28)',
  price:'١٥٤٩', n:1549, old:'٢٢٠٩', rate:'4.8', revs:74, tag:'وصل حديثًا', model:'models/frying-pan.glb',
  desc:'طقم المقلايات الجرانيت التركي Martev وصل.\n3 مقاسات مختلفة تناسب كل احتياجاتك في المطبخ.\nجرانيت تقيل وجودة عالية بيعيش معاكي سنين.\nغير لاصق نهائي وسهل التنضيف جدًا.\nبيوزع الحرارة بالتساوي علشان أكلك يطلع مظبوط كل مرة.\nشكل أنيق ولمسة تركية فخمة لمطبخك.\nالطقم ده هيخلي الطبخ متعة.\nلو بتحبي الجودة والشياكة، الطقم ده ليكي.\nالمقاسات: 20 سم، 24 سم، 28 سم.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i065.webp', imgs:['img/i065.webp','img/i066.webp','img/i067.webp','img/i068.webp'],
  cat:'مقالي', name:'طقم مقالي CEMRE الحداد التركي جرانيت 3 قطع',
  price:'١٩٩٩', n:1999, old:'٢٦٦٩', rate:'4.8', revs:71, tag:'خصم 25٪',
  desc:'طقم مقالي CEMRE الحداد التركي جرانيت 3 قطع بمقاسات ٢٠ و٢٤ و٢٨ سم — صناعة تركية من الحداد التركي، غير لاصقة وسهلة التنظيف.\nالمميزات:\n3 مقاسات: ٢٠ و٢٤ و٢٨ سم.\nجرانيت غير لاصق قليل الزيت.\nتوزيع حرارة متساوي.\nصناعة تركية أصيلة — الحداد التركي.\nالسعر: ١٩٩٩ ج.م بدل ٢٦٦٩ — خصم 25٪.\nكود المنتج: 1011.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i069.webp', imgs:['img/i069.webp','img/i070.webp','img/i071.webp','img/i072.webp'],
  cat:'مقالي', name:'طقم 3 مقالي غير لاصقة',
  price:'١٥٤٩', n:1549, old:'٢٢٠٩', rate:'4.7', revs:45, tag:'وصل حديثًا',
  desc:'طقم 3 مقالي غير لاصقة بمقاسات متعددة — بتغطي كل احتياجات المطبخ من الفطار للعشا وسهل التنظيف.\nالمميزات:\n3 مقاسات متعددة الاستخدام.\nطبقة غير لاصقة ما بتحرقش ولا بتلزقش.\nتوزيع حرارة متساوي.\nسهل التنظيف بمسحة واحدة.\nالسعر: ١٥٤٩ ج.م بدل ٢٢٠٩ — خصم 30٪.\nكود المنتج: 1015 — وصل حديثًا.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i030.webp', imgs:['img/i030.webp','img/i031.webp','img/i032.webp','img/i033.webp'],
  cat:'صواني', name:'طقم صواني جرانيت Martev التركي - 3 قطع (26/28/30)',
  price:'١٤٩٩', n:1499, old:'٢١٣٩', rate:'4.9', revs:96, tag:'خصم 30٪',
  desc:'استمتعي بتحضير أشهى المخبوزات وأكلات الفرن مع طقم صواني جرانيت Martev التركي، المصمم بجودة عالية ليمنحك توزيعًا مثاليًا للحرارة ونتائج طهي رائعة في كل مرة.\nالمميزات:\nيتكون من 3 مقاسات: 26 سم، 28 سم، 30 سم.\nطبقة جرانيت غير لاصقة تمنع التصاق الطعام وتسهل التنظيف.\nتوزيع متساوٍ للحرارة للحصول على أفضل نتائج أثناء الطهي.\nخامات متينة تتحمل درجات الحرارة العالية.\nمناسب لتحضير الكيك، المكرونة بالبشاميل، البطاطس، اللحوم، والدجاج وجميع أكلات الفرن.\nمناسب للاستخدام داخل الفرن.\nتصميم تركي أنيق بألوان عصرية تناسب جميع المطابخ.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i073.webp', imgs:['img/i073.webp','img/i074.webp','img/i075.webp','img/i076.webp'],
  cat:'صواني', name:'طقم صواني فرن CEMRE الحداد التركي جرانيت 3 قطع',
  price:'١٩٩٩', n:1999, old:'٢٦٦٩', rate:'4.8', revs:52, tag:'خصم 25٪',
  desc:'طقم صواني فرن CEMRE الحداد التركي جرانيت 3 قطع بمقاسات ٢٦ و٢٨ و٣٠ سم — جرانيت غير لاصق بيخلي البان والفراخ بتتحمّس أحلى.\nالمميزات:\n3 مقاسات: ٢٦ و٢٨ و٣٠ سم.\nجرانيت غير لاصق يتحمل حرارة الفرن.\nتوزيع حرارة متساوي لتسوية مثالية.\nسهل التنظيف حتى بعد الفرن.\nصناعة تركية — الحداد التركي.\nالسعر: ١٩٩٩ ج.م بدل ٢٦٦٩ — خصم 25٪.\nكود المنتج: 1017.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد المخزون.'},
 {img:'img/i037.webp', imgs:['img/i037.webp','img/i038.webp','img/i039.webp','img/i040.webp'],
  cat:'صواني', name:'طقم صواني تقديم استانلس مستورد دهبي - 2 قطعة',
  price:'١٤٩٩', n:1499, old:'٢١٣٩', rate:'4.9', revs:117, tag:'فخم',
  desc:'أضيفي لمسة من الأناقة والفخامة إلى سفرتك مع طقم صواني التقديم الاستانلس المستورد، بتصميم راقٍ ولمسات ذهبية مميزة تجعله الخيار المثالي للتقديم في جميع المناسبات.\nالمميزات:\nطقم مكون من 2 قطعة بأحجام عملية: صينية كبيرة وأخرى متوسطة.\nمصنوع من استانلس ستيل عالي الجودة لمتانة تدوم طويلًا.\nطلاء ذهبي أنيق يمنح الصواني مظهرًا فاخرًا.\nمناسب لتقديم الحلويات، المشروبات، القهوة، الشاي والضيافة.\nسهل التنظيف ويحافظ على لمعانه مع الاستخدام.\nمقابض جانبية مريحة لسهولة الحمل والتقديم.\nتصميم كلاسيكي فاخر بحواف مزخرفة يضيف لمسة راقية للمطبخ والسفرة.\nمتوفر الآن بكميات محدودة.'},
 {img:'img/i081.webp', imgs:['img/i081.webp','img/i082.webp','img/i083.webp','img/i084.webp'],
  cat:'إكسسوارات', name:'طقم معالق وشوك استانلس ذهبي - 30 قطعة',
  price:'١٩٩٩', n:1999, old:'٢٨٥٩', rate:'4.8', revs:66, tag:'خصم 30٪',
  desc:'طقم معالق وشوك استانلس ذهبي 30 قطعة — تشطيب ذهبي فاخر مع استانلس لامع بيدي السفرة شكل ملوك.\nالمميزات:\n30 قطعة كاملة تغطي السفرة.\nتشطيب ذهبي فاخر.\nاستانلس ستيل لامع عالي الجودة.\nمناسب للمناسبات والإهداء.\nالسعر: ١٩٩٩ ج.م بدل ٢٨٥٩ — خصم 30٪.\nكود المنتج: 1023.\nمتوفر الآن بكميات محدودة، اطلبه قبل نفاد الكمية.'}
];/* full catalog = the real photo products */
const catalog=products.map(function(p){return {img:p.img,imgs:p.imgs,desc:p.desc,model:p.model,
    art:p.art,stl:p.stl,cat:p.cat,name:p.name,price:p.price,n:p.n,old:p.old,rate:p.rate,revs:p.revs,opts:p.opts,otag:p.otag,tag:p.tag,hot:p.hot}});

const star='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 15 8.5 22 9.3 17 14l1.2 7L12 17.8 5.8 21 7 14 2 9.3 9 8.5z"/></svg>';

/* ---------- PRODUCT CARDS (redesigned) ---------- */
/* variant selection per catalog index (shared by store grid + featured grid) */
const cardSel={};
function defOpt(p){if(!p||!p.opts)return -1;var k=p.opts.findIndex(function(o){return o.n===p.n});return k>=0?k:0}
function cardHTML(p,i){
  const dSel=p.opts?((cardSel[i]!=null)?cardSel[i]:defOpt(p)):-1;
  const selO=dSel>=0?p.opts[dSel]:null;
  const oldN=p.old?ar2num(p.old):0;
  const baseN=p.opts?Math.min.apply(null,p.opts.map(o=>o.n)):p.n;
  /* T28: شارة الوفر بتحسب على الخامة/المقاس المختار نفسه — مش أرخص اختيار */
  const sO=p.opts&&selO?selO:null;
  const sOld=sO?(sO.old?(typeof sO.old==='number'?sO.old:ar2num(sO.old)):oldN):oldN;
  const sN=sO?sO.n:p.n;
  const save=sOld>sN?Math.round((1-sN/sOld)*100):0;
  return `
  <article class="p-card" data-cat="${p.cat}" data-idx="${i}" data-delay="${(i%6)*60}" data-rv>
    <div class="p-tile">
      <span class="p-tag ${p.hot?'hot':''}">${p.tag||p.cat}</span>
      ${save?`<span class="p-save">وفّر ${arInt(save)}٪</span>`:''}
      ${p.img?`<img class="p-img" src="${(selO&&selO.img)||p.img}" loading="lazy" decoding="async" alt="${p.name}">`:`<div class="art">${ART[p.art]||''}</div>`}
      <span class="p-veil"></span>
      ${p.opts?`<span class="p-vars">${arInt(p.opts.length)} ${p.otag||'مقاسات'}</span>`:''}
      <button class="p-quick" data-add="${i}">أضف سريع للسلة
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>
    </div>
    <div class="p-body">
      <div class="p-cat">${p.cat}</div>
      <h3 class="p-name">${p.name}</h3>
      <div class="p-rate">${star.repeat(5)}<small>${p.rate} (${arInt(p.revs||0)} تقييم)</small></div>
      <div class="p-opts">${p.opts?p.opts.map((o,k)=>`<button type="button" class="p-opt${k===dSel?' on':''}" data-o="${k}">${o.k}</button>`).join(''):''}</div>
      <div class="p-foot">
        <div class="p-price">${p.opts?(selO?arInt(selO.n)+' ج.م'+(selO.old?' <s>'+arInt(typeof selO.old==='number'?selO.old:ar2num(selO.old))+' ج.م</s>':''):'من '+arInt(baseN)+' ج.م'):(p.price+' ج.م')} ${p.old&&!p.opts?'<s>'+p.old+'</s>':''}</div>
        <div class="p-acts">
          <button class="p-eye" data-view="${i}" aria-label="شوف تفاصيل ${p.name}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none"/></svg>
          </button>
          <button class="add-btn" aria-label="أضف ${p.name} للسلة" data-add="${i}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
      </div>
    </div>
  </article>`}
/* ---------- STORE RENDER + PAGINATION (Amazon-style, 4 per page) ---------- */
const PER=4,pGridEl=$('#p-grid'),pgNav=$('#pg-nav'),resCount=$('#res-count');
let curPage=1,curFilter='الكل',priceMode='all',sortMode='pop';
const cats=['الكل',...new Set(catalog.map(p=>p.cat))];
$('#filters').innerHTML=cats.map((c,i)=>`<button class="f-chip ${i?'':'active'}" data-f="${c}">${c}</button>`).join('');
/* fade hint on the scrollable filter row (phone): .scrolls gates the edge mask.
   ResizeObserver re-checks when the shop view (body.shop-open) makes #filters visible */
(function(){
  const f=$('#filters');if(!f)return;
  const upd=()=>f.classList.toggle('scrolls',f.scrollWidth>f.clientWidth+4);
  upd();requestAnimationFrame(upd);
  addEventListener('resize',upd,{passive:true});
  if(window.ResizeObserver)new ResizeObserver(upd).observe(f);
})();
function viewList(){
  const v=[];
  catalog.forEach(function(p,i){
    if(curFilter!=='الكل'&&p.cat!==curFilter)return;
    if(priceMode==='u1000'&&!(p.n<1000))return;
    if(priceMode==='b1000_3000'&&!(p.n>=1000&&p.n<=3000))return;
    if(priceMode==='b3000_5000'&&!(p.n>3000&&p.n<=5000))return;
    if(priceMode==='o5000'&&!(p.n>5000))return;
    v.push(i);
  });
  if(sortMode==='pl')v.sort(function(a,b){return catalog[a].n-catalog[b].n});
  else if(sortMode==='ph')v.sort(function(a,b){return catalog[b].n-catalog[a].n});
  else if(sortMode==='rt')v.sort(function(a,b){return (catalog[b].rate||0)-(catalog[a].rate||0)});
  return v;
}
/* T30: صفحات منتظمة 4 كروت — الحلل الاستانلس مبقتش مجبورة تتجمع في صفحة واحدة
   (طلب المالك: صفحة 2 = 4 حلل استلس، و«5 حلل بأغطية» + «غلاية الشاي» ينزلوا الصفحة اللي بعدها — المتجر بقى 6 صفحات) */
function buildPages(view){
  const pgs=[];for(let x=0;x<view.length;x+=PER)pgs.push(view.slice(x,x+PER));
  return pgs;
}
function renderPage(){
  const view=viewList(),pgs=buildPages(view),pages=Math.max(1,pgs.length);
  if(curPage>pages)curPage=pages;
  pGridEl.innerHTML=(pgs[curPage-1]||[]).map(function(i){return cardHTML(catalog[i],i)}).join('');
  $$('#p-grid .p-card').forEach(el=>revObs.observe(el));
  if(resCount)resCount.textContent=arInt(view.length);
  const pe=$('#p-empty');if(pe)pe.style.display=view.length?'none':'grid';
  if(pgNav){
    let h='<button class="pg-btn pg-arrow" data-pg="prev"'+(curPage===1?' disabled':'')+' aria-label="الصفحة اللي فاتت"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></button>';
    let nums=[];
    if(pages>5){const s=new Set([1,pages]);let a=Math.max(1,curPage-1),b=Math.min(pages,curPage+1);if(a===1)b=Math.min(pages,a+2);if(b===pages)a=Math.max(1,b-2);for(let k=a;k<=b;k++)s.add(k);nums=[...s].sort(function(x,y){return x-y})}
    else for(let k=1;k<=pages;k++)nums.push(k);
    nums.forEach(function(k,ix){
      if(ix&&k-nums[ix-1]>1)h+='<span class="pg-dots" aria-hidden="true">…</span>';
      h+='<button class="pg-btn'+(k===curPage?' active':'')+'" data-pg="'+k+'"'+(k===curPage?' aria-current="page"':'')+'>'+arInt(k)+'</button>';
    });
    h+='<button class="pg-btn pg-arrow" data-pg="next"'+(curPage===pages?' disabled':'')+' aria-label="الصفحة الجاية"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 6-6 6 6 6"/></svg></button>';
    pgNav.innerHTML=h;
    pgNav.style.display=pages>1?'flex':'none';
  }
}
function goPage(k){
  curPage=Math.min(Math.max(k,1),Math.max(1,buildPages(viewList()).length));
  renderPage();
  /* T27: مفيش سكرول لفوق عند تغيير الصفحة — العميل يفضل واقف في نفس مكانه */
}
pgNav.addEventListener('click',e=>{
  const b=e.target.closest('.pg-btn');if(!b||b.disabled)return;
  if(b.dataset.pg==='prev')goPage(curPage-1);
  else if(b.dataset.pg==='next')goPage(curPage+1);
  else goPage(+b.dataset.pg);
});
$('#filters').addEventListener('click',e=>{
  const b=e.target.closest('.f-chip');if(!b)return;
  $$('.f-chip').forEach(c=>c.classList.toggle('active',c===b));
  curFilter=b.dataset.f;curPage=1;renderPage();
});
const priceSel=$('#price-sel'),sortSel=$('#sort-sel');
if(priceSel)priceSel.addEventListener('change',function(){priceMode=priceSel.value;curPage=1;renderPage();});
if(sortSel)sortSel.addEventListener('change',function(){sortMode=sortSel.value;curPage=1;renderPage();});
renderPage();
/* T36: مختارات الجمعة البيضاء = ARSHIA / NETLON / YONCA / لزينون (كنك وسافلون فضلوا في المتجر بس) */
$('#feat-grid').innerHTML=[1,0,6,10].map(function(i){return cardHTML(catalog[i],i)}).join('');
/* reveal the featured cards (grid is filled after the observer setup) */
$$('#feat-grid .p-card').forEach(function(el){revObs.observe(el)});
/* ---------- SHOP VIEW: المتجر شاشة مستقلة — يدخلها العميل بزر أو من الناف ---------- */
let shopScroll=0,shopFromPop=false;
function openShop(fromPop){
  if(document.body.classList.contains('shop-open'))return;
  shopScroll=scrollY||0;
  document.body.classList.add('shop-open');
  try{scrollTo(0,0)}catch(e){}
  if(!fromPop){try{history.pushState({shop:1},'')}catch(e){}shopFromPop=true}
  navActive();
}
function closeShop(fromPop){
  if(!document.body.classList.contains('shop-open'))return;
  document.body.classList.remove('shop-open');
  if(shopFromPop){shopFromPop=false;
    if(!fromPop){try{history.back()}catch(e){}}
    else{try{history.replaceState(null,'')}catch(e){}}}
  try{scrollTo(0,shopScroll||0)}catch(e){}
}
$('#shop-back').addEventListener('click',function(){closeShop()});



/* ---------- 3D GALLERY: one viewer + switchable models (lazy) ---------- */
(function(){
  const stage=$('#mv-stage'),main=$('#mv-main'),chipsEl=$('#mv-chips'),fallback=$('#mv-fallback');
  const nameTx=$('#mv-name-tx'),name2=$('#mv-name2'),descEl=$('#mv-desc'),
        countEl=$('#mv-count'),rotBtn=$('#mv-rot'),prev=$('#mv-prev'),next=$('#mv-next');
  const catEl=$('#mv-cat'),rateEl=$('#mv-rate'),specEl=$('#mv-specs'),infoEl=$('#mv-info');
  if(!stage||!main)return;
  let cur=0,rotating=!reduceMotion,swT=null,lastBlob=null,loadToken=0;
  /* some GLBs ship a "Glass" material with alphaMode BLEND — force opaque */
  main.addEventListener('load',()=>{
    try{
      const mo=main.model;if(!mo||!mo.materials)return;
      mo.materials.forEach(mt=>{
        try{if(mt.alphaMode&&mt.alphaMode!=='OPAQUE')mt.alphaMode='OPAQUE'}
        catch(e){try{mt.setAlphaMode&&mt.setAlphaMode('OPAQUE')}catch(e2){}}
      });
    }catch(e){}
  });
  const FORCE_JS=/[?&#]protojs=1/.test(location.search+'#'+location.hash);
  MODELS.forEach(m=>m.key=m.src.split('/').pop().replace(/\.glb$/,''));
  chipsEl.innerHTML=MODELS.map((m,i)=>`<button class="mv-chip ${i?'':'active'}" data-m="${i}">${m.name}</button>`).join('');
  /* GLB delivery: over http use the file directly; on file:// fetch is CORS-blocked,
     so models are pre-baked as base64 JS and turned into a Blob URL */
  const blobCache={};
  function toBlob(key){
    if(blobCache[key])return blobCache[key];
    const bin=atob(window.__GLB[key]),len=bin.length,bytes=new Uint8Array(len);
    for(let i=0;i<len;i++)bytes[i]=bin.charCodeAt(i);
    const url=URL.createObjectURL(new Blob([bytes],{type:'model/gltf-binary'}));
    blobCache[key]=url;return url;
  }
  function glbUrl(m){
    if(blobCache[m.key])return Promise.resolve(blobCache[m.key]);
    if(FORCE_JS||location.protocol==='file:'||!('fetch' in window)){
      return new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src='models/js/'+m.key+'.js';
        s.onload=()=>{try{res(toBlob(m.key))}catch(e){rej(e)}};
        s.onerror=()=>rej(new Error('glb script failed'));
        document.head.appendChild(s);
      });
    }
    /* same delivery as the old working build: model-viewer receives a Blob URL,
       but bytes now come from the small external .glb file instead of the page */
    return fetch(m.src+'?v=7')
      .then(r=>{if(!r.ok)throw new Error('glb http '+r.status);return r.arrayBuffer()})
      .then(buf=>{
        if(blobCache[m.key])return blobCache[m.key];
        const url=URL.createObjectURL(new Blob([buf],{type:'model/gltf-binary'}));
        blobCache[m.key]=url;lastBlob=url;return url;
      })
      .catch(()=>m.src+'?v=7'); /* last resort: direct URL */
  }
  function apply(i){
    cur=(i+MODELS.length)%MODELS.length;
    const m=MODELS[cur],token=++loadToken;
    $$('.mv-chip').forEach((c,k)=>c.classList.toggle('active',k===cur));
    countEl.textContent=arInt(cur+1)+' / '+arInt(MODELS.length);
    stage.classList.add('sw');
    infoEl.classList.add('sw');
    clearTimeout(swT);
    swT=setTimeout(()=>{
      nameTx.textContent=m.name;
      name2.textContent=m.name;
      catEl.textContent=m.cat;
      descEl.textContent=m.desc;
      rateEl.innerHTML=star.repeat(5)+'<small>'+m.rate+' ('+arInt(m.revs)+' تقييم)</small>';
      specEl.innerHTML=m.specs.map(s=>'<span>'+s+'</span>').join('');
      const show=()=>{if(token===loadToken){stage.classList.remove('sw');infoEl.classList.remove('sw')}};
      glbUrl(m).then(url=>{
        if(token!==loadToken)return;
        let shown=false;
        const onLoaded=()=>{if(shown)return;shown=true;requestAnimationFrame(show)};
        main.addEventListener('load',onLoaded,{once:true});
        main.setAttribute('src',url);
        setTimeout(onLoaded,9000);
      }).catch(show);
    },280);
  }
  chipsEl.addEventListener('click',e=>{
    const b=e.target.closest('.mv-chip');if(!b)return;
    apply(+b.dataset.m);
  });
  prev.addEventListener('click',()=>apply(cur-1));
  next.addEventListener('click',()=>apply(cur+1));
  $('#mv-add').addEventListener('click',()=>{
    const m=MODELS[cur],pn=m.prodName||m.name;
    const cp=catalog.find(function(c){return c.name===pn});
    if(cp&&cp.opts){openModal(catalog.indexOf(cp));return}
    addToCart({name:pn,n:cp?cp.n:0,img:cp?cp.img:'',art:cp?cp.art:m.art});
    flyToCart($('#mv-add'),cp?cp.img:null);morphAdded($('#mv-add'));
    toastShow(pn+' — اتضاف للسلة');
  });
  document.addEventListener('keydown',e=>{
    if(document.body.classList.contains('pm-open'))return;
    if(!stage.getBoundingClientRect().width)return;
    if(e.key==='ArrowLeft')apply(cur+1);      /* RTL: left arrow = next */
    else if(e.key==='ArrowRight')apply(cur-1);
  });
  function setRot(on){
    rotating=on;
    if(on){main.setAttribute('auto-rotate','');main.setAttribute('rotation-per-second','14deg')}
    else main.removeAttribute('auto-rotate');
    rotBtn.classList.toggle('paused',!on);
  }
  if(rotating){main.setAttribute('auto-rotate','');main.setAttribute('rotation-per-second','14deg')}
  rotBtn.addEventListener('click',()=>setRot(!rotating));
  main.addEventListener('error',()=>{
    const f=$('#mv-fallback');
    if(f){f.style.display='';f.querySelector('span').textContent='حصلت مشكلة في تحميل الموديل — جرّب تحديث الصفحة'}
  });
  /* init immediately like the old build — the first GLB (~463KB) downloads in the
     background while the loading screen plays, so the model is ready when scrolled to */
  apply(0);
  /* preload the remaining models once idle -> chip switching is instant */
  const __preGLB=function(){MODELS.forEach(function(m){glbUrl(m).catch(function(){})})};
  if('requestIdleCallback' in window)requestIdleCallback(__preGLB,{timeout:8000});
  else setTimeout(__preGLB,3500);
  const hideFb=()=>{if(fallback)fallback.style.display='none'};
  if(window.customElements){
    if(customElements.get('model-viewer'))hideFb();
    else customElements.whenDefined('model-viewer').then(hideFb).catch(()=>{});
    setTimeout(()=>{
      if(!customElements.get('model-viewer')&&fallback){
        fallback.querySelector('span').textContent='العرض ثلاثي الأبعاد مش متاح على المتصفح ده';
        prev.style.display='none';next.style.display='none';
        if(rotBtn)rotBtn.style.display='none';
      }
    },9000);
  }else if(fallback)fallback.style.display='none';
})();

/* ---------- CART ---------- */
const cartArr=[];
const drawer=$('#cart-drawer'),cdItems=$('#cd-items'),cdTotal=$('#cd-total'),
      cdCountLabel=$('#cd-count-label'),badge=$('#cart-count'),toast=$('#toast'),toastMsg=$('#toast-msg');
let toastT;
function toastShow(msg){
  toastMsg.textContent=msg;
  toast.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>toast.classList.remove('show'),2200);
}
function cartCount(){return cartArr.reduce((s,it)=>s+it.qty,0)}
function cartSum(){return cartArr.reduce((s,it)=>s+it.qty*it.n,0)}
const WA_NUM='201029282833';
/* ---------- order photos → WhatsApp ----------
   wa.me links can't carry files, so:
   • phones  → native share sheet: the actual photo file(s) + order text go
               straight into WhatsApp (file + caption in one shot)
   • desktop → chat opens with the text, and the first product photo is
               copied to the clipboard (toast tells the customer to paste) */
async function imgToFile(src,name){
  try{
    if(!/^data:/i.test(src)){
      const b=await (await fetch(src)).blob();
      if(!/^image\//.test(b.type))return null;
      const ext=(b.type.split('/')[1]||'jpg').replace('jpeg','jpg');
      const nm=name.replace(/\.[a-z0-9]+$/i,'')+'.'+ext;
      return new File([b],nm,{type:b.type});
    }
    const meta=src.slice(0,src.indexOf(',')),
          b64=src.slice(src.indexOf(',')+1),
          mime=(meta.match(/data:([^;]+)/)||[])[1]||'image/jpeg',
          bin=atob(b64),len=bin.length,arr=new Uint8Array(len);
    for(let i=0;i<len;i++)arr[i]=bin.charCodeAt(i);
    return new File([arr],name,{type:mime});
  }catch(e){return null}
}
function copyImgToClipboard(dataURI){
  return new Promise(function(res){
    try{
      const img=new Image();
      img.onload=function(){
        try{
          const c=document.createElement('canvas');
          c.width=img.naturalWidth;c.height=img.naturalHeight;
          c.getContext('2d').drawImage(img,0,0);
          c.toBlob(function(blob){
            if(!blob){res(false);return}
            navigator.clipboard.write([new ClipboardItem({'image/png':blob})])
              .then(function(){res(true)}).catch(function(){res(false)});
          },'image/png');
        }catch(e){res(false)}
      };
      img.onerror=function(){res(false)};
      img.src=dataURI;
    }catch(e){res(false)}
  });
}
$('#cd-checkout').addEventListener('click',async function(){
  if(!cartArr.length)return;
  const lines=cartArr.map(function(it){
    return '• '+it.name+' — الكمية: '+arInt(it.qty)+' — '+arInt(it.n*it.qty)+' ج.م';
  });
  const msg='أهلاً أوانيستا 👋\nحابب أطلب:\n'+lines.join('\n')+'\n\nالإجمالي: '+arInt(cartSum())+' ج.م';
  const files=[],seenImg={};
  for(let k=0;k<cartArr.length;k++){
    const it=cartArr[k];
    if(!it.img||(!/^(data:image|img\/)/.test(it.img))||seenImg[it.img])continue;
    seenImg[it.img]=1;
    if(files.length<10){
      const f=await imgToFile(it.img,'awanista-order-'+(k+1)+'.jpg');
      if(f)files.push(f);
    }
  }
  const finishOrder=function(){
    toastShow('تم استلام طلبك بصوره — هنكلمك تأكيد قريب!');
    cartArr.length=0;renderCart();
    setTimeout(closeCart,600);
  };
  const openWa=function(){window.open('https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(msg),'_blank')};
  const fallback=function(){
    openWa();
    if(files.length){
      const first=cartArr.find(function(it){return it.img&&/^(data:image|img\/)/.test(it.img)});
      copyImgToClipboard(first.img).then(function(ok){
        if(ok)toastShow('صورة الطلب اتنسخت 📋 اعمل لصق في شات الواتساب');
      });
    }
    finishOrder();
  };
  const touch=(navigator.maxTouchPoints>0)||matchMedia('(pointer:coarse)').matches;
  if(touch&&files.length&&navigator.canShare&&navigator.canShare({files:files})){
    navigator.share({files:files,text:msg}).then(finishOrder).catch(function(err){
      if(err&&err.name==='AbortError')return; /* قفل الريحة — الطلب زي ما هو */
      fallback();
    });
    return;
  }
  fallback();
});

function morphAdded(btn){
  if(!btn||btn.dataset.lock)return;btn.dataset.lock='1';
  const orig=btn.innerHTML;
  btn.classList.add('added');
  if(btn.classList.contains('add-btn')){
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>';
  }else{btn.innerHTML='اتضاف للسلة ✓'}
  setTimeout(function(){btn.innerHTML=orig;btn.classList.remove('added');delete btn.dataset.lock},1300);
}
function addToCart(item,qty){
  const q=qty||1;
  const found=cartArr.find(it=>it.name===item.name);
  if(found)found.qty+=q;else cartArr.push({name:item.name,n:item.n,img:item.img||'',art:item.art||'',qty:q});
  renderCart();
  if(nav)nav.classList.remove('hide'); /* السلة قدام العميل — الناف بار يرجع فورًا بعد الإضافة */
}
function renderCart(){
  const cnt=cartCount();
  badge.textContent=arInt(cnt);
  badge.classList.remove('pop');void badge.offsetWidth;badge.classList.add('pop');
  cdCountLabel.textContent=cnt?`(${arInt(cnt)} ${cnt===1?'قطعة':'قطع'})`:'';
  drawer.classList.toggle('empty',!cnt);
  cdItems.innerHTML=cartArr.map((it,k)=>{
    return `<div class="cd-item">
      <div class="cd-thumb">${it.img?`<img src="${it.img}" alt="" loading="lazy" decoding="async">`:ART[it.art]||''}</div>
      <div class="cd-info">
        <b>${it.name}</b>
        <span>${arInt(it.n*it.qty)} ج.م</span>
        <div class="cd-row">
          <button class="qty-btn" data-q="+${k}" aria-label="زود الكمية"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></button>
          <span class="cd-qty">${arInt(it.qty)}</span>
          <button class="qty-btn" data-q="-${k}" aria-label="قلل الكمية"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M5 12h14"/></svg></button>
          <button class="cd-del" data-del="${k}" aria-label="شيل من السلة"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>
        </div>
      </div>
    </div>`}).join('');
  cdTotal.textContent=arInt(cartSum())+' ج.م';
}
let cartFromPop=false;
function openCart(){document.body.classList.add('cart-open');history.pushState({cart:1},'');cartFromPop=false;
  $$('#cd-items .cd-item').forEach(function(el,k){
    el.style.animation='none';void el.offsetWidth;el.style.animation='';el.style.animationDelay=(k*60)+'ms';
  });
}
function closeCart(fromPop){document.body.classList.remove('cart-open');if(cartFromPop){cartFromPop=false;if(!fromPop)history.back()}}
$('#cart-btn').addEventListener('click',openCart);
$('#cd-close').addEventListener('click',closeCart);
$('#cart-ov').addEventListener('click',closeCart);
cdItems.addEventListener('click',e=>{
  const q=e.target.closest('[data-q]'),d=e.target.closest('[data-del]');
  if(q){
    const k=+q.dataset.q.slice(1),sign=q.dataset.q[0];
    cartArr[k].qty+=sign==='+'?1:-1;
    if(cartArr[k].qty<=0)cartArr.splice(k,1);
    renderCart();
  }else if(d){
    cartArr.splice(+d.dataset.del,1);
    renderCart();
  }
});
['#p-grid','#feat-grid'].forEach(function(sel){$(sel).addEventListener('click',function(e){
  const opt=e.target.closest('.p-opt');
  if(opt){e.stopPropagation();
    const card=opt.closest('.p-card'),i=+card.dataset.idx,p=catalog[i];
    if(p.opts){cardSel[i]=+opt.dataset.o;const o=p.opts[cardSel[i]];
      card.querySelectorAll('.p-opt').forEach(function(b){b.classList.toggle('on',b===opt)});
      const pe=card.querySelector('.p-price');
      if(pe)pe.innerHTML=arInt(o.n)+' ج.م'+(o.old?' <s>'+arInt(typeof o.old==='number'?o.old:ar2num(o.old))+' ج.م</s>':'');
      const pim=card.querySelector('.p-img');
      if(pim&&o.img&&pim.getAttribute('src')!==o.img){pim.style.opacity=0;setTimeout(function(){pim.src=o.img;pim.style.opacity=1},170)}}
    return}
  const eye=e.target.closest('.p-eye');
  if(eye){openModal(+eye.dataset.view);return}
  const add=e.target.closest('[data-add]');
  if(add){const p=catalog[+add.dataset.add];
    if(p.opts){const k=(cardSel[+add.dataset.add]!=null)?cardSel[+add.dataset.add]:defOpt(p),o=p.opts[k],an=p.name+' - '+o.k;
      addToCart({name:an,n:o.n,img:o.img||p.img,art:p.art});flyToCart(tileOf(add),o.img||p.img);morphAdded(add);toastShow(an+' — اتضاف للسلة');return}
    addToCart({name:p.name,n:p.n,img:p.img,art:p.art});flyToCart(tileOf(add),p.img);morphAdded(add);toastShow(p.name+' — اتضاف للسلة');return}
  const cardEl=e.target.closest('.p-card');
  if(cardEl){openModal(+cardEl.dataset.idx);return}
});});

/* ---------- PRODUCT MODAL ---------- */
function pmDescHTML(txt){return (txt||'').split('\n').filter(function(l){return l}).map(function(l){
    if(l.indexOf('المميزات')===0)return '<h5>المميزات</h5>';
    if(l.indexOf('محتويات الطقم')===0||l.indexOf('الطقم:')===0)return '<h5>المحتويات</h5>';
    if(l.indexOf('متوفر')===0||l.indexOf('اطلب')===0||l.indexOf('احجز')===0)return '<div class="pm-note">'+l+'</div>';
    return '<div class="fi">'+l+'</div>';
  }).join('')}
let pmItem=null,pmQty=1,pmOpt=0,pmFromPop=false,pmGal=[];
const pmEl=$('#pmodal'),pmOv=$('#pmodal-ov');
function openModal(i){
  pmItem=catalog[i];pmQty=1;
  $('#pm-cat').textContent=pmItem.cat;
  $('#pm-name').textContent=pmItem.name;
  $('#pm-rate').innerHTML=star.repeat(5)+'<small>'+(pmItem.rate||'٤.٨')+' ('+arInt(pmItem.revs||0)+' تقييم)</small>';
  var optsEl=$('#pm-opts');
  if(pmItem.opts&&pmItem.opts.length){pmOpt=(cardSel[i]!=null)?cardSel[i]:defOpt(pmItem);if(pmOpt<0)pmOpt=0;
    optsEl.innerHTML=pmItem.opts.map(function(o,k){return '<button class="pm-opt '+(k===pmOpt?'on':'')+'" data-o="'+k+'">'+o.k+'</button>'}).join('');
    optsEl.style.display='flex';
  }else{optsEl.innerHTML='';optsEl.style.display='none'}
  var dTxt=pmItem.desc;
  if(pmItem.opts&&pmItem.opts.length){var od=pmItem.opts[pmOpt];if(od&&od.d)dTxt=od.d}
  $('#pm-desc').innerHTML=pmDescHTML(dTxt);
  updatePM();
  const photo=$('#pm-photo'),thumbs=$('#pm-thumbs');
  var startO=(pmItem.opts&&pmItem.opts.length)?pmItem.opts[pmOpt]:null;
  var startImg=(startO&&startO.img)||pmItem.img;
  pmGal=(startO&&startO.imgs&&startO.imgs.length)?startO.imgs:(pmItem.imgs||[]);
  if(pmItem.img){
    photo.innerHTML='<img id="pm-img" src="'+startImg+'" loading="lazy" decoding="async" alt="'+pmItem.name+'">';
    thumbs.innerHTML=pmGal.length>1?pmGal.map(function(im,k){return '<img loading="lazy" src="'+im+'" data-k="'+k+'" class="'+(k?'':'on')+'" alt="">'}).join(''):'';
    thumbs.onclick=function(e){
      const t=e.target.closest('img');if(!t)return;
      const pim=$('#pm-img');pim.style.opacity=0;
      setTimeout(function(){pim.src=pmGal[+t.dataset.k];pim.style.opacity=1},170);
      thumbs.querySelectorAll('img').forEach(function(im2,k2){im2.classList.toggle('on',k2===+t.dataset.k)});
    };
  }else{
    photo.innerHTML='<div class="art">'+(ART[pmItem.art]||'')+'</div>';
    thumbs.innerHTML='';
  }
  $('#pm-qty').textContent=arInt(pmQty=1);
  document.body.classList.add('pm-open');
  document.documentElement.classList.add('lock');
  history.pushState({pm:1},'');pmFromPop=false;
}
function updatePM(){
  if(!pmItem)return;
  if(pmItem.opts&&pmItem.opts.length){var o=pmItem.opts[pmOpt]||pmItem.opts[0];
    $('#pm-price').textContent=arInt(o.n*pmQty)+' ج.م';
    $('#pm-old').textContent=o.old?arInt((typeof o.old==='number'?o.old:ar2num(o.old))*pmQty)+' ج.م':'';
    return}
  $('#pm-price').textContent=arInt(pmItem.n*pmQty)+' ج.م';
  $('#pm-old').textContent=pmItem.old?arInt(ar2num(pmItem.old)*pmQty)+' ج.م':'';
}
function closeModal(fromPop){
  document.body.classList.remove('pm-open');
  document.documentElement.classList.remove('lock');
  if(pmEl)pmEl.classList.remove('soon');
  pmSoon=null;
  if(pmFromPop){pmFromPop=false;if(!fromPop)history.back()}
}
$('#pm-close').addEventListener('click',closeModal);
pmOv.addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){closeModal();closeCart();document.body.classList.remove('menu-open')}
});
$('#pm-plus').addEventListener('click',()=>{pmQty=clamp(pmQty+1,1,99);$('#pm-qty').textContent=arInt(pmQty);updatePM()});
$('#pm-minus').addEventListener('click',()=>{pmQty=clamp(pmQty-1,1,99);$('#pm-qty').textContent=arInt(pmQty);updatePM()});
$('#pm-opts').addEventListener('click',function(e){
  var b=e.target.closest('.pm-opt');if(!b||pmSoon!=null||!pmItem||!pmItem.opts)return;
  pmOpt=+b.dataset.o;
  $$('#pm-opts .pm-opt').forEach(function(el,k){el.classList.toggle('on',k===pmOpt)});
  updatePM();
  var o=pmItem.opts[pmOpt];
  if(o&&o.d)$('#pm-desc').innerHTML=pmDescHTML(o.d);
  if(o){
    /* T28: تغيير الخامة = تغيير كل الصور (الرئيسية + كل الثامبنيل) مش صورة واحدة */
    pmGal=(o.imgs&&o.imgs.length)?o.imgs:(pmItem.imgs||[]);
    var first=o.img||(pmGal[0]||'');
    var pim=$('#pm-img');
    if(pim&&first&&pim.getAttribute('src')!==first){pim.style.opacity=0;setTimeout(function(){pim.src=first;pim.style.opacity=1},170)}
    var th=$('#pm-thumbs');
    if(th){th.innerHTML=pmGal.length>1?pmGal.map(function(im,k){return '<img loading="lazy" src="'+im+'" data-k="'+k+'" class="'+(k?'':'on')+'" alt="">'}).join(''):''}
  }
});
$('#pm-add').addEventListener('click',()=>{
  if(!pmItem)return;
  var v=(pmItem.opts&&pmItem.opts.length)?pmItem.opts[pmOpt]:null;
  var an=v?pmItem.name+' - '+v.k:pmItem.name;
  addToCart({name:an,n:v?v.n:pmItem.n,img:(v&&v.img)||pmItem.img,art:pmItem.art},pmQty);
  flyToCart($('#pm-photo'),(v&&v.img)||pmItem.img);morphAdded($('#pm-add'));
  toastShow(an+' — اتضاف للسلة ('+arInt(pmQty)+')');
  setTimeout(closeModal,450);
});

/* ---------- COMING SOON MODAL (2 cards: سكاكين / ترمسات) ---------- */
const SOON3=[
 {name:'أطقم سكاكين على حامل',cat:'أطقم سكاكين',
  imgs:['img/i085.webp','img/i086.webp','img/i087.webp'],
  colors:'٣ موديلات أصلية على حامل: طقم Bass بحامل دائري، وطقم ARSHIA بحامل دوار، وطقم البركة ٩ قطعة — أسود × روز جولد.',
  desc:'سكاكين استانلس أصليه على حامل أنيق — ملمس فاخر وثبات عالي، وكل موديل بيجي بحامله اللي يليق بأي مطبخ.',
  foot:'كلهم أطقم سكاكين على حامل وأصليين — بيوصلوا قريب جدًا لمتجر أوانيستا.'},
 {name:'طقم حلل ومقالي ARSHIA PLUS',cat:'أطقم حلل ومقالي',
  imgs:['img/i088.webp','img/i089.webp'],
  colors:'موديلين بلونين: الأسود والأخضر — بتشطيب مطروق فاخر شكل يخطف العين.',
  desc:'طقم حلل ومقالي ARSHIA PLUS بتشطيب مطروق فاخر — توزيع حرارة ممتاز والطبخ بيستوي بالتساوي كل مرة، وطبقة غير لاصقة بتقلل الزيوت وتسهّل التنظيف، بأغطية محكمة ومقاسات تناسب كل بيت وكل عزومة.',
  foot:'بيوصل قريب جدًا لمتجر أوانيستا — سيب رقمك وهنبّهك أول ما ينزل.'},
 {name:'ترمسات EL ANDALOS GROUP',cat:'ترمسات',
  imgs:['img/i090.webp','img/i091.webp','img/i092.webp','img/i093.webp','img/i094.webp'],
  colors:'٥ ألوان متاحة: الأسود، البيج الفاتح (كريمي)، البيج الغامق، الكريمي الطويل، والبيج الوردي الطويل.',
  desc:'ترمسات مضلعة بلمسات دهبي — حلزون مبهرة وحافظة للحرارة، ومقابض دهبي لامع أو محزز حسب الموديل. ستايل يليق بالضيافة المصرية.',
  foot:'كلها نفس الماركة ونفس الستايل المضلع بالذهبي — بتوصل قريب جدًا لمتجر أوانيستا.'}
];
let pmSoon=null;
function openSoon(j){
  pmSoon=j;const s=SOON3[j],imgs=s.imgs;
  pmEl.classList.add('soon');
  $('#pm-cat').textContent=s.cat;
  $('#pm-name').textContent=s.name;
  var optsEl=$('#pm-opts');optsEl.innerHTML='';optsEl.style.display='none';
  $('#pm-photo').innerHTML='<img id="pm-img" src="'+imgs[0]+'" loading="lazy" decoding="async" alt="'+s.name+'">';
  var thumbs=$('#pm-thumbs');
  thumbs.innerHTML=imgs.length>1?imgs.map(function(im,k){return '<img loading="lazy" src="'+im+'" data-k="'+k+'" class="'+(k?'':'on')+'" alt="">'}).join(''):'';
  thumbs.onclick=function(e){
    const t=e.target.closest('img');if(!t)return;
    const pim=$('#pm-img');pim.style.opacity=0;
    setTimeout(function(){pim.src=imgs[+t.dataset.k];pim.style.opacity=1},170);
    thumbs.querySelectorAll('img').forEach(function(im2,k2){im2.classList.toggle('on',k2===+t.dataset.k)});
  };
  $('#pm-desc').innerHTML='<div class="fi pm-colors">'+s.colors+'</div><div class="fi">'+s.desc+'</div><div class="fi">'+s.foot+'</div>';
  document.body.classList.add('pm-open');
  document.documentElement.classList.add('lock');
  history.pushState({pm:1},'');pmFromPop=false;
}
$('#soon-grid').addEventListener('click',function(e){
  const c=e.target.closest('.s-card');if(c)openSoon(+c.dataset.soon)});
$('#soon-grid').addEventListener('keydown',function(e){
  const c=e.target.closest('.s-card');
  if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();openSoon(+c.dataset.soon)}});

/* back button closes overlays */
addEventListener('popstate',function(){
  if(document.body.classList.contains('pm-open')){closeModal(true);return}
  if(document.body.classList.contains('cart-open')){closeCart(true);return}
  if(document.body.classList.contains('shop-open')){closeShop(true);return}
  if(document.body.classList.contains('menu-open')){document.body.classList.remove('menu-open')}
});

/* ---------- SMOOTH ANCHOR SCROLL (single page — always works) ---------- */
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(!href||href.length<2)return;
    if(href==='#store'){e.preventDefault();openShop();return}
    const el=document.getElementById(href.slice(1));
    if(!el)return;
    e.preventDefault();
    if(document.body.classList.contains('shop-open'))closeShop(true);
    const top=clamp(el.getBoundingClientRect().top+scrollY-70,0,maxY());
    try{scrollTo({top,behavior:reduceMotion?'auto':'smooth'})}catch(err){scrollTo(0,top)}
    try{history.replaceState(null,'',href)}catch(err){}
  });
});
/* deep link: #store opens the shop screen, other hashes scroll to the section */
if(location.hash.length>1){
  const goDeep=()=>{
    if(location.hash==='#store'){openShop();return}
    const el=document.getElementById(location.hash.slice(1));
    if(el){const top=clamp(el.getBoundingClientRect().top+scrollY-70,0,maxY());
      try{scrollTo({top,behavior:'auto'})}catch(err){scrollTo(0,top)}}
  };
  setTimeout(goDeep,reduceMotion?60:150);
}


/* ---------- MAGNETIC BUTTONS + CARD TILT (fine pointers) ---------- */
if(matchMedia('(pointer:fine)').matches&&!reduceMotion){
  $$('[data-magnet]').forEach(btn=>{
    btn.addEventListener('mousemove',e=>{
      const r=btn.getBoundingClientRect();
      btn.style.transform=`translate(${(e.clientX-r.left-r.width/2)*0.2}px,${(e.clientY-r.top-r.height/2)*0.24}px)`;
    });
    btn.addEventListener('mouseleave',()=>{btn.style.transform=''});
  });
  $$('.p-card,.s-card').forEach(card=>{
    card.addEventListener('mouseenter',()=>{card.style.transition='transform .1s linear'});
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(850px) rotateY(${px*6}deg) rotateX(${-py*6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transition='';card.style.transform=''});
  });
}

/* ---------- GLARE follows the cursor on cards ---------- */
document.addEventListener('mousemove',e=>{
  const c=e.target.closest&&e.target.closest('.p-card');
  if(!c)return;
  const r=c.getBoundingClientRect();
  c.style.setProperty('--gx',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
  c.style.setProperty('--gy',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
},{passive:true});

/* ---------- RIPPLE on buttons ---------- */
document.addEventListener('click',e=>{
  const b=e.target.closest&&e.target.closest('.btn,.add-btn,.mv-chip,.f-chip,.p-quick');
  if(!b||!b.getBoundingClientRect)return;
  const r=b.getBoundingClientRect(),sz=Math.max(r.width,r.height)*1.15;
  const s=document.createElement('span');s.className='ripple';
  s.style.cssText='width:'+sz+'px;height:'+sz+'px;left:'+(e.clientX-r.left-sz/2)+'px;top:'+(e.clientY-r.top-sz/2)+'px';
  b.appendChild(s);setTimeout(()=>s.remove(),720);
});

/* ---------- FLY-TO-CART: the actual product photo flies into the cart ---------- */
function tileOf(add){const c=add.closest('.p-card');return (c&&c.querySelector('.p-tile'))||add}
function flyToCart(from,img){
  const tgt=$('#cart-btn');
  if(!from||!tgt||reduceMotion)return;
  const a=from.getBoundingClientRect(),b=tgt.getBoundingClientRect();
  if(!a.width||!b.width)return;
  const sx=a.left+a.width/2,sy=a.top+a.height/2;
  const dx=(b.left+b.width/2)-sx,dy=(b.top+b.height/2)-sy;
  const fly=!!img&&/^(data:image|img\/)/.test(img);
  const node=document.createElement('span');
  node.className=fly?'fly-img':'fly-orb';
  if(fly)node.innerHTML='<img src="'+img+'" alt="">';
  node.style.left=(sx-(fly?34:9))+'px';node.style.top=(sy-(fly?34:9))+'px';
  document.body.appendChild(node);
  if(node.animate){
    node.animate([
      {transform:'translate(0,0) scale(1) rotate(0deg)',opacity:1},
      {transform:'translate('+(dx*.5)+'px,'+(dy*.5-90)+'px) scale(.7) rotate('+(dx>0?-12:12)+'deg)',opacity:.95,offset:.55},
      {transform:'translate('+dx+'px,'+dy+'px) scale(.16) rotate('+(dx>0?-24:24)+'deg)',opacity:.3}
    ],{duration:820,easing:'cubic-bezier(.3,.08,.32,1)',fill:'forwards'});
  }else{
    node.style.transition='top .75s cubic-bezier(.3,-.25,.65,1),left .75s cubic-bezier(.55,.05,.85,.5),transform .75s,opacity .75s';
    requestAnimationFrame(()=>{requestAnimationFrame(()=>{
      node.style.left=(b.left+b.width/2-9)+'px';node.style.top=(b.top+b.height/2-9)+'px';
      node.style.transform='scale(.3)';node.style.opacity='.15';
    })});
  }
  setTimeout(function(){
    node.remove();
    tgt.classList.remove('bump');void tgt.offsetWidth;tgt.classList.add('bump');
  },fly?840:860);
  sparkBurst(sx,sy);
}
/* gold sparkle burst at the add moment */
function sparkBurst(x,y){
  if(reduceMotion)return;
  const cols=['#c49a3a','#e6c87d','#9c7620','#c96f4a'];
  for(let i=0;i<7;i++){
    const s=document.createElement('span');s.className='spark';
    const ang=Math.PI*2*(i/7)+Math.random()*.8,dist=26+Math.random()*32;
    s.style.left=x+'px';s.style.top=y+'px';
    s.style.background=cols[i%4];
    document.body.appendChild(s);
    if(s.animate){
      s.animate([
        {transform:'translate(-50%,-50%) scale(1)',opacity:1},
        {transform:'translate(calc(-50% + '+(Math.cos(ang)*dist).toFixed(1)+'px),calc(-50% + '+(Math.sin(ang)*dist-14).toFixed(1)+'px)) scale(.15)',opacity:0}
      ],{duration:520+Math.random()*260,easing:'cubic-bezier(.2,.7,.3,1)',fill:'forwards'});
    }
    setTimeout(()=>s.remove(),860);
  }
}

/* ---------- SCROLL LOOP: progress bar + parallax + watermark + to-top + nav ---------- */
const toTop=$('#to-top'),ttCircle=$('.tt-ring circle'),pbar=$('#pbar');
const parEls=$$('[data-para]').map(el=>({el,sp:parseFloat(el.dataset.para)||.12,base:0}));
function cachePar(){
  parEls.forEach(o=>{
    const sv=o.el.style.transform;
    o.el.style.transform='none';
    const r=o.el.getBoundingClientRect();
    o.base=r.top+scrollY+r.height/2;
    o.el.style.transform=sv;
  });
}
cachePar();
addEventListener('resize',()=>{cachePar()});
addEventListener('load',cachePar);
setTimeout(cachePar,1200);
const stMark=$('#st-mark'),stSec=$('.statement');
let lastYY=scrollY,downRun=0,lastHideT=0,lastScrollT=0;
function raf(){
  const y=scrollY,vh=innerHeight;
  const max=document.documentElement.scrollHeight-vh;
  if(pbar)pbar.style.width=(max>0?clamp(y/max,0,1)*100:0)+'%';
  ttCircle.style.strokeDashoffset=String(1-clamp(y/Math.max(1,max),0,1));
  toTop.classList.toggle('show',y>650);
  navActive();
  const navBusy=document.body.classList.contains('menu-open')||document.body.classList.contains('cart-open')||
                document.body.classList.contains('pm-open')||document.body.classList.contains('shop-open');
  if(navPin||navBusy||y<lastYY-4||y<=160){nav.classList.remove('hide');downRun=0}
  else if(y>lastYY+4&&y>460){downRun++;if(downRun>=2){nav.classList.add('hide');lastHideT=performance.now()}}
  else downRun=0;
  /* smart auto-return: page idle (no scrolling) for 450ms → the nav slides back in */
  if(nav.classList.contains('hide')&&!navPin&&!navBusy&&performance.now()-lastScrollT>450&&performance.now()-lastHideT>600)
    nav.classList.remove('hide');
  lastYY=y;
  const vc=y+vh/2;
  for(const o of parEls){
    const off=clamp((o.base-vc)*o.sp*-1,-60,60);
    o.el.style.transform=`translate3d(0,${off.toFixed(1)}px,0)`;
  }
  if(stMark&&stSec){
    const r=stSec.getBoundingClientRect();
    if(r.bottom>0&&r.top<vh){
      const p=clamp((vh-r.top)/(vh+r.height),0,1);
      stMark.style.transform=`translate3d(${((.5-p)*130).toFixed(1)}px,0,0)`;
    }
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);
/* pointer near the top = the user wants the nav — pin it (also during smooth scrolls) */
let navPin=false;
addEventListener('pointermove',function(e){navPin=e.clientY<130;if(navPin)nav.classList.remove('hide')},{passive:true});
addEventListener('scroll',function(){lastScrollT=performance.now()},{passive:true});
toTop.addEventListener('click',()=>scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));

/* ---------- GOLD BAND: duplicate content for seamless loop ---------- */
(function(){
  const bi=$('#band-in');
  if(bi)bi.innerHTML+=bi.innerHTML;
})();

/* ---------- OFFER COUNTDOWN (لفترة محدودة — fixed end 1/12/2026) ---------- */
(function(){
  const d=$('#cd-d'),h=$('#cd-h'),m=$('#cd-m'),s=$('#cd-s');
  if(!d)return;
  const end=new Date(2026,11,1,23,59,59,999); // العرض بينتهي 1/12/2026 (1 ديسمبر 2026)
  function tick(){
    const ms=Math.max(0,end-new Date());
    d.textContent=arInt(Math.floor(ms/864e5));
    h.textContent=arInt(Math.floor(ms%864e5/36e5));
    m.textContent=arInt(Math.floor(ms%36e5/6e4));
    s.textContent=arInt(Math.floor(ms%6e4/1e3));
    setTimeout(tick,1000);
  }
  tick();
})();

/* ---------- STATS: counters count up on scroll ---------- */
(function(){
  const els=$$('[data-cnt]');
  if(!els.length)return;
  const setFinal=el=>{
    const t=parseFloat(el.dataset.cnt),d=+(el.dataset.dec||0);
    el.textContent=(el.hasAttribute('data-plus')?'+':'')+arDec(t,d);
  };
  if(reduceMotion||!('IntersectionObserver' in window)){els.forEach(setFinal);return}
  const cObs=new IntersectionObserver(es=>{es.forEach(en=>{
    if(!en.isIntersecting)return;
    const el=en.target;cObs.unobserve(el);
    const target=parseFloat(el.dataset.cnt),dec=+(el.dataset.dec||0),plus=el.hasAttribute('data-plus');
    const t0=performance.now(),DUR=1400;
    (function tick(){
      const p=clamp((performance.now()-t0)/DUR,0,1),e=1-Math.pow(1-p,3);
      el.textContent=(plus?'+':'')+arDec(target*e,dec);
      if(p<1)requestAnimationFrame(tick);
    })();
  })},{threshold:.4});
  els.forEach(el=>cObs.observe(el));
})();

/* ---------- TASK20: نبّهني لما يوصل — real subscriptions + arrival alert ----------
   1) العميل يسيب رقمه → رقمه بيتحفظ على الموقع (localStorage) + بيوصل صاحب المتجر فورًا على واتساب برسالة جاهزة فيها الرقم
   2) لما تشكيلة «قريبًا» تنزل للبيع: حدّث AW_ARRIVALS تحت (خلي القيمة true وزوّد v بـ1)
      → أي عميل سجّل رقمه هيلاقي إشعار «التشكيلة وصلت!» أول ما يفتح الموقع تاني */
var AW_ARRIVALS=window.AW_ARRIVALS||{v:1,knives:false,plus:false,thermos:false};
(function(){
  var KEY='aw_notify_subs';
  function subs(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){return[]}}
  function saveSubs(a){try{localStorage.setItem(KEY,JSON.stringify(a))}catch(e){}}
  var f=$('#sn-form');
  if(f)f.addEventListener('submit',function(e){
    e.preventDefault();
    var inp=$('#sn-phone');
    var v=(inp.value||'').replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/\D/g,'');
    if(!/^01\d{9}$/.test(v)){toastShow('اكتب رقم موبايل صحيح — ١١ رقم يبدأ بـ ٠١');inp.focus();return}
    var list=subs();
    if(!list.some(function(s){return s.p===v})){list.push({p:v,c:'all',t:Date.now()});saveSubs(list)}
    try{localStorage.setItem('aw_notify_me','1')}catch(err){}
    f.classList.add('done');
    var b=f.querySelector('.sn-btn');if(b)b.textContent='اتسجلت ✓';
    toastShow('اتسجلت! هنبعتلك على واتساب أول ما التشكيلة توصل 🎉');
    inp.value='';
    var msg='أهلًا أوانيستا 👋\nعايز نبّهني لما تشكيلة «قريبًا على أوانيستا» توصل المتجر.\nرقمي: '+v+'\nسيبوا رقمي وجاوبوني على واتساب أول ما توصل، شكرًا.';
    window.open('https://wa.me/'+WA_NUM+'?text='+encodeURIComponent(msg),'_blank');
  });
  try{
    var mine=subs(),hit=[];
    if(mine.length){
      if(AW_ARRIVALS.knives)hit.push('أطقم السكاكين');
      if(AW_ARRIVALS.plus)hit.push('أطقم ARSHIA PLUS');
      if(AW_ARRIVALS.thermos)hit.push('الترمسات');
    }
    var seen=+(localStorage.getItem('aw_notified_v')||0);
    if(hit.length&&seen<AW_ARRIVALS.v){
      var el=document.getElementById('arrive');
      if(el){
        var tx=document.getElementById('arr-cols');
        if(tx)tx.textContent=hit.join(' + ')+' بقت متاحة للطلب دلوقتي';
        var cta=document.getElementById('arr-cta');
        if(cta)cta.href='https://wa.me/'+WA_NUM;
        el.classList.add('show');
        var x=document.getElementById('arr-x');
        if(x)x.addEventListener('click',function(){el.classList.remove('show')});
      }
      toastShow('التشكيلة اللي استنيتها وصلت! 🔥');
      try{localStorage.setItem('aw_notified_v',String(AW_ARRIVALS.v))}catch(err){}
    }
  }catch(err){}
})();

/* ---------- VISUAL BOOST: section dots nav ---------- */
(function(){
  const dots=$$('.dot-nav a');if(!dots.length||!('IntersectionObserver' in window))return;
  const dObs=new IntersectionObserver(function(es){
    es.forEach(function(en){
      if(!en.isIntersecting)return;
      dots.forEach(function(d){d.classList.toggle('on',d.getAttribute('href')==='#'+en.target.id)});
    });
  },{rootMargin:'-42% 0px -52% 0px'});
  ['home','featured','store','soon','ring','contact'].forEach(function(id){
    const s=document.getElementById(id);if(s)dObs.observe(s);
  });
})();

/* ---------- VISUAL BOOST: empty-cart CTA ---------- */
(function(){
  const b=$('#cd-shop');if(!b)return;
  b.addEventListener('click',function(){
    closeCart();
    setTimeout(function(){
      const s=document.getElementById('store');
      if(s)try{s.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})}catch(err){s.scrollIntoView()}
    },80);
  });
})();
})();
