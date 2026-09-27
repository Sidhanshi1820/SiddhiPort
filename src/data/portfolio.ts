// ==========================================================================
// ALL SITE CONTENT LIVES HERE — edit this file to make the portfolio yours.
// Source of truth: Sidhanshi Srivastava's resume (updated Sep 2026).
// ==========================================================================

export const profile = {
  name: 'Sidhanshi Srivastava',
  firstName: 'SIDHANSHI',
  lastName: 'SRIVASTAVA',
  initials: 'SS',

  role: 'B.Tech CSE (Cyber Security) — Security Tooling & Network Analysis',
  tagline:
    'I build end-to-end security tools and automation scripts across networking, OS-level administration, and web application layers — to help protect systems and data from cyber threats.',
  location: 'Greater Noida, India',

  email: 'sidhanshisrivastava00@gmail.com',
  availability:
    'Seeking a cybersecurity internship — open to SOC work, security research, and ambitious builds.',

  // "system.status" panel shown in the About section.
  stats: [
    { label: 'role', value: 'B.Tech CSE — Cyber Security' },
    { label: 'campus', value: 'NIET, Greater Noida · CGPA 8.4' },
    { label: 'core_stack', value: 'Python · C · JavaScript' },
    { label: 'specialty', value: 'Network analysis · AI for security' },
    { label: 'status', value: 'open to internships' },
  ],

  socials: [
    { label: 'GitHub', url: 'https://github.com/Sidhanshi1820' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/sidhanshi-cybersecurity' },
  ],
}

export interface Project {
  index: string
  title: string
  tagline: string
  description: string
  tech: string[]
  accent: string
  links: { live: string; source: string }
}

export const projects: Project[] = [
  {
    index: '01',
    title: 'FAKE WI-FI DETECTOR',
    tagline: 'python · local llm · kali linux — status: active',
    description:
      'A Python-based detection tool that identifies unauthorized access points and deauthentication flood attacks associated with Evil Twin attacks. Live captures from Wireshark and Aircrack-ng feed a locally hosted Qwen-based LLM that reasons over scan output and flags rogue APs in real time — no cloud dependency.',
    tech: ['Python', 'Qwen LLM (local)', 'Kali Linux', 'Wireshark', 'Aircrack-ng'],
    accent: '#67e8f9',
    links: {
      live: 'https://github.com/Sidhanshi1820',
      source: 'https://github.com/Sidhanshi1820',
    },
  },
  {
    index: '02',
    title: 'CRYPTOGRAPHIC SYSTEM',
    tagline: 'python · fastapi · pytorch — status: research',
    description:
      'System architecture and data pipeline for an automated, AI-driven cryptographic management platform. FastAPI services with Redis + Celery workers, scikit-learn and PyTorch models driving real-time anomaly detection — designed end to end around confidentiality, integrity, and availability.',
    tech: ['Python', 'FastAPI', 'scikit-learn', 'PyTorch', 'Redis', 'Celery', 'Docker'],
    accent: '#a78bfa',
    links: {
      live: 'https://github.com/Sidhanshi1820',
      source: 'https://github.com/Sidhanshi1820',
    },
  },
  {
    index: '03',
    title: 'SECURE EVENT MANAGER',
    tagline: 'php · mysql · rest apis — status: shipped',
    description:
      'Full system architecture and database flow for a secure event management platform — HTML5/CSS3/JavaScript front end, PHP + MySQL back end exposed through REST APIs and JSON contracts — architected around the confidentiality–integrity–availability triad with hardened data flow between layers.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'REST APIs'],
    accent: '#f472b6',
    links: {
      live: 'https://github.com/Sidhanshi1820',
      source: 'https://github.com/Sidhanshi1820',
    },
  },
]

export const skillGroups = [
  { title: 'Languages', skills: ['Python', 'C', 'HTML', 'JavaScript'] },
  { title: 'Networking', skills: ['TCP/IP & DNS', 'HTTP/HTTPS', 'Packet Analysis', 'Network Scanning', 'Wireshark', 'Nmap'] },
  { title: 'Systems & Tooling', skills: ['Kali Linux', 'Arch', 'Ubuntu', 'Windows', 'Docker', 'Git'] },
  { title: 'Offensive Security', skills: ['Penetration Testing', 'Metasploit', 'Burp Suite', 'OWASP Top 10', 'SQLi & XSS Testing', 'CTF Challenges'] },
  { title: 'Monitoring & Defense', skills: ['SOC Analysis', 'SIEM', 'Aircrack-ng', 'Incident Response', 'Log Analysis'] },
  { title: 'AI & Automation', skills: ['Local LLM Deployment', 'PyTorch', 'LangChain', 'Gemini API', 'Security Automation'] },
]

// Short labels for the 3D protocol ring — long skill names don't fit in 3D text.
const RING_SKILLS = [
  'PYTHON',
  'KALI LINUX',
  'WIRESHARK',
  'NMAP',
  'BURP SUITE',
  'METASPLOIT',
  'PYTORCH',
  'OWASP',
]

export function ringSkills(count = 8): string[] {
  return RING_SKILLS.slice(0, count)
}

export const education = {
  degree: 'B.Tech — Computer Science & Engineering (Cyber Security)',
  school: 'Noida Institute of Engineering and Technology, Greater Noida, UP',
  period: '2024 — pursuing',
  cgpa: '8.4',
}

export const certifications = [
  { name: 'Security Analyst Job Simulation', issuer: 'Tata · Forage', year: 'Jul 2025' },
  { name: 'Python Programming Internship', issuer: 'CodSoft', year: 'Jul 2025' },
  { name: 'Introduction to Cybersecurity', issuer: 'Cisco', year: 'Feb 2026' },
]

export const PAGE_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work-1', label: 'Case file 01' },
  { id: 'work-2', label: 'Case file 02' },
  { id: 'work-3', label: 'Case file 03' },
  { id: 'skills', label: 'Protocols' },
  { id: 'contact', label: 'Uplink' },
]

export const NAV_LINKS = [
  { label: 'Identity', target: '#about' },
  { label: 'Case files', target: '#work-1' },
  { label: 'Protocols', target: '#skills' },
  { label: 'Uplink', target: '#contact' },
]
