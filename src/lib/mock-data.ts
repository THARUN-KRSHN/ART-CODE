import { EventSettings, ProblemStatement } from "@/types";
import { ScheduleISO } from "./event-schedule";

export const MOCK_EVENT_SETTINGS: EventSettings = {
  eventName: "ART//CODE 2026",
  tagline: "Where Creativity Meets Technology",
  organiser: "DELTA - Data Science Department Association",
  institution: "Christ College of Engineering (Autonomous), Irinjalakuda",
  department: "Computer Science & Engineering (Data Science)",
  theme: "Art, Culture, Heritage & Creative Technology",
  registrationOpens: ScheduleISO.registrationOpens,
  submissionOpens: ScheduleISO.submissionOpens,
  submissionDeadline: ScheduleISO.submissionDeadline,
  winnerAnnouncement: ScheduleISO.winnerAnnouncement,
  teamSize: 2,
  firstPrize: "₹1,500",
  secondPrize: "₹1,000",
  thirdPrize: "₹500",
  totalPrizePool: "₹3,000",
  facultyCoordinators: "Dr. Savitha K K · Ms. Noufala T S",
  studentCoordinators: "Alan Jaison (S3 CSDS) · Henet Biju (S3 CSDS)",
  contactEmail: "delta@cce.edu.in",
  resultsPublished: false,
};

