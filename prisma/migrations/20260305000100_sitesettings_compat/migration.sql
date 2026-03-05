-- Compatibility migration for legacy SiteSettings schema.
-- Supports upgrading DBs that still use older column names from previous project versions.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'SiteSettings'
  ) THEN
    -- Ensure all new columns exist.
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='brand') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "brand" TEXT NOT NULL DEFAULT 'AVNT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='heroTitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "heroTitle" TEXT NOT NULL DEFAULT 'We Build Worlds That Define Culture';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='heroSubtitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "heroSubtitle" TEXT NOT NULL DEFAULT 'AVNT is a Roblox game studio and creative collective pushing the boundaries of digital entertainment.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='heroCta') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "heroCta" TEXT NOT NULL DEFAULT 'Explore Our Games';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='metricsTitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "metricsTitle" TEXT NOT NULL DEFAULT 'Millions Engage With Our Portfolio';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='metricsSubtitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "metricsSubtitle" TEXT NOT NULL DEFAULT 'Real-time data from our live games.';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='credTitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "credTitle" TEXT NOT NULL DEFAULT 'Why AVNT';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='networkTitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "networkTitle" TEXT NOT NULL DEFAULT 'Join the Network';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='networkSubtitle') THEN
      ALTER TABLE "SiteSettings" ADD COLUMN "networkSubtitle" TEXT NOT NULL DEFAULT 'Connect with us across platforms.';
    END IF;

    -- Copy legacy values when legacy columns exist.
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='brandName') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "brand" = COALESCE(NULLIF("brandName", ''''), "brand")';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='heroHeadline') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "heroTitle" = COALESCE(NULLIF("heroHeadline", ''''), "heroTitle")';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='heroSubheadline') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "heroSubtitle" = COALESCE(NULLIF("heroSubheadline", ''''), "heroSubtitle")';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='credibilityTitle') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "credTitle" = COALESCE(NULLIF("credibilityTitle", ''''), "credTitle")';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='ctaTitle') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "networkTitle" = COALESCE(NULLIF("ctaTitle", ''''), "networkTitle")';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='SiteSettings' AND column_name='ctaSubtitle') THEN
      EXECUTE 'UPDATE "SiteSettings" SET "networkSubtitle" = COALESCE(NULLIF("ctaSubtitle", ''''), "networkSubtitle")';
    END IF;
  END IF;
END $$;
