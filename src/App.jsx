import { useState, useEffect, useRef } from "react";

/* ── palette ── */
const P = {
  bg: "#06060b",
  s1: "#0d0d16",
  s2: "#14141f",
  bd: "#1e1e30",
  t: "#eaeaf2",
  t2: "#9898b8",
  t3: "#5a5a7a",
  ac: "#7c5cfc",
  ac2: "#a78bfa",
  glow: "rgba(124,92,252,.12)",
  pk: "#f472b6",
  cy: "#22d3ee",
  gn: "#34d399",
  or: "#fbbf24",
  rd: "#f87171",
};

/* ── fonts via google ── */
const fontLink = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap";

/* ── global styles ── */
const globalCSS = `
@import url('${fontLink}');
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth;background:${P.bg}}
body{font-family:'Outfit',sans-serif;color:${P.t};background:${P.bg};-webkit-font-smoothing:antialiased}
::selection{background:${P.ac}40;color:#fff}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:${P.bg}}
::-webkit-scrollbar-thumb{background:${P.bd};border-radius:3px}
a{color:inherit;text-decoration:none}

@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes slideRight{from{width:0}to{width:100%}}
@keyframes glow{0%,100%{box-shadow:0 0 20px ${P.ac}15}50%{box-shadow:0 0 40px ${P.ac}25}}

.fade-up{animation:fadeUp .7s ease both}
.fade-in{animation:fadeIn .5s ease both}
.stagger-1{animation-delay:.1s}
.stagger-2{animation-delay:.2s}
.stagger-3{animation-delay:.3s}
.stagger-4{animation-delay:.4s}
.stagger-5{animation-delay:.5s}

/* ── responsive ── */
.nav-links{display:flex;gap:20px}
.mobile-menu-btn{display:none;background:none;border:none;color:${P.t};font-size:22px;cursor:pointer;padding:4px}
.mobile-overlay{display:none}

.hero-title{font-size:44px}
.hero-desc{font-size:17px}
.roles-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.stats-row{display:flex;gap:36px;flex-wrap:wrap}
.skills-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.contact-card{padding:40px 32px}
.section-title{font-size:28px}

/* tablet ≤ 768px */
@media(max-width:768px){
  .hero-title{font-size:32px}
  .hero-desc{font-size:15px}
  .roles-grid{grid-template-columns:repeat(2,1fr)}
  .stats-row{gap:24px}
  .skills-grid{grid-template-columns:1fr}
  .detail-grid{grid-template-columns:1fr}
  .nav-links{display:none}
  .nav-links.open{display:flex;flex-direction:column;position:fixed;top:54px;left:0;right:0;bottom:0;background:${P.bg}f5;backdrop-filter:blur(20px);padding:32px 24px;gap:24px;z-index:99;animation:fadeIn .2s ease}
  .nav-links.open span{font-size:18px !important}
  .mobile-menu-btn{display:block}
  .mobile-overlay.open{display:block;position:fixed;inset:0;z-index:98}
  .contact-card{padding:28px 20px}
  .section-title{font-size:22px}
}

/* mobile ≤ 480px */
@media(max-width:480px){
  .hero-title{font-size:26px}
  .hero-desc{font-size:14px}
  .roles-grid{grid-template-columns:1fr 1fr}
  .stats-row{gap:16px}
  .contact-card{padding:24px 16px}
  .section-title{font-size:20px}
}
`;

/* ═══════════ DATA ═══════════ */

const ROLES = [
  { icon: "AI", label: "AI Engineer", color: P.ac, desc: "LLM · RAG · Tool Calling · STT · FHIR" },
  { icon: "FS", label: "Full-Stack", color: P.cy, desc: "React · NestJS · Django · AWS" },
  { icon: "ED", label: "Educator", color: P.gn, desc: "ML/DL 강의 · 커리큘럼 설계 · 멘토링" },
  { icon: "BD", label: "Builder", color: P.or, desc: "AI 서비스 0→1 설계 · 구축 · 운영" },
];

