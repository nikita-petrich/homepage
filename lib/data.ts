/*
 * Content for the "Maya Zhang" résumé page, mirroring the source Notion page
 * (title, two-column layout, work history, education, projects & skills DBs).
 */

export type Span = { t: string; b?: boolean };
export type RichLine = Span[];

export type PillColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

export const profile = {
  name: "Maya Zhang",
  // Hosted on Unsplash in the original page (external embed).
  photo:
    "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1000",
  photoAlt: "Maya Zhang",
};

export type InfoItem = { icon: string; text: string; href?: string };

export const contact: InfoItem[] = [
  { icon: "📞", text: "+44 7871263013", href: "tel:+447871263013" },
  { icon: "✉️", text: "maya@zinenwine.com", href: "mailto:maya@zinenwine.com" },
  { icon: "📍", text: "Medellin, Colombia" },
  { icon: "🌐", text: "www.zinenwine.com", href: "https://www.zinenwine.com" },
];

export const interests: InfoItem[] = [
  { icon: "🏂", text: "Snowboarding" },
  { icon: "🥾", text: "Hiking" },
  { icon: "🧶", text: "Knitting" },
];

export const languages: InfoItem[] = [
  { icon: "🇬🇧", text: "English" },
  { icon: "🇵🇹", text: "Portugese" },
];

// Intro callout — bold segments preserved exactly as on the source page.
export const intro: RichLine[] = [
  [
    { t: "Recent " },
    { t: "graduate in Interaction Design", b: true },
    { t: " with " },
    { t: "hands-on experience from at Zapier", b: true },
    { t: " and various side-projects." },
  ],
  [
    { t: "Skilled in " },
    { t: "Figma", b: true },
    { t: ", prototyping, and " },
    { t: "website building", b: true },
    { t: " using various tools." },
  ],
  [
    { t: "I've designed as well as developed more than " },
    { t: "10 websites and apps", b: true },
    { t: " end to end." },
  ],
  [
    { t: "I'm passionate about crafting seamless user experiences and with emphasis in " },
    { t: "motion design", b: true },
    { t: "." },
  ],
];

export type ResumeEntry = {
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoMax: number;
  title: string;
  date: string;
  description: string;
  // The source page colours some descriptions gray and leaves one default.
  descGray: boolean;
};

export const work: ResumeEntry[] = [
  {
    logo: "/assets/zapier.png",
    logoAlt: "Zapier",
    logoWidth: 500,
    logoHeight: 136,
    logoMax: 104,
    title: "UI Design Internship",
    date: "June - September 2022",
    description:
      "Contributed to the design and improvement of user interfaces. Assisted in creating wireframes, prototypes, and user flows, while collaborating with cross-functional teams. Gained hands-on experience in user research and usability testing, enhancing skills in creating intuitive and engaging user experiences.",
    descGray: true,
  },
  {
    logo: "/assets/coffee.png",
    logoAlt: "Coffee shop",
    logoWidth: 178,
    logoHeight: 201,
    logoMax: 60,
    title: "Junior Barista",
    date: "May - September 2020",
    description:
      "Handled customer orders, prepared coffee drinks, and maintained a clean environment. Gained knowledge of coffee beans and brewing methods, enhancing customer service skills in a fast-paced setting.",
    descGray: false,
  },
];

export const education: ResumeEntry[] = [
  {
    logo: "/assets/imperial.png",
    logoAlt: "Imperial College London",
    logoWidth: 280,
    logoHeight: 300,
    logoMax: 72,
    title: "BA Interaction Design",
    date: "September 2021 - September 2024",
    description:
      "Completed coursework in Human-Computer Interaction, Visual Communication, Prototyping, and Usability Testing. Led a capstone project to design a mobile app for local farmers' markets, focusing on improving user navigation and engagement. Additionally, developed an interactive prototype for an educational game as part of a team project, showcasing skills in wireframing, user research, and iterative design processes. Passionate about creating seamless and enjoyable user experiences.",
    descGray: true,
  },
];

export type Project = {
  name: string;
  start: string;
  end?: string;
  tags: { label: string; color: PillColor }[];
  description: string;
};

// Ordered by date descending, matching the "Case Studies" gallery view.
export const projects: Project[] = [
  {
    name: "Personal Website /SK",
    start: "2024-05-01",
    end: "2024-05-22",
    tags: [{ label: "Design Assets", color: "red" }],
    description:
      "Designed a custom modern website for Sara Krissin, a local textile artist. Developed it using Webflow and added animations using Rive.",
  },
  {
    name: "Bees Together Landing Page",
    start: "2023-08-01",
    end: "2024-03-01",
    tags: [
      { label: "Non-Profit", color: "yellow" },
      { label: "UI Design", color: "default" },
      { label: "Design Assets", color: "red" },
      { label: "Website Dev", color: "pink" },
    ],
    description:
      "Designed and built a modern, user-friendly UI for a non-profit website dedicated to beekeeping. The design emphasizes clarity and accessibility, with intuitive navigation and engaging visuals to support the organization's mission and educate visitors.",
  },
  {
    name: "Knitties eComm Website",
    start: "2022-05-01",
    end: "2022-08-01",
    tags: [
      { label: "UI Design", color: "default" },
      { label: "Website Dev", color: "pink" },
    ],
    description:
      "Designed a modern, user-friendly UI for an e-commerce website specializing in selling handknit beanies. The design features a minimalist aesthetic, intuitive navigation, and visually appealing product displays to enhance the shopping experience and drive sales.",
  },
];

export type Skill = { name: string; type: string; level: number };

// Ordered by skill level descending, matching the "My Skills" gallery view.
export const skills: Skill[] = [
  { name: "Photoshop", type: "Design Tool", level: 0.9 },
  { name: "Figma", type: "Design Tool", level: 0.8 },
  { name: "Notion", type: "Project Management", level: 0.6 },
  { name: "Framer", type: "Website Builder", level: 0.6 },
  { name: "Webflow", type: "Website Builder", level: 0.4 },
  { name: "Rive", type: "Animation", level: 0.3 },
  { name: "CSS + Basic JS", type: "Front End", level: 0.1 },
];
