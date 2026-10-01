// ==========================================================================
// ALL SITE CONTENT LIVES HERE. Edit this file to make the portfolio yours.
// Source of truth: Sidhanshi Srivastava's resume (updated Sep 2026).
// ==========================================================================

export const profile = {
  name: 'Sidhanshi Srivastava',
  firstName: 'Sidhanshi',
  lastName: 'Srivastava',
  initials: 'SS',

  role: 'B.Tech CSE (Cyber Security) · Security Tooling & Network Analysis',
  tagline:
    'I build end-to-end security tools and automation scripts across networking, OS-level administration, and web application layers to help protect systems and data from cyber threats.',
  location: 'Greater Noida, India',

  email: 'sidhanshisrivastava00@gmail.com',
  availability:
    'Seeking a cybersecurity internship. Open to SOC work, security research, and collaborative projects.',

  // Platform profiles. TryHackMe/HackTheBox/X/Discord are placeholders —
  // drop in the real profile URLs when they exist.
  socials: [
    { label: 'GitHub', url: 'https://github.com/Sidhanshi1820' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/sidhanshi-cybersecurity' },
    { label: 'TryHackMe', url: 'https://tryhackme.com' },
    { label: 'HackTheBox', url: 'https://www.hackthebox.eu' },
  ],
  socialIcons: [
    { label: 'GitHub', url: 'https://github.com/Sidhanshi1820', icon: 'github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/sidhanshi-cybersecurity', icon: 'linkedin' },
    { label: 'Email', url: 'mailto:sidhanshisrivastava00@gmail.com', icon: 'mail' },
    {
      label: 'Resume',
      url: '/Sidhanshi-Srivastava-Resume.pdf',
      icon: 'resume',
    },
  ],
}

export interface SkillPanel {
  title: string
  rows: Array<{ name: string; level: 'Core' | 'Proficient' | 'Learning'; desc: string }>
}

// "Skills & Tools" section — two panels, levels from the resume.
export const skillPanels: SkillPanel[] = [
  {
    title: 'Cyber Security',
    rows: [
      {
        name: 'Network Security',
        level: 'Core',
        desc: 'Packet analysis, protocol analysis and network troubleshooting',
      },
      {
        name: 'Penetration Testing',
        level: 'Proficient',
        desc: 'VAPT methodology, exploitation and CTF challenges',
      },
      {
        name: 'Web Application Security',
        level: 'Proficient',
        desc: 'OWASP Top 10, SQL injection & XSS testing, Burp Suite interception',
      },
      {
        name: 'Security Monitoring',
        level: 'Proficient',
        desc: 'SOC analysis, SIEM, incident response and log analysis',
      },
      {
        name: 'Wireless Security',
        level: 'Proficient',
        desc: 'Aircrack-based wifi auditing and rogue AP detection',
      },
    ],
  },
  {
    title: 'Programming & Tools',
    rows: [
      {
        name: 'Python',
        level: 'Core',
        desc: 'Security automation, scripting and application development',
      },
      {
        name: 'Wireshark',
        level: 'Core',
        desc: 'Network protocol analysis and traffic monitoring',
      },
      {
        name: 'Kali Linux',
        level: 'Proficient',
        desc: 'Penetration testing and security auditing platform',
      },
      {
        name: 'Nmap',
        level: 'Proficient',
        desc: 'Host discovery, port scanning and service enumeration',
      },
      {
        name: 'Metasploit',
        level: 'Learning',
        desc: 'Exploitation framework and vulnerability testing',
      },
      {
        name: 'AI & Automation',
        level: 'Learning',
        desc: 'Local LLM deployment, Gemini API, PyTorch and LangChain',
      },
    ],
  },
]

export interface SkillCategory {
  title: string
  skills: string[]
}

// "Skills & Tools" section — all seven categories from the resume.
export const skillCategories: SkillCategory[] = [
  {
    title: 'Programming',
    skills: ['Python', 'C', 'HTML', 'JavaScript'],
  },
  {
    title: 'Computer Networking',
    skills: ['TCP/IP', 'DNS', 'HTTP/HTTPS', 'Packet Analysis', 'Network Scanning', 'Protocol Analysis', 'Network Troubleshooting'],
  },
  {
    title: 'Linux & Systems',
    skills: ['Kali Linux', 'Arch', 'Ubuntu', 'Windows', 'Docker', 'Git'],
  },
  {
    title: 'Ethical Hacking & VAPT',
    skills: ['Penetration Testing', 'Exploitation (Metasploit)', 'CTF Challenges'],
  },
  {
    title: 'Web Application Security',
    skills: ['OWASP Top 10', 'SQL Injection & XSS Testing', 'HTTP Request Interception', 'Burp Suite'],
  },
  {
    title: 'Security Monitoring & Tools',
    skills: ['Wireshark', 'Nmap', 'Aircrack-ng', 'Incident Response', 'Log Analysis'],
  },
  {
    title: 'AI & Automation',
    skills: ['Python-based Security Automation', 'Local LLM Deployment', 'Gemini API', 'PyTorch', 'LangChain'],
  },
]

// Hands-on practice areas shown in the CTF write-ups section.
export const ctfLabs = [
  {
    title: 'WEB EXPLOITATION LABS',
    tagline: 'burp suite · owasp top 10',
    description:
      'Hands-on practice with SQL injection, XSS and auth-bypass challenges. Requests proxied through Burp Suite, findings written up as reproducible steps.',
  },
  {
    title: 'NETWORK FORENSICS',
    tagline: 'wireshark · packet analysis',
    description:
      'Capture-the-packet exercises: following TCP/HTTP streams, spotting suspicious DNS and ARP traffic, and reconstructing what happened from a .pcap alone.',
  },
  {
    title: 'RECON & ENUMERATION',
    tagline: 'nmap · metasploit · linux',
    description:
      'Lab machines walked end to end — host discovery, service enumeration, exploit research and privilege-escalation notes, documented machine by machine.',
  },
]

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
    tagline: 'python · local llm · kali linux · status: active',
    description:
      'A Python-based detection tool that identifies unauthorized access points and deauthentication flood attacks associated with Evil Twin attacks. Live captures from Wireshark and Aircrack-ng feed a locally hosted Qwen-based LLM that reasons over scan output and flags rogue APs in real time. No cloud dependency.',
    tech: ['Python', 'Qwen LLM (local)', 'Kali Linux', 'Wireshark', 'Aircrack-ng'],
    accent: '#2ba8a2',
    links: {
      live: 'https://github.com/Sidhanshi1820',
      source: 'https://github.com/Sidhanshi1820',
    },
  },
  {
    index: '02',
    title: 'CRYPTOGRAPHIC SYSTEM',
    tagline: 'python · fastapi · pytorch · status: research',
    description:
      'System architecture and data pipeline for an automated, AI-driven cryptographic management platform. FastAPI services with Redis + Celery workers, scikit-learn and PyTorch models driving real-time anomaly detection. Designed end to end around confidentiality, integrity, and availability.',
    tech: ['Python', 'FastAPI', 'scikit-learn', 'PyTorch', 'Redis', 'Celery', 'Docker'],
    accent: '#e6b800',
    links: {
      live: 'https://github.com/Sidhanshi1820',
      source: 'https://github.com/Sidhanshi1820',
    },
  },
  {
    index: '03',
    title: 'SECURE EVENT MANAGER',
    tagline: 'php · mysql · rest apis · status: shipped',
    description:
      'Full system architecture and database flow for a secure event management platform: HTML5/CSS3/JavaScript front end, PHP + MySQL back end exposed through REST APIs and JSON contracts. Architected around the confidentiality–integrity–availability triad with hardened data flow between layers.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL', 'REST APIs'],
    accent: '#ef6c4a',
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
  { title: 'Monitoring & Defense', skills: ['Aircrack-ng', 'Incident Response', 'Log Analysis'] },
  { title: 'AI & Automation', skills: ['Local LLM Deployment', 'PyTorch', 'LangChain', 'Gemini API', 'Security Automation'] },
]

// Short labels for the 3D protocol ring (long skill names don't fit in 3D text).
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
  degree: 'B.Tech · Computer Science & Engineering (Cyber Security)',
  school: 'Noida Institute of Engineering and Technology, Greater Noida, UP',
  period: '2024 · pursuing',
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
  { id: 'contact', label: 'Contact' },
]

export const NAV_LINKS = [
  { label: 'About me', target: '#about' },
  { label: 'Projects', target: '#projects' },
  { label: 'CTF write-ups', target: '#ctf' },
  { label: 'Achievements', target: '#achievements' },
  { label: 'Skills', target: '#skills' },
  { label: 'Certifications', target: '#certifications' },
  { label: 'Contact me', target: '#contact' },
]

// Practice platforms showcased in the Achievements section.
export const platforms = [
  {
    label: 'TryHackMe',
    url: 'https://tryhackme.com',
    desc: 'Guided offensive-security labs and learning paths — recon, web exploitation and privilege-escalation exercises, tracked with points and badges.',
  },
  {
    label: 'Hack The Box',
    url: 'https://www.hackthebox.eu',
    desc: 'Active machines tackled end to end — enumeration, foothold and privilege escalation on realistic corporate-style targets.',
  },
]
