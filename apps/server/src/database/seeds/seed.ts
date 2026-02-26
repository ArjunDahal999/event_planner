import type { Knex } from "knex";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";

const EVENTS_CONSTANT = [
  // Major Global Conferences
  "AWS re:Invent",
  "Microsoft Build",
  "Google I/O",
  "Apple WWDC",
  "GitHub Universe",
  "KubeCon + CloudNativeCon",
  "DockerCon",
  "PyCon US",
  "JSConf Global",
  "Def Con",
  "Black Hat USA",
  "Web Summit",
  "The Next Web (TNW)",
  "QCon London",
  "Microsoft Ignite",
  "Google Cloud Next",
  "Oracle CloudWorld",
  "Adobe Summit",
  "Slack Frontiers",
  "HashiConf",

  // Hackathons & Sprints
  "Hacktoberfest",
  "Global Game Jam",
  "AngelHack",
  "TechCrunch Disrupt Hack",
  "MLH Local Hack Day",
  "Node.js Interactive Sprints",
  "Open Source Saturday",
  "NASA Space Apps Challenge",
  "EthGlobal",
  "Solana Breakpoint",
  "Code for America Summit",
  "Rails Girls Workshop",
  "DjangoGirls",
  "Hard Fork Hack",
  "ByteSized Hackathon",
  "The Big Code Challenge",
  "Zero Trust World",
  "CryptoForge",
  "AppBlitz",
  "Build with Gemini Summit",

  // Meetup & Community Style
  "React Beer Night",
  "Pythonistas Monthly",
  "DevOps Days",
  "Fullstack Founders",
  "The Frontend Collective",
  "Backend & Brews",
  "Data Science Social",
  "Agile Coffee",
  "Rustaceans Retreat",
  "The Gophers Gathering",
  "C# Corner Live",
  "Flutter Flow Meetup",
  "Laravel Live",
  "Vue Mastery Workshop",
  "Wasm Weekend",
  "API World",
  "Microservices March",
  "Serverless Saturday",
  "Kubernetes Community Day",
  "Linux Foundation Summit",

  // Corporate & Internal Dev Event Concepts
  "Internal Innovation Sprint",
  "Legacy Code Cleanup Day",
  "Architecture Review Board",
  "Lunch and Learn: AI Edition",
  "Dev Experience Expo",
  "Engineering Excellence Week",
  "Cloud Migration Workshop",
  "Security Awareness Jam",
  "UX/UI Design Sprint",
  "Quality Assurance Gala",
  "The Refactor Rodeo",
  "API Strategy Summit",
  "Scalability Symposium",
  "The Debugging Derby",
  "Cybersecurity Shield",

  // Creative/Futuristic Names
  "CodeConflux",
  "Quantum Quandary",
  "NeuralNexus",
  "Silicon Synergy",
  "ByteBlast",
  "Algorithm Arena",
  "Digital Dynamo",
  "FutureFlux",
  "CyberSynapse",
  "Infotech Inception",
  "TitanTech Summit",
  "Binary Blast",
  "Matrix Meetup",
  "Edge Computing Expo",
  "Web3 Waves",
  "Prompt Engineering Party",
  "Low-Code Loft",
  "DevRelCon",
  "The Documentation Derby",
  "Open Source Odyssey",
  "SaaS Solutions Summit",
  "The Deployment Disco",
  "CI/CD Carnival",
  "GraphQL Gala",
  "Tailwind Track",
] as const;
const TAG_CONSTANT = [
  "Algorithms",
  "Android",
  "Angular",
  "API",
  "Apollo",
  "Architecture",
  "Artificial Intelligence",
  "AWS",
  "Azure",
  "Backend",
  "Bash",
  "Big Data",
  "Blockchain",
  "Bootstrap",
  "C",
  "C#",
  "C++",
  "CI/CD",
  "Cloud Computing",
  "Code Review",
  "Containers",
  "CSS",
  "Cybersecurity",
  "Dapper",
  "Data Science",
  "Database",
  "DevOps",
  "Django",
  "Docker",
  "Dotnet",
  "EJS",
  "Electron",
  "Elixir",
  "Entity Framework",
  "Express",
  "FastAPI",
  "Firebase",
  "Flutter",
  "Frontend",
  "Fullstack",
  "Game Dev",
  "Git",
  "GitHub",
  "Go",
  "GraphQL",
  "HTML",
  "iOS",
  "Java",
  "JavaScript",
  "Jenkins",
  "Jest",
  "JSON",
  "JUnit",
  "Kafka",
  "Kotlin",
  "Kubernetes",
  "Laravel",
  "Linux",
  "Machine Learning",
  "Microservices",
  "MongoDB",
  "MySQL",
  "Next.js",
  "Node.js",
  "NoSQL",
  "npm",
  "Object Oriented Programming",
  "Open Source",
  "Oracle",
  "PHP",
  "PostgreSQL",
  "Prisma",
  "Python",
  "Pytorch",
  "Quality Assurance",
  "React",
  "React Native",
  "Redis",
  "Redux",
  "REST API",
  "Ruby",
  "Ruby on Rails",
  "Rust",
  "SaaS",
  "Scala",
  "Scrum",
  "Serverless",
  "Software Engineering",
  "Solidity",
  "Spring Boot",
  "SQL",
  "Swift",
  "Tailwind CSS",
  "TensorFlow",
  "Testing",
  "TypeScript",
  "UI/UX",
  "Unit Testing",
  "Vue.js",
  "Web3",
] as const;
const NUM_USERS = 1000;
const NUM_EVENTS = EVENTS_CONSTANT.length;
const NUM_TAGS = TAG_CONSTANT.length;
const USER_TABLE = "users";
const EVENT_TABLE = "event";
const TAG_TABLE = "tag";
const EVENT_TAG_TABLE = "event_tag";
const RSVP_TABLE = "rsvp";