export const MOCK_CHALLENGES: ProblemStatement[] = [
  {
    id: "ps-01",
    slug: "living-heritage-searchable",
    code: "PS-01",
    title: "Living Heritage, Searchable",
    category: "Cultural Preservation",
    domain: "Cultural preservation · Community archives · Web development",
    difficulty: "Beginner–Intermediate",
    motif: "Heritage & AI",
    accentColor: "vermilion",
    shortDescription:
      "A community-centred digital platform where people document, organise, search, and learn about living cultural heritage, with origin, language, creator, and community context always attached.",
    background:
      "Traditional stories, folk songs, craft techniques, regional customs, local art forms, and oral histories are often documented inconsistently or scattered across different platforms. Important context can be lost when this knowledge is recorded without information about its origin, language, creator, or community.",
    problemDescription:
      "Develop a community-centred digital platform that enables people to document, organise, search, and learn about living cultural heritage while respecting the knowledge holders and their permissions.",
    objectives: [
      "Upload text, images, audio recordings, or short videos.",
      "Add metadata such as art form, language, region, contributor, and date.",
      "Browse and search stories by category and location.",
      "Include contributor attribution and consent settings.",
      "Allow authorised reviewers to approve, correct, or remove entries.",
    ],
    expectedOutcomes: [],
    mvp: "A searchable archive with at least 10 sample cultural records, a submission form, category filters, and a basic review workflow.",
    successCriteria: "Can a user discover a cultural practice, understand its background, and identify its source?",
    constraints: [],
    researchConnection:
      "Fragmented documentation and community ownership concerns identified in public heritage discussions and UNESCO's 2026 work on community-centred AI.",
    submissionGuidance:
      "Show the archive in action with your sample records, metadata, search and review flow, and explain how contributor attribution and consent are handled. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).",
    isPublished: true,
  },
  {
    id: "ps-02",
    slug: "from-craft-to-click",
    code: "PS-02",
    title: "From Craft to Click",
    category: "Artist Visibility",
    domain: "Traditional art · Artist visibility · Digital storytelling",
    difficulty: "Beginner–Intermediate",
    motif: "Digital Craftsmanship",
    accentColor: "gold",
    shortDescription:
      "A lightweight digital showcase that helps a traditional artist build a professional online identity and share the story behind their work without needing advanced digital skills.",
    background:
      "Traditional artists and small artisan communities can struggle to present their work professionally online, explain the cultural significance of their creations, and help interested people discover or contact them. Simply posting photographs on social media may not provide a consistent, searchable portfolio of the artist's work and background.",
    problemDescription:
      "Build a lightweight digital showcase that helps an artist create a professional online identity and share the story behind their work without requiring advanced digital skills.",
    objectives: [
      "A simple artist profile with biography, location, and art form.",
      "A gallery of artworks and craft products.",
      "Shareable artwork cards with artist attribution and cultural context.",
      "Templates for creating social-media captions in English and a selected regional language.",
      "A contact or commission enquiry form.",
      "A mobile-friendly portfolio that can be shared through a link or QR code.",
    ],
    expectedOutcomes: [],
    mvp: "Five sample artist profiles, a gallery, a shareable portfolio, and an enquiry workflow.",
    successCriteria: "Can an artist create a portfolio and help a new audience understand, discover, and contact them?",
    constraints: [],
    researchConnection:
      "Studies of Madhubani artists' social-media challenges and India's Indiahandmade programme highlight the importance of digital visibility and market access.",
    submissionGuidance:
      "Walk through an artist profile, the gallery, a shareable artwork card, and the enquiry flow, and show how cultural context travels with each share. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).",
    isPublished: true,
  },
  {
    id: "ps-03",
    slug: "credit-the-culture",
    code: "PS-03",
    title: "Credit the Culture",
    category: "Attribution & Ownership",
    domain: "Creative ownership · Attribution · Responsible AI",
    difficulty: "Intermediate",
    motif: "Indigenous Calligraphy",
    accentColor: "darkRed",
    shortDescription:
      "A digital provenance and attribution tool that tells people where a cultural work comes from, who should be credited, and how the material may be reused.",
    background:
      "Cultural artwork, traditional patterns, photographs of heritage objects, and community-created content can be reposted or reused online without adequate attribution or information about the people and communities behind them. Generative AI introduces additional questions about consent, cultural context, and acceptable reuse.",
    problemDescription:
      "Create a digital provenance and attribution tool that helps creators and cultural communities communicate where an artwork or cultural resource comes from, who should be credited, and how the material may be reused.",
    objectives: [
      "A digital record containing the creator, source, region, and cultural context.",
      "Clearly stated reuse permissions and attribution requirements.",
      "A shareable credit card or downloadable provenance record.",
      "Search by artwork title, creator, or record ID.",
      "A way to flag missing attribution or potentially unauthorised reuse.",
      "An optional audit trail showing changes to the record.",
    ],
    expectedOutcomes: [],
    mvp: "A collection of 10–15 sample records, a creation form, a searchable catalogue, and shareable attribution pages.",
    successCriteria: "Can a user identify the source of a cultural work and understand the stated permissions before reusing it?",
    constraints: [
      "This is an attribution and permission-management prototype, not an automated copyright detector. It should not claim to establish legal ownership merely because someone creates a record.",
    ],
    researchConnection:
      "UNESCO's October 2026 discussions highlighted cultural data ownership, consent, intellectual property, and the risk of cultural misrepresentation in AI applications.",
    submissionGuidance:
      "Demonstrate record creation, the shareable credit/provenance page, search and flagging, and explain your permissions model. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).",
    isPublished: true,
  },
  {
    id: "ps-04",
    slug: "culture-in-every-voice",
    code: "PS-04",
    title: "Culture in Every Voice",
    category: "Language & Accessibility",
    domain: "Language · Accessibility · Digital storytelling",
    difficulty: "Beginner–Intermediate",
    motif: "Performing Arts & Tech",
    accentColor: "gold",
    shortDescription:
      "An accessible storytelling platform that opens selected cultural content across languages and accessibility needs while preserving its original meaning and context.",
    background:
      "Cultural stories, folk performances, art demonstrations, and regional literature may be difficult to access for people who do not understand the original language or who need captions, transcripts, or alternative ways to experience the content. Literal translation alone can also miss cultural references and specialised terminology.",
    problemDescription:
      "Develop an accessible storytelling platform that makes selected cultural content understandable across languages and different accessibility needs while preserving its original meaning and context.",
    objectives: [
      "A library of short cultural stories or performance clips.",
      "Text transcripts and synchronised subtitles.",
      "English and one selected regional-language version.",
      "Audio narration or text-to-speech.",
      "A glossary for culturally specific terms.",
      "Captions, readable layouts, and image descriptions.",
    ],
    expectedOutcomes: [],
    mvp: "Three cultural stories with original text or audio, transcripts, translated content, and at least two accessibility features.",
    successCriteria: "Can a user with a different language preference or accessibility need understand the main story and its cultural context?",
    constraints: [
      "Use a small, curated collection instead of attempting to support every language or automatically translate all cultural content. Allow human correction where machine-generated transcripts or translations are used.",
    ],
    researchConnection:
      "UNESCO identifies linguistic and cultural diversity, accessibility, and responsible use of AI as important challenges in the digital cultural ecosystem.",
    submissionGuidance:
      "Play the story with transcript, translation, glossary, and at least two accessibility features, and show how human correction works. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).",
    isPublished: true,
  },
  {
    id: "ps-05",
    slug: "the-living-culture-map",
    code: "PS-05",
    title: "The Living Culture Map",
    category: "Discovery & Mapping",
    domain: "Cultural discovery · Local communities · Mapping",
    difficulty: "Beginner–Intermediate",
    motif: "Interactive Exhibitions",
    accentColor: "vermilion",
    shortDescription:
      "A community-informed map and discovery platform for finding cultural experiences, understanding their significance, and reaching reliable local contributors.",
    background:
      "Information about local artists, cultural events, traditional performances, craft workshops, heritage places, and community-led activities can be spread across social posts, websites, posters, and informal networks. People may struggle to find accurate information about what is happening nearby or discover cultural experiences beyond familiar tourist destinations.",
    problemDescription:
      "Build a community-informed map and discovery platform that helps people find cultural experiences, understand their significance, and access reliable information from local contributors.",
    objectives: [
      "A map or searchable directory of cultural places, artists, and events.",
      "Filters for art form, location, date, and experience type.",
      "Each listing's background story, images, and source information.",
      "A community contribution form for submitting new listings.",
      "A basic moderation or verification workflow.",
      "Links to the original event or artist page, including public social-media profiles where appropriate.",
    ],
    expectedOutcomes: [],
    mvp: "A map or directory covering one locality or district, with at least 15 sample listings, search and filters, detailed listings, and an admin review workflow.",
    successCriteria: "Can a user discover a relevant cultural experience and find the information needed to learn more or contact the organiser?",
    constraints: [
      "Start with one locality. Do not rely on scraping social-media content or claim that unverified event listings are accurate.",
    ],
    researchConnection:
      "Current digital heritage initiatives emphasise access and discovery, while community-centred heritage work stresses the value of involving the communities that sustain cultural practices.",
    submissionGuidance:
      "Show your locality's listings, filters, a detailed listing, and the moderation flow, and list the sources of your data. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).",
    isPublished: true,
  },
];
