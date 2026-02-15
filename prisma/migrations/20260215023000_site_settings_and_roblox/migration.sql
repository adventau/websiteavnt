ALTER TABLE "Project" ADD COLUMN "robloxPlaceId" TEXT;
CREATE INDEX "Project_robloxPlaceId_idx" ON "Project"("robloxPlaceId");

CREATE TABLE "SiteSettings" (
  "id" INTEGER NOT NULL DEFAULT 1,
  "brandName" TEXT NOT NULL DEFAULT 'AVNT Brand',
  "footerText" TEXT NOT NULL DEFAULT '© AVNT Brand — All Rights Reserved',
  "heroHeadline" TEXT NOT NULL DEFAULT 'Structured leadership for digital communities and independent projects.',
  "heroSubheadline" TEXT NOT NULL DEFAULT 'AVNT Brand is a professional management and portfolio brand focused on overseeing, organizing, and supporting digital communities and independent projects.',
  "aboutTitle" TEXT NOT NULL DEFAULT 'About AVNT',
  "aboutBody" TEXT NOT NULL DEFAULT 'Professional management, intentional staffing, and portfolio oversight.',
  "credibilityTitle" TEXT NOT NULL DEFAULT 'Credibility',
  "credibilitySubtitle" TEXT NOT NULL DEFAULT 'Signals of trust: partners, platforms, and milestones.',
  "gamesTitle" TEXT NOT NULL DEFAULT 'Our Games',
  "gamesSubtitle" TEXT NOT NULL DEFAULT 'Active portfolio projects and community experiences.',
  "pledgeTitle" TEXT NOT NULL DEFAULT 'Our Quality Pledge',
  "pledgeSubtitle" TEXT NOT NULL DEFAULT 'A commitment to structure, security, and high operational standards.',
  "teamTitle" TEXT NOT NULL DEFAULT 'Our Team',
  "teamSubtitle" TEXT NOT NULL DEFAULT 'Leadership, operations, and delivery.',
  "ctaTitle" TEXT NOT NULL DEFAULT 'Join the network',
  "ctaSubtitle" TEXT NOT NULL DEFAULT 'Get updates, opportunities, and announcements across the AVNT portfolio.',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "SiteSettings" ("id") VALUES (1)
ON CONFLICT ("id") DO NOTHING;