/* ── 경력 자동 계산 ── */
const CAREER_START = new Date(2020, 6, 1); // 2020년 7월 (첫 정규직 기준)
function getCareerDuration() {
  const now = new Date();
  let years = now.getFullYear() - CAREER_START.getFullYear();
  let months = now.getMonth() - CAREER_START.getMonth();
  if (months < 0) { years--; months += 12; }
  return { years, months, label: `${years}년 ${months}개월` };
}

const STATS = [
  { num: () => { const c = getCareerDuration(); return `${c.years}.${Math.round(c.months * 10 / 12)}yr`; }, label: "총 경력" },
  { num: () => "6+", label: "상용 서비스" },
  { num: () => "14mo", label: "강의 경력" },
  { num: () => "20+", label: "AI 도구 구축" },
];

const PROJECTS = [
  {
    id: "wangjin",
    title: "재택의료 AI 음성분석 시스템",
    org: "왕진연구소",
    period: "2025.08 — 현재",
    color: P.pk,
    tags: ["pyannote", "ECAPA-TDNN", "faster-whisper", "Qwen", "Neo4j", "FHIR", "vLLM", "Label Studio"],
    summary: "방문진료 현장의 3인 대화(의사/간호사/환자)를 실시간 분석하여 FHIR 표준 의료문서를 자동 생성",
    problem: "재택의료 진료 기록을 수기로 작성하는 비효율과 의료 표준 코딩(ICD-10, SNOMED CT)의 높은 난이도",
    highlights: [
      { title: "화자분리 파이프라인", desc: "pyannote 3.1 + ECAPA-TDNN 192차원 임베딩, SpeechBrain 기반 우선순위 화자 식별 알고리즘으로 의사/간호사/환자 3인 분리" },
      { title: "의료 특화 STT", desc: "faster-whisper large-v3-turbo + 의료 도메인 엔지니어링 → Qwen LLM 후처리로 전문용어 자동 교정" },
      { title: "FHIR 자동생성", desc: "LLM 엔티티 추출 → Neo4j 지식그래프 → ICD-10/SNOMED CT/ATC 표준코드 매핑 → FHIR R4B Bundle. 환각률 25.6% → 정식 크로스맵 적용으로 개선" },
      { title: "데이터 품질검증", desc: "Label Studio Ground Truth + pyannote DER 자동 평가 (speaker mapping + collar 적용)" },
      { title: "실시간 아키텍처", desc: "3-서버 마이크로서비스: WebSocket 스트리밍 → gRPC/GPU 추론 → REST/LLM 후처리. Docker Compose 통합 배포" },
    ],
    architecture: "WebSocket → gRPC/GPU → REST/LLM (3-서버 MSA) · 로컬 GPU 128GB 통합메모리",
    impact: "343건 진료 녹음 자동 구조화 · EMR(BESTCARE) 연동 설계 완료",
    decision: "로컬 GPU 서버 선택 이유: 128GB 통합 메모리로 Qwen를 로컬에서 추론 가능. 의료기관 내부망에서 환자 데이터를 외부로 보내지 않고 처리할 수 있는 구조",
  },
  {
    id: "comduck",
    title: "싸덕 COMDUCK",
    org: "외주 개발",
    period: "2026.01 — 2026.03",
    color: P.ac,
    tags: ["LLM Tool Calling", "RAG", "SSE Streaming", "NestJS", "React", "TypeORM", "PostgreSQL", "Socket.IO", "Electron", "Turborepo"],
    summary: "AI 기반 PC/노트북 추천 + 중고 거래 플랫폼. 자연어로 질문하면 20개+ 전문 도구가 실시간 DB 조회",
    problem: "PC 구매 시 정보 파편화(다나와/중고나라/커뮤니티 분산), 초보자의 스펙 판단 불가, 중고 시세 불투명",
    highlights: [
      { title: "AI 챗봇 '싸덕이'", desc: "LLM + SSE 스트리밍 + Tool Calling 20개+ 도구. RAG: 문서 청킹 → 벡터 임베딩 → 유사도 검색 → 컨텍스트 주입. 다회차 대화 흐름 관리" },
      { title: "프로그램 기반 추천", desc: "200개+ 프로그램 DB. '포토샵+프리미어' 입력 → 최적 사양 자동 매칭. 100점 만점 매칭 점수(성능/가성비/휴대성/디스플레이)" },
      { title: "PC 빌더 호환성 엔진", desc: "8개 부품 카테고리 소켓/폼팩터/전력 자동 검증. CPU/GPU 밸런스 점수 + 병목 감지. 용도별 예산 배분" },
      { title: "중고 시세 인텔리전스", desc: "3단계 캐스케이드(내부→Agent→스크래핑) + IQR 이상치 제거. 1,700+ GPU 배치 업데이트. 15개+ 감가상각 팩터" },
      { title: "데스크톱 앱", desc: "Electron으로 CPU/GPU/RAM/스토리지 자동 감지 → 서버 연동 기기 등록 및 판매" },
    ],
    architecture: "React 18 + NestJS 11 + TypeORM + PostgreSQL + Socket.IO + AWS S3 (Turborepo 모노레포)",
    impact: "200개+ 프로그램 DB · 1,700+ GPU 시세 · 프로그램 기반 추천(업계 최초 수준)",
    decision: "Tool Calling 20개+ 도구를 선택한 이유: 단순 RAG만으로는 실시간 가격/재고/호환성 검증이 불가능. 도구별로 DB 쿼리, 외부 API, 계산 로직을 분리해야 정확도와 응답 속도를 모두 확보",
  },
  {
    id: "klleon",
    title: "AI 아바타 플랫폼",
    org: "클레온 (정규직 3년)",
    period: "2020.12 — 2023.11",
    color: P.cy,
    tags: ["PyTorch", "TensorRT", "WebRTC", "GStreamer", "C++", "Kotlin", "Python Ray", "NestJS", "Django", "AWS"],
    summary: "딥러닝 기반 얼굴합성·입모양 생성 모델 서빙부터 WebRTC 실시간 스트리밍, 미디어 처리까지 end-to-end",
    problem: "실시간으로 얼굴을 합성하고 입모양을 생성하여 자연스러운 AI 아바타 영상을 만드는 기술적 난제",
    highlights: [
      { title: "딥러닝 Worker", desc: "Segmentation → 얼굴합성 latent 조절 → 입모양 생성 smoothing → PyTorch to TensorRT 양자화. Tensor 차원/색상 반전 문제 트래킹 및 해결" },
      { title: "Ray 병렬처리", desc: "multi-GPU/multi-core 동영상 프레임 단위를 actor 단위로 병렬 처리하는 코드 개발" },
      { title: "WebRTC 시스템", desc: "C++ GStreamer 영상/음성 송출 파이프라인 + Python Signalling 서버 + React 클라이언트 (ICE/SDP 교환)" },
      { title: "미디어 서버", desc: "Kotlin FFmpeg Builder. concat merge로 re-encoding 대비 1.8배 속도 향상. 세로영상 자막 적용" },
      { title: "인프라", desc: "Django→NestJS 1:1 리팩토링 + 5만건 DB 마이그레이션. AWS ECR/VPC(dev·prod)/EBS Auto Scaling/MediaConvert" },
    ],
    architecture: "Django/NestJS + PyTorch Worker + GStreamer/WebRTC + AWS (ECR/EBS/RDS/S3)",
    impact: "상용 서비스 3년 운영 · 얼굴합성 전체 파이프라인 구축 · CI/CD 자동화",
    decision: "Django→NestJS 리팩토링 결정: 타입 안전성과 DI 구조가 필요했고, 프론트엔드(React)와 언어 통일로 팀 생산성 향상. 5만건 데이터 무중단 마이그레이션 수행",
  },
  {
    id: "education",
    title: "부트캠프 주강사",
    org: "프리랜서",
    period: "2024.10 — 2025.11",
    color: P.gn,
    tags: ["ML/DL 전 과정", "Python", "React", "NestJS", "GraphQL", "AWS", "Docker", "영어 강의", "커리큘럼 설계"],
    summary: "AI 헬스케어 ML, Node.js 풀스택, 인도네시아 현지 영어 강의 — 커리큘럼 설계부터 교재 제작, 강의, 멘토링",
    problem: "비전공자와 주니어 개발자에게 복잡한 ML/DL 개념과 풀스택 기술을 실무 수준으로 전달하는 과제",
    highlights: [
      { title: "AI 헬스케어 ML 전 과정", desc: "회귀 → 분류 → SVM → 앙상블 → PCA → K-Means → DBSCAN. 헬스케어 데이터 실습 프로젝트(고위험 환자 탐지) 직접 설계" },
      { title: "DB & SQL 실무", desc: "환자 데이터 RDBMS 설계, 1~3NF 정규화, 인덱스 최적화, ORM 기반 고위험 환자 자동 필터링 시스템" },
      { title: "Node.js 풀스택", desc: "JS 기초 → React → NestJS → GraphQL → WebSocket → AWS 배포 → Docker. 알고리즘/자료구조 포함" },
      { title: "해외 강의", desc: "인도네시아 현지 영어 강의: JS/React/Python Data Science/AWS DevOps. 풀스택 전 과정 영어로 진행" },
      { title: "성과", desc: "수강생 만족도 상위권 → 인센티브 지급. Django/React 실시간 강의, 비대면 AI 멘토링 병행" },
    ],
    architecture: "직접 설계 커리큘럼 + 교재 제작 + 라이브 코딩 + 프로젝트 코칭",
    impact: "1년 2개월 · 다수 기수 · 만족도 상위권 · 해외 강의 경험",
    decision: "헬스케어 도메인 선택 이유: 실제 의미있는 데이터로 학습해야 수강생이 ML의 가치를 체감. 환자 데이터 기반 고위험 탐지 프로젝트는 실무 전환 시 가장 참고하기 좋은 포트폴리오가 됨",
  },
];

