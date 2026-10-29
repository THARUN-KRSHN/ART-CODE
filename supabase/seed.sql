-- ART//CODE 2026 — seed data
-- 5 official problem statements + event settings defaults.
-- Safe to re-run (upserts). Contains no user accounts.

insert into public.event_settings (id) values (1) on conflict (id) do nothing;

update public.event_settings set
  registration_opens   = '2026-10-31T00:00:00+05:30',
  submission_opens     = '2026-11-01T00:00:00+05:30',
  submission_deadline  = '2026-11-08T23:59:59+05:30',
  winner_announcement  = '2026-11-14T18:00:00+05:30',
  team_size            = 2,
  total_prize_pool     = '₹3,000',
  first_prize          = '₹1,500',
  second_prize         = '₹1,000',
  third_prize          = '₹500',
  faculty_coordinators = 'Dr. Savitha K K · Ms. Noufala T S',
  student_coordinators = 'Alan Jaison (S3 CSDS) · Henet Biju (S3 CSDS)',
  updated_at = now()
where id = 1;

-- PS-01 -------------------------------------------------------------------
insert into public.problem_statements (
  id, slug, code, title, category, domain, difficulty, motif, accent_color,
  short_description, background, problem_description, objectives,
  mvp, success_criteria, constraints, research_connection, submission_guidance
) values (
  'ps-01',
  'living-heritage-searchable',
  'PS-01',
  'Living Heritage, Searchable',
  'Cultural Preservation',
  'Cultural preservation · Community archives · Web development',
  'Beginner–Intermediate',
  'Heritage & AI',
  'vermilion',
  'A community-centred digital platform where people document, organise, search, and learn about living cultural heritage — with origin, language, creator, and community context always attached.',
  'Traditional stories, folk songs, craft techniques, regional customs, local art forms, and oral histories are often documented inconsistently or scattered across different platforms. Important context can be lost when this knowledge is recorded without information about its origin, language, creator, or community.',
  'Develop a community-centred digital platform that enables people to document, organise, search, and learn about living cultural heritage while respecting the knowledge holders and their permissions.',
  '["Upload text, images, audio recordings, or short videos.", "Add metadata such as art form, language, region, contributor, and date.", "Browse and search stories by category and location.", "Include contributor attribution and consent settings.", "Allow authorised reviewers to approve, correct, or remove entries."]',
  'A searchable archive with at least 10 sample cultural records, a submission form, category filters, and a basic review workflow.',
  'Can a user discover a cultural practice, understand its background, and identify its source?',
  '[]',
  'Fragmented documentation and community ownership concerns identified in public heritage discussions and UNESCO''s 2026 work on community-centred AI.',
  'Show the archive in action with your sample records, metadata, search and review flow, and explain how contributor attribution and consent are handled. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).'
)
on conflict (id) do update set
  slug = excluded.slug, code = excluded.code, title = excluded.title,
  category = excluded.category, domain = excluded.domain, difficulty = excluded.difficulty,
  motif = excluded.motif, accent_color = excluded.accent_color,
  short_description = excluded.short_description, background = excluded.background,
  problem_description = excluded.problem_description, objectives = excluded.objectives,
  mvp = excluded.mvp, success_criteria = excluded.success_criteria,
  constraints = excluded.constraints, research_connection = excluded.research_connection,
  submission_guidance = excluded.submission_guidance, is_published = true, updated_at = now();

