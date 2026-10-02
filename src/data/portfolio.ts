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
    'Seeking a cybersecurity internship. Open to security research, and collaborative projects.',

  // Platform profiles. TryHackMe/HackTheBox are placeholders —
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
    title: 'EVENT MANAGEMENT SYSTEM',
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

// Practice platforms showcased in the Achievements section.
export const platforms = [
  {
    label: 'TryHackMe',
    url: 'https://tryhackme.com',
    glyph: 'layers',
    desc: 'Guided offensive-security labs and learning paths — recon, web exploitation and privilege-escalation exercises, tracked with points and badges.',
  },
  {
    label: 'Hack The Box',
    url: 'https://www.hackthebox.eu',
    glyph: 'layers',
    desc: 'Active machines tackled end to end — enumeration, foothold and privilege escalation on realistic corporate-style targets.',
  },
  {
    label: 'PortSwigger Academy',
    url: 'https://portswigger.net/web-security',
    glyph: 'code',
    desc: 'Web-security academy labs — SQL injection, XSS, access control and request-smuggling exercises, solved through Burp Suite.',
  },
]

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

export const NAV_LINKS = [
  { label: 'About me', target: '#about' },
  { label: 'Projects', target: '#projects' },
  { label: 'CTF write-ups', target: '#ctf' },
  { label: 'Achievements', target: '#achievements' },
  { label: 'Skills', target: '#skills' },
  { label: 'Certifications', target: '#certifications' },
  { label: 'Contact me', target: '#contact' },
]