export async function seed(knex: Knex): Promise<void> {
  // ── Cleanup (reverse FK order) ──────────────────────────────────────────────
  await knex(RSVP_TABLE).del();
  await knex(EVENT_TAG_TABLE).del();
  await knex(TAG_TABLE).del();
  await knex(EVENT_TABLE).del();
  await knex(USER_TABLE).del();

  // ── Users ───────────────────────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("11111111", 10);

  const usersData = Array.from({ length: NUM_USERS }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hashedPassword,
    is_email_verified: faker.datatype.boolean(),
  }));

  await knex(USER_TABLE).insert(usersData).onConflict("email").ignore();

  // Fetch inserted user IDs
  const users = await knex(USER_TABLE).select("id");
  const userIdList: number[] = users.map((u) => u.id);

  const tagsData = TAG_CONSTANT.slice(0, NUM_TAGS).map((name) => ({
    name,
    color: faker.color.rgb({ format: "hex" }),
  }));

  await knex(TAG_TABLE).insert(tagsData);

  // Fetch inserted tag IDs
  const tags = await knex(TAG_TABLE).select("id");
  const tagIdList: number[] = tags.map((t) => t.id);

  // ── Events ──────────────────────────────────────────────────────────────────
  const eventsData = Array.from({ length: NUM_EVENTS }, () => ({
    title: faker.helpers.arrayElement(EVENTS_CONSTANT),
    description: faker.lorem.paragraph(),
    location: `${faker.location.city()}, ${faker.location.country()}`,
    event_date: faker.date.between({
      from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365), // last year
      to: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // next year
    }),
    event_type: faker.helpers.arrayElement(["public", "private"]),
    user_id: faker.helpers.arrayElement(userIdList),
  }));

  await knex(EVENT_TABLE).insert(eventsData);

  // Fetch inserted event IDs
  const events = await knex(EVENT_TABLE).select("id");
  const eventIdList: number[] = events.map((e) => e.id);

  // ── Event Tags ───────────────────────────────────────────────────────────────
  const eventTagSet = new Set<string>();
  const eventTagsData: { event_id: number; tag_id: number }[] = [];

  for (const eventId of eventIdList) {
    // Assign 1-3 unique tags per event
    const numTags = faker.number.int({ min: 1, max: 3 });
    const shuffledTags = faker.helpers
      .shuffle([...tagIdList])
      .slice(0, numTags);

    for (const tagId of shuffledTags) {
      const key = `${eventId}-${tagId}`;
      if (!eventTagSet.has(key)) {
        eventTagSet.add(key);
        eventTagsData.push({ event_id: eventId, tag_id: tagId });
      }
    }
  }

  await knex(EVENT_TAG_TABLE).insert(eventTagsData);

  // ── RSVPs ────────────────────────────────────────────────────────────────────
  const rsvpSet = new Set<string>();
  const rsvpsData: {
    user_id: number;
    event_id: number;
    response: string;
  }[] = [];

  // Each user RSVPs to a random subset of events
  for (const userId of userIdList) {
    for (const eventId of eventIdList) {
      const key = `${userId}-${eventId}`;
      if (!rsvpSet.has(key)) {
        rsvpSet.add(key);
        rsvpsData.push({
          user_id: userId,
          event_id: eventId,
          response: faker.helpers.arrayElement([
            "YES",
            "YES",
            "YES",
            "YES",
            "NO",
            "MAY BE",
          ]),
        });
      }
    }
  }

  await knex(RSVP_TABLE).insert(rsvpsData);

  console.log(`✅ Seeded:`);
  console.log(`   ${userIdList.length} users`);
  console.log(`   ${tagIdList.length} tags`);
  console.log(`   ${eventIdList.length} events`);
  console.log(`   ${eventTagsData.length} event-tag relations`);
  console.log(`   ${rsvpsData.length} RSVPs`);
}