-- PS-02 -------------------------------------------------------------------
insert into public.problem_statements (
  id, slug, code, title, category, domain, difficulty, motif, accent_color,
  short_description, background, problem_description, objectives,
  mvp, success_criteria, constraints, research_connection, submission_guidance
) values (
  'ps-02',
  'from-craft-to-click',
  'PS-02',
  'From Craft to Click',
  'Artist Visibility',
  'Traditional art · Artist visibility · Digital storytelling',
  'Beginner–Intermediate',
  'Digital Craftsmanship',
  'gold',
  'A lightweight digital showcase that helps a traditional artist build a professional online identity and share the story behind their work — without needing advanced digital skills.',
  'Traditional artists and small artisan communities can struggle to present their work professionally online, explain the cultural significance of their creations, and help interested people discover or contact them. Simply posting photographs on social media may not provide a consistent, searchable portfolio of the artist''s work and background.',
  'Build a lightweight digital showcase that helps an artist create a professional online identity and share the story behind their work without requiring advanced digital skills.',
  '["A simple artist profile with biography, location, and art form.", "A gallery of artworks and craft products.", "Shareable artwork cards with artist attribution and cultural context.", "Templates for creating social-media captions in English and a selected regional language.", "A contact or commission enquiry form.", "A mobile-friendly portfolio that can be shared through a link or QR code."]',
  'Five sample artist profiles, a gallery, a shareable portfolio, and an enquiry workflow.',
  'Can an artist create a portfolio and help a new audience understand, discover, and contact them?',
  '[]',
  'Studies of Madhubani artists'' social-media challenges and India''s Indiahandmade programme highlight the importance of digital visibility and market access.',
  'Walk through an artist profile, the gallery, a shareable artwork card, and the enquiry flow, and show how cultural context travels with each share. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).'
)
on conflict (id) do update set
  slug = excluded.slug, code = excluded.code, title = excluded.title,
  category = excluded.category, domain = excluded.domain, difficulty = excluded.difficulty,
  motif = excluded.motif, accent_color = excluded.accent_color,
  short_description = excluded.short_description, background = excluded.background,
  problem_description = excluded.problem_description, objectives = excluded.objectives,
  mvp = excluded.mvp, success_criteria = excluded.success_criteria,
  constraints = excluded.constraints, research_connection = excluded.research_connection,
  submission_guidance = excluded.submission_guidance, is_published = true, updated_at = now();

-- PS-03 -------------------------------------------------------------------
insert into public.problem_statements (
  id, slug, code, title, category, domain, difficulty, motif, accent_color,
  short_description, background, problem_description, objectives,
  mvp, success_criteria, constraints, research_connection, submission_guidance
) values (
  'ps-03',
  'credit-the-culture',
  'PS-03',
  'Credit the Culture',
  'Attribution & Ownership',
  'Creative ownership · Attribution · Responsible AI',
  'Intermediate',
  'Indigenous Calligraphy',
  'darkRed',
  'A digital provenance and attribution tool that tells people where a cultural work comes from, who should be credited, and how the material may be reused.',
  'Cultural artwork, traditional patterns, photographs of heritage objects, and community-created content can be reposted or reused online without adequate attribution or information about the people and communities behind them. Generative AI introduces additional questions about consent, cultural context, and acceptable reuse.',
  'Create a digital provenance and attribution tool that helps creators and cultural communities communicate where an artwork or cultural resource comes from, who should be credited, and how the material may be reused.',
  '["A digital record containing the creator, source, region, and cultural context.", "Clearly stated reuse permissions and attribution requirements.", "A shareable credit card or downloadable provenance record.", "Search by artwork title, creator, or record ID.", "A way to flag missing attribution or potentially unauthorised reuse.", "An optional audit trail showing changes to the record."]',
  'A collection of 10–15 sample records, a creation form, a searchable catalogue, and shareable attribution pages.',
  'Can a user identify the source of a cultural work and understand the stated permissions before reusing it?',
  '["This is an attribution and permission-management prototype, not an automated copyright detector. It should not claim to establish legal ownership merely because someone creates a record."]',
  'UNESCO''s October 2026 discussions highlighted cultural data ownership, consent, intellectual property, and the risk of cultural misrepresentation in AI applications.',
  'Demonstrate record creation, the shareable credit/provenance page, search and flagging, and explain your permissions model. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).'
)
on conflict (id) do update set
  slug = excluded.slug, code = excluded.code, title = excluded.title,
  category = excluded.category, domain = excluded.domain, difficulty = excluded.difficulty,
  motif = excluded.motif, accent_color = excluded.accent_color,
  short_description = excluded.short_description, background = excluded.background,
  problem_description = excluded.problem_description, objectives = excluded.objectives,
  mvp = excluded.mvp, success_criteria = excluded.success_criteria,
  constraints = excluded.constraints, research_connection = excluded.research_connection,
  submission_guidance = excluded.submission_guidance, is_published = true, updated_at = now();

