import { PrismaClient, ProjectStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "owner@avnt.com")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  await prisma.user.deleteMany();
  await prisma.project.deleteMany();
  await prisma.metric.deleteMany();
  await prisma.operatingSignal.deleteMany();
  await prisma.credibilityItem.deleteMany();
  await prisma.leadershipMember.deleteMany();
  await prisma.networkLink.deleteMany();
  await prisma.siteSettings.deleteMany();

  for (const [index, email] of adminEmails.entries()) {
    await prisma.user.create({
      data: {
        clerkUserId: `seeded-${index}`,
        email,
        name: `AVNT Admin ${index + 1}`,
        role: index === 0 ? UserRole.ADMIN : UserRole.EDITOR
      }
    });
  }

  await prisma.metric.createMany({
    data: [
      {
        key: "players_online",
        label: "Players online now",
        value: "0",
        trend: "Live",
        sortOrder: 1
      },
      {
        key: "total_visits",
        label: "Total visits",
        value: "0",
        trend: "Live",
        sortOrder: 2
      },
      {
        key: "total_favorites",
        label: "Total favorites",
        value: "0",
        trend: "Live",
        sortOrder: 3
      },
      {
        key: "games_in_portfolio",
        label: "Games in portfolio",
        value: "0",
        trend: "Live",
        sortOrder: 4
      }
    ]
  });

  await prisma.project.createMany({
    data: [
      {
        title: "NOVA Ops Network",
        description:
          "Community operations stack for high-volume live events and moderation response workflows.",
        status: ProjectStatus.ACTIVE,
        category: "Community",
        robloxLink: "https://www.roblox.com/games/73312781671917/Build-a-Water-Slide",
        robloxPlaceId: "73312781671917",
        visits: 3200000,
        favorites: 211000,
        featured: true,
        sortOrder: 1,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Gridline Studio",
        description:
          "Production studio system that coordinates roadmap planning, sprint throughput, and quality controls.",
        status: ProjectStatus.SCALING,
        category: "Development",
        robloxLink: "https://www.roblox.com/games/87419805032513/RoTube-Life-2",
        robloxPlaceId: "87419805032513",
        visits: 1900000,
        favorites: 120400,
        featured: true,
        sortOrder: 2,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1200&q=80"
      },
      {
        title: "Atlas Monetization",
        description:
          "Revenue intelligence layer tracking engagement signals and monetization outcomes across assets.",
        status: ProjectStatus.PAUSED,
        category: "Growth",
        robloxLink: "https://www.roblox.com/games/12177325772/FIFA-Super-Soccer",
        robloxPlaceId: "12177325772",
        visits: 810000,
        favorites: 55200,
        featured: false,
        sortOrder: 3,
        thumbnailUrl:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
      }
    ]
  });

  await prisma.operatingSignal.createMany({
    data: [
      {
        title: "Systems Over Noise",
        subtitle: "Operational Discipline",
        description:
          "Every portfolio decision is mapped to measurable outcomes and review checkpoints.",
        sortOrder: 1
      },
      {
        title: "Operator-Led Teams",
        subtitle: "Hands-On Leadership",
        description:
          "Cross-functional leaders are embedded in execution loops, not isolated from delivery.",
        sortOrder: 2
      },
      {
        title: "Compounding Horizon",
        subtitle: "Long-Term Portfolio View",
        description:
          "Projects are governed by compounding impact, not short-term volatility.",
        sortOrder: 3
      }
    ]
  });

  await prisma.credibilityItem.createMany({
    data: [
      {
        title: "99.95% uptime in managed services",
        body: "Operational SLAs sustained across portfolio tools and community systems.",
        sortOrder: 1
      },
      {
        title: "Weekly executive operating review",
        body: "Structured scorecards and risk logging drive portfolio governance.",
        sortOrder: 2
      }
    ]
  });

  await prisma.leadershipMember.createMany({
    data: [
      {
        role: "Founder & Portfolio Operator",
        name: "Avery North",
        bio: "Leads AVNT strategy, systems architecture, and capital allocation.",
        avatarUrl:
          "https://images.unsplash.com/photo-1542206395-9feb3edaa68d?auto=format&fit=crop&w=600&q=80",
        sortOrder: 1
      },
      {
        role: "Head of Communities",
        name: "Jordan Hale",
        bio: "Owns network growth loops, trust systems, and creator partnerships.",
        avatarUrl:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=600&q=80",
        sortOrder: 2
      }
    ]
  });

  await prisma.networkLink.createMany({
    data: [
      {
        label: "X / AVNT",
        url: "https://x.com",
        description: "Strategic updates and operator notes.",
        sortOrder: 1
      },
      {
        label: "Discord Operations Hub",
        url: "https://discord.com",
        description: "Core community and contributor channels.",
        sortOrder: 2
      },
      {
        label: "GitHub",
        url: "https://github.com",
        description: "Engineering repos and platform tooling.",
        sortOrder: 3
      }
    ]
  });

  await prisma.siteSettings.create({
    data: {
      id: 1
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
