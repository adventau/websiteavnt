// prisma/seed.ts
import { PrismaClient, ProjectStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed admin users from ADMIN_EMAILS env
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  for (const email of adminEmails) {
    await prisma.user.upsert({
      where: { email },
      update: { role: UserRole.ADMIN },
      create: {
        clerkUserId: `seed_${email.replace(/[^a-z0-9]/gi, "_")}`,
        email,
        name: email.split("@")[0],
        role: UserRole.ADMIN,
      },
    });
  }

  // Site settings singleton
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      brand: "AVNT",
      heroTitle: "We Build Worlds That Define Culture",
      heroSubtitle:
        "AVNT is a premier Roblox game studio crafting immersive digital experiences for millions of players worldwide.",
      heroCta: "Explore Our Games",
      aboutTitle: "About AVNT",
      aboutBody:
        "Founded by passionate creators, AVNT has grown into a leading Roblox development studio. We specialize in building high-quality, engaging games that capture the imagination of players across the globe.",
      metricsTitle: "Millions Engage With Our Portfolio",
      metricsSubtitle: "Live data from our active game portfolio.",
      gamesTitle: "Our Games",
      gamesSubtitle:
        "Discover our collection of Roblox experiences crafted for maximum engagement.",
      credTitle: "Why AVNT",
      teamTitle: "Leadership",
      teamSubtitle: "The minds behind the movement.",
      networkTitle: "Join the Network",
      networkSubtitle: "Connect with AVNT across platforms.",
      footerText: "© 2024 AVNT Studio. All rights reserved.",
    },
  });

  // Metrics
  const metricsData = [
    {
      key: "players_online",
      label: "Players Online",
      value: "0",
      trend: "+12%",
      sortOrder: 0,
    },
    {
      key: "total_visits",
      label: "Total Visits",
      value: "0",
      trend: "+8%",
      sortOrder: 1,
    },
    {
      key: "total_favorites",
      label: "Total Favorites",
      value: "0",
      trend: "+15%",
      sortOrder: 2,
    },
    {
      key: "games_in_portfolio",
      label: "Games in Portfolio",
      value: "5",
      trend: null,
      sortOrder: 3,
    },
  ];

  for (const m of metricsData) {
    await prisma.metric.upsert({
      where: { key: m.key },
      update: {},
      create: m,
    });
  }

  // Sample projects
  const projects = [
    {
      title: "Blade Ball",
      description:
        "A fast-paced sword-fighting game where players deflect deadly balls to eliminate opponents.",
      status: ProjectStatus.ACTIVE,
      category: "Action",
      robloxPlaceId: "13772394625",
      robloxLink: "https://www.roblox.com/games/13772394625/Blade-Ball",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
    {
      title: "Combat Warriors",
      description:
        "An intense PvP combat experience with a variety of weapons and fighting styles.",
      status: ProjectStatus.ACTIVE,
      category: "Fighting",
      featured: true,
      visible: true,
      sortOrder: 1,
    },
    {
      title: "Evade",
      description:
        "A thrilling chase game where players must survive increasingly dangerous scenarios.",
      status: ProjectStatus.SCALING,
      category: "Survival",
      visible: true,
      sortOrder: 2,
    },
  ];

  for (const [i, p] of projects.entries()) {
    const existing = await prisma.project.findFirst({
      where: { title: p.title },
    });
    if (!existing) {
      await prisma.project.create({ data: p });
    }
  }

  // Operating signals
  const signals = [
    {
      title: "Player-First Design",
      subtitle: "Engagement at the core",
      description:
        "Every mechanic, UI decision, and content update is driven by what keeps players coming back.",
      sortOrder: 0,
    },
    {
      title: "Rapid Iteration",
      subtitle: "Ship fast, learn faster",
      description:
        "We deploy updates continuously, measuring impact and adapting within days, not months.",
      sortOrder: 1,
    },
    {
      title: "Community Co-Creation",
      subtitle: "Built with our players",
      description:
        "Our community shapes the roadmap through active feedback channels and beta programs.",
      sortOrder: 2,
    },
    {
      title: "Scalable Infrastructure",
      subtitle: "Ready for millions",
      description:
        "Our technical foundation is engineered to handle viral growth without degrading experience.",
      sortOrder: 3,
    },
  ];

  for (const s of signals) {
    const existing = await prisma.operatingSignal.findFirst({
      where: { title: s.title },
    });
    if (!existing) {
      await prisma.operatingSignal.create({ data: s });
    }
  }

  // Credibility items
  const credItems = [
    {
      title: "Top 0.1% on Roblox",
      body: "Our flagship titles consistently rank among the most-played games on the entire platform.",
      sortOrder: 0,
    },
    {
      title: "100M+ Lifetime Visits",
      body: "Across our portfolio, players have logged over 100 million visits and counting.",
      sortOrder: 1,
    },
    {
      title: "Award-Winning Design",
      body: "Recognized by the Roblox developer community for innovation in gameplay and visual design.",
      sortOrder: 2,
    },
    {
      title: "Veteran Team",
      body: "Our leads have collectively shipped 20+ successful Roblox titles with proven track records.",
      sortOrder: 3,
    },
  ];

  for (const c of credItems) {
    const existing = await prisma.credibilityItem.findFirst({
      where: { title: c.title },
    });
    if (!existing) {
      await prisma.credibilityItem.create({ data: c });
    }
  }

  // Leadership
  const leaders = [
    {
      role: "Founder & CEO",
      name: "Alex Ventures",
      bio: "Serial entrepreneur and Roblox veteran with 8+ years building top-tier experiences.",
      sortOrder: 0,
    },
    {
      role: "Head of Development",
      name: "Jordan Code",
      bio: "Lead engineer with expertise in Luau, game systems architecture, and performance optimization.",
      sortOrder: 1,
    },
    {
      role: "Creative Director",
      name: "Sam Design",
      bio: "Award-winning designer specializing in immersive UI/UX and world-building aesthetics.",
      sortOrder: 2,
    },
  ];

  for (const l of leaders) {
    const existing = await prisma.leadershipMember.findFirst({
      where: { name: l.name },
    });
    if (!existing) {
      await prisma.leadershipMember.create({ data: l });
    }
  }

  // Network links
  const links = [
    {
      label: "Twitter / X",
      url: "https://twitter.com/avntstudio",
      description: "Follow for updates",
      sortOrder: 0,
    },
    {
      label: "Discord",
      url: "https://discord.gg/avnt",
      description: "Join our community",
      sortOrder: 1,
    },
    {
      label: "YouTube",
      url: "https://youtube.com/@avntstudio",
      description: "Watch our trailers",
      sortOrder: 2,
    },
    {
      label: "Roblox Group",
      url: "https://www.roblox.com/groups/avnt",
      description: "Join the group",
      sortOrder: 3,
    },
  ];

  for (const l of links) {
    const existing = await prisma.networkLink.findFirst({
      where: { label: l.label },
    });
    if (!existing) {
      await prisma.networkLink.create({ data: l });
    }
  }

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