-- PS-04 -------------------------------------------------------------------
insert into public.problem_statements (
  id, slug, code, title, category, domain, difficulty, motif, accent_color,
  short_description, background, problem_description, objectives,
  mvp, success_criteria, constraints, research_connection, submission_guidance
) values (
  'ps-04',
  'culture-in-every-voice',
  'PS-04',
  'Culture in Every Voice',
  'Language & Accessibility',
  'Language · Accessibility · Digital storytelling',
  'Beginner–Intermediate',
  'Performing Arts & Tech',
  'gold',
  'An accessible storytelling platform that opens selected cultural content across languages and accessibility needs while preserving its original meaning and context.',
  'Cultural stories, folk performances, art demonstrations, and regional literature may be difficult to access for people who do not understand the original language or who need captions, transcripts, or alternative ways to experience the content. Literal translation alone can also miss cultural references and specialised terminology.',
  'Develop an accessible storytelling platform that makes selected cultural content understandable across languages and different accessibility needs while preserving its original meaning and context.',
  '["A library of short cultural stories or performance clips.", "Text transcripts and synchronised subtitles.", "English and one selected regional-language version.", "Audio narration or text-to-speech.", "A glossary for culturally specific terms.", "Captions, readable layouts, and image descriptions."]',
  'Three cultural stories with original text or audio, transcripts, translated content, and at least two accessibility features.',
  'Can a user with a different language preference or accessibility need understand the main story and its cultural context?',
  '["Use a small, curated collection instead of attempting to support every language or automatically translate all cultural content. Allow human correction where machine-generated transcripts or translations are used."]',
  'UNESCO identifies linguistic and cultural diversity, accessibility, and responsible use of AI as important challenges in the digital cultural ecosystem.',
  'Play the story with transcript, translation, glossary, and at least two accessibility features, and show how human correction works. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).'
)
on conflict (id) do update set
  slug = excluded.slug, code = excluded.code, title = excluded.title,
  category = excluded.category, domain = excluded.domain, difficulty = excluded.difficulty,
  motif = excluded.motif, accent_color = excluded.accent_color,
  short_description = excluded.short_description, background = excluded.background,
  problem_description = excluded.problem_description, objectives = excluded.objectives,
  mvp = excluded.mvp, success_criteria = excluded.success_criteria,
  constraints = excluded.constraints, research_connection = excluded.research_connection,
  submission_guidance = excluded.submission_guidance, is_published = true, updated_at = now();

-- PS-05 -------------------------------------------------------------------
insert into public.problem_statements (
  id, slug, code, title, category, domain, difficulty, motif, accent_color,
  short_description, background, problem_description, objectives,
  mvp, success_criteria, constraints, research_connection, submission_guidance
) values (
  'ps-05',
  'the-living-culture-map',
  'PS-05',
  'The Living Culture Map',
  'Discovery & Mapping',
  'Cultural discovery · Local communities · Mapping',
  'Beginner–Intermediate',
  'Interactive Exhibitions',
  'vermilion',
  'A community-informed map and discovery platform for finding cultural experiences, understanding their significance, and reaching reliable local contributors.',
  'Information about local artists, cultural events, traditional performances, craft workshops, heritage places, and community-led activities can be spread across social posts, websites, posters, and informal networks. People may struggle to find accurate information about what is happening nearby or discover cultural experiences beyond familiar tourist destinations.',
  'Build a community-informed map and discovery platform that helps people find cultural experiences, understand their significance, and access reliable information from local contributors.',
  '["A map or searchable directory of cultural places, artists, and events.", "Filters for art form, location, date, and experience type.", "Each listing''s background story, images, and source information.", "A community contribution form for submitting new listings.", "A basic moderation or verification workflow.", "Links to the original event or artist page, including public social-media profiles where appropriate."]',
  'A map or directory covering one locality or district, with at least 15 sample listings, search and filters, detailed listings, and an admin review workflow.',
  'Can a user discover a relevant cultural experience and find the information needed to learn more or contact the organiser?',
  '["Start with one locality. Do not rely on scraping social-media content or claim that unverified event listings are accurate."]',
  'Current digital heritage initiatives emphasise access and discovery, while community-centred heritage work stresses the value of involving the communities that sustain cultural practices.',
  'Show your locality''s listings, filters, a detailed listing, and the moderation flow, and list the sources of your data. Follow the standard ART//CODE submission format (repository, live link, walkthrough video).'
)
on conflict (id) do update set
  slug = excluded.slug, code = excluded.code, title = excluded.title,
  category = excluded.category, domain = excluded.domain, difficulty = excluded.difficulty,
  motif = excluded.motif, accent_color = excluded.accent_color,
  short_description = excluded.short_description, background = excluded.background,
  problem_description = excluded.problem_description, objectives = excluded.objectives,
  mvp = excluded.mvp, success_criteria = excluded.success_criteria,
  constraints = excluded.constraints, research_connection = excluded.research_connection,
  submission_guidance = excluded.submission_guidance, is_published = true, updated_at = now();