const SKILLS = {
  "AI / ML": { color: P.pk, items: ["LLM (Tool Calling · RAG · SSE)", "PyTorch", "TensorFlow", "faster-whisper", "pyannote", "vLLM / Ollama", "Neo4j", "FHIR", "Label Studio"] },
  "Backend": { color: P.ac, items: ["NestJS", "Django", "FastAPI", "Spring Boot", "GraphQL", "Socket.IO", "TypeORM"] },
  "Database": { color: P.rd, items: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Elasticsearch"] },
  "Frontend": { color: P.cy, items: ["React", "TypeScript", "Svelte", "Electron", "Ant Design", "Zustand", "TanStack Query"] },
  "Infra / DevOps": { color: P.gn, items: ["AWS (EC2·S3·RDS·ECR·VPC·EBS)", "Docker", "Jenkins", "GitHub Actions", "Turborepo"] },
  "Systems": { color: P.or, items: ["C++", "Kotlin", "GStreamer", "WebRTC", "OpenCV", "Python Ray", "GPGPU", "FFmpeg"] },
};

const TIMELINE = [
  { year: "2014", text: "홍익대학교 서울캠퍼스 컴퓨터공학과 수석입학", type: "award" },
  { year: "2019", text: "고려대 인턴 — 알츠하이머 PET 영상 예측 (AutoEncoder + T-SNE)", type: "work" },
  { year: "2020", text: "홍익대 졸업 · 해커톤 최우수상 + 우수상 (중고차 시세 예측, LoL 승률 예측)", type: "award" },
  { year: "2020", text: "클레온 입사 — 딥러닝 Worker, WebRTC, 미디어 서버 개발, 풀스택 개발", type: "work" },
  { year: "2023", text: "클레온 퇴사 (3년) · 프리랜서 전환 · 외주 개발 시작", type: "work" },
  { year: "2024", text: "부트캠프 주강사 — ML/DL 전 과정 · 풀스택 · 인도네시아 영어 강의", type: "edu" },
  { year: "2025", text: "왕진연구소 — 재택의료 AI 음성분석 시스템", type: "work" },
  { year: "2026", text: "싸덕 COMDUCK — AI 추천 플랫폼", type: "work" },
];

const CONTACTS = [
  { label: "dongwon1103@naver.com", href: "mailto:dongwon1103@naver.com" },
  { label: "github.com/tunalee", href: "https://github.com/tunalee" },
];

/* ═══════════ COMPONENTS ═══════════ */

function Badge({ children, color = P.ac }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6, fontSize: 11,
      fontWeight: 500, background: color + "14", color, border: `1px solid ${color}22`,
      marginRight: 5, marginBottom: 5, fontFamily: "'JetBrains Mono', monospace",
    }}>{children}</span>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <div style={{ width: 32, height: 2, background: `linear-gradient(90deg, ${P.ac}, transparent)` }} />
        <h2 className="section-title" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{children}</h2>
      </div>
      {sub && <p style={{ fontSize: 14, color: P.t2, marginLeft: 44 }}>{sub}</p>}
    </div>
  );
}

function ProjectCard({ project, isOpen, onToggle }) {
  const { title, org, period, color, tags, summary, problem, highlights, architecture, impact, decision } = project;
  return (
    <div
      onClick={onToggle}
      style={{
        background: isOpen ? P.s2 : P.s1,
        border: `1px solid ${isOpen ? color + "40" : P.bd}`,
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 16,
        cursor: "pointer",
        transition: "all .3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* accent top line */}
      {isOpen && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${color}, transparent)` }} />}

      {/* header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <div>
              <h3 style={{ fontSize: 19, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>{title}</h3>
              <span style={{ fontSize: 12, color: P.t2, fontFamily: "'JetBrains Mono', monospace" }}>{org} · {period}</span>
            </div>
          </div>
          <p style={{ fontSize: 14, color: P.t, opacity: 0.85, lineHeight: 1.65, margin: "0 0 12px" }}>{summary}</p>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {tags.slice(0, isOpen ? tags.length : 5).map(t => <Badge key={t} color={color}>{t}</Badge>)}
            {!isOpen && tags.length > 5 && <Badge color={P.t3}>+{tags.length - 5}</Badge>}
          </div>
        </div>
        <div style={{
          fontSize: 14, color: P.t3, transition: "transform .2s",
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0, marginTop: 4,
        }}>▼</div>
      </div>

      {/* expanded */}
      {isOpen && (
        <div style={{ marginTop: 24, paddingTop: 24, borderTop: `1px solid ${P.bd}` }}>
          {/* problem */}
          <div style={{ background: P.bg, borderRadius: 10, padding: 16, marginBottom: 20, borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Problem</div>
            <p style={{ fontSize: 13, color: P.t, lineHeight: 1.65, margin: 0 }}>{problem}</p>
          </div>

          {/* highlights */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 14 }}>What I Built</div>
            {highlights.map((h, i) => (
              <div key={i} style={{ marginBottom: 14, paddingLeft: 16, borderLeft: `2px solid ${color}25` }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: P.t, marginBottom: 3 }}>{h.title}</div>
                <div style={{ fontSize: 13, color: P.t2, lineHeight: 1.65 }}>{h.desc}</div>
              </div>
            ))}
          </div>

          {/* decision */}
          <div style={{ background: P.bg, borderRadius: 10, padding: 16, marginBottom: 16, borderLeft: `3px solid ${P.or}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: P.or, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Why This Approach</div>
            <p style={{ fontSize: 13, color: P.t2, lineHeight: 1.65, margin: 0 }}>{decision}</p>
          </div>

          {/* arch + impact */}
          <div className="detail-grid">
            <div style={{ background: P.bg, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Architecture</div>
              <div style={{ fontSize: 12, color: P.t, lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace" }}>{architecture}</div>
            </div>
            <div style={{ background: P.bg, borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: P.t3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Impact</div>
              <div style={{ fontSize: 12, color: P.t, lineHeight: 1.6 }}>{impact}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════ MAIN ═══════════ */

export default function Portfolio() {
  const [openProject, setOpenProject] = useState(null);
  const [activeNav, setActiveNav] = useState("hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const ids = ["hero", "projects", "skills", "timeline", "contact"];
    const onScroll = () => {
      setScrolled((window.scrollY || 0) > 40);
      let current = "hero";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) current = id;
        }
      }
      setActiveNav(current);
    };
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "timeline", label: "Career" },
    { id: "contact", label: "Contact" },
  ];

  const wrap = { maxWidth: 880, margin: "0 auto", padding: "0 24px" };

  return (
    <div style={{ background: P.bg, minHeight: "100vh" }}>
      <style>{globalCSS}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, padding: "0 24px",
        background: scrolled ? P.bg + "e8" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: `1px solid ${scrolled ? P.bd : "transparent"}`,
        transition: "all .3s ease",
      }}>
        <div style={{ ...wrap, display: "flex", justifyContent: "space-between", alignItems: "center", height: 54, padding: 0 }}>
          <span onClick={() => {
            setActiveNav("hero");
            const el = document.getElementById("hero");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }} style={{ fontWeight: 800, fontSize: 15, color: P.ac, display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>//</span> 개발참치
          </span>
          <button className="mobile-menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="메뉴">
            {menuOpen ? "✕" : "☰"}
          </button>
          {menuOpen && <div className={`mobile-overlay${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(false)} />}
          <div className={`nav-links${menuOpen ? " open" : ""}`}>
            {navItems.map(n => (
              <span key={n.id} onClick={() => {
                setActiveNav(n.id);
                setMenuOpen(false);
                const el = document.getElementById(n.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }} style={{
                fontSize: 12, fontWeight: activeNav === n.id ? 600 : 400,
                color: activeNav === n.id ? P.ac : P.t3,
                transition: "color .2s", fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
              }}>{n.label}</span>
            ))}
          </div>
        </div>
      </nav>

      <div style={wrap}>
        {/* ── HERO ── */}
        <section id="hero" style={{ paddingTop: 80, paddingBottom: 72 }}>
          <div className="fade-up">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: P.glow, border: `1px solid ${P.ac}20`, borderRadius: 20,
              padding: "5px 14px", fontSize: 12, color: P.ac2, marginBottom: 20,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.gn, animation: "pulse 2s infinite" }} />
              경력 {getCareerDuration().label} · Available for hire
            </div>
          </div>

          <h1 className="fade-up stagger-1 hero-title" style={{ fontWeight: 900, lineHeight: 1.15, marginBottom: 16, letterSpacing: "-0.03em" }}>
            만들고, 가르치고,<br />
            <span style={{ background: `linear-gradient(135deg, ${P.ac}, ${P.pk})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              사업으로 연결합니다.
            </span>
          </h1>

          <p className="fade-up stagger-2 hero-desc" style={{ color: P.t2, lineHeight: 1.75, maxWidth: 580, marginBottom: 36 }}>
            LLM/RAG 기반 AI 서비스부터 프론트엔드, 백엔드, 데스크톱 앱, GPU 인프라까지
            end-to-end로 만듭니다. 그리고 그걸 가르칩니다.
          </p>

          {/* Role Cards */}
          <div className="fade-up stagger-3 roles-grid" style={{ marginBottom: 36 }}>
            {ROLES.map(r => (
              <div key={r.label} style={{
                background: P.s1, border: `1px solid ${P.bd}`, borderRadius: 14,
                padding: "18px 14px", textAlign: "center", transition: "border-color .2s, transform .2s",
              }}>
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, color: r.color, fontFamily: "'JetBrains Mono', monospace", background: r.color + "15", width: 36, height: 36, borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{r.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: r.color, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 10, color: P.t3, lineHeight: 1.45, fontFamily: "'JetBrains Mono', monospace" }}>{r.desc}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="fade-up stagger-4 stats-row">
            {STATS.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 26, fontWeight: 900, color: P.ac, fontFamily: "'JetBrains Mono', monospace" }}>{s.num()}</div>
                <div style={{ fontSize: 11, color: P.t3, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ marginBottom: 72 }}>
          <SectionTitle sub="클릭하면 Problem → Solution → Why 구조로 상세 내용이 펼쳐집니다">Projects</SectionTitle>
          {PROJECTS.map(p => (
            <ProjectCard
              key={p.id}
              project={p}
              isOpen={openProject === p.id}
              onToggle={() => setOpenProject(openProject === p.id ? null : p.id)}
            />
          ))}
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ marginBottom: 72 }}>
          <SectionTitle sub="실무에서 사용해온 기술 스택">Skills</SectionTitle>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([cat, { color, items }]) => (
              <div key={cat} style={{
                background: P.s1, border: `1px solid ${P.bd}`, borderRadius: 14, padding: 22,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: color + "60" }} />
                <h4 style={{ fontSize: 13, fontWeight: 700, color, margin: "0 0 14px 8px", fontFamily: "'JetBrains Mono', monospace" }}>{cat}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, paddingLeft: 8 }}>
                  {items.map(i => (
                    <span key={i} style={{
                      padding: "4px 10px", borderRadius: 6, fontSize: 11,
                      background: P.bg, color: P.t, border: `1px solid ${P.bd}`,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section id="timeline" style={{ marginBottom: 72 }}>
          <SectionTitle sub="2019 — 현재">Career Timeline</SectionTitle>
          <div style={{ position: "relative", paddingLeft: 32 }}>
            <div style={{ position: "absolute", left: 7, top: 0, bottom: 0, width: 2, background: `linear-gradient(180deg, ${P.ac}, ${P.pk}, ${P.cy}, ${P.gn})` }} />
            {TIMELINE.map((t, i) => {
              const dotColor = t.type === "award" ? P.or : t.type === "edu" ? P.gn : P.ac;
              return (
                <div key={i} style={{ position: "relative", marginBottom: 24, paddingLeft: 22 }}>
                  <div style={{
                    position: "absolute", left: -28, top: 4, width: 16, height: 16,
                    borderRadius: "50%", background: dotColor, border: `3px solid ${P.bg}`,
                    boxShadow: `0 0 8px ${dotColor}30`,
                  }} />
                  <div style={{ fontSize: 11, color: P.t3, fontWeight: 600, marginBottom: 3, fontFamily: "'JetBrains Mono', monospace" }}>{t.year}</div>
                  <div style={{ fontSize: 14, color: P.t, lineHeight: 1.55 }}>{t.text}</div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" style={{ marginBottom: 64 }}>
          <SectionTitle sub="프로젝트 의뢰 · 교육 협업 · 채용 제안 환영합니다">Contact</SectionTitle>
          <div className="contact-card" style={{
            background: P.s1, border: `1px solid ${P.bd}`, borderRadius: 16,
            textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${P.ac}, ${P.pk}, ${P.cy})` }} />
            <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 12, color: P.ac, fontFamily: "'JetBrains Mono', monospace" }}>//</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 4px" }}>개발참치</h3>
            <p style={{ color: P.t2, margin: "0 0 6px", fontSize: 14 }}>AI 엔지니어 & 풀스택 개발자 & 교육자</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
              {CONTACTS.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 20px",
                  background: P.bg, border: `1px solid ${P.bd}`, borderRadius: 10,
                  fontSize: 13, transition: "border-color .2s",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <span>{c.label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ textAlign: "center", padding: "32px 0 48px", borderTop: `1px solid ${P.bd}` }}>
          <p style={{ fontSize: 12, color: P.t3, fontFamily: "'JetBrains Mono', monospace" }}>
            © 2026 개발참치
          </p>
        </footer>
      </div>
    </div>
  );
}
