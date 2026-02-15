-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journees" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aliments_ref" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "kcal" DOUBLE PRECISION,
    "prot" DOUBLE PRECISION,
    "lip" DOUBLE PRECISION,
    "gluc" DOUBLE PRECISION,
    "fib" DOUBLE PRECISION,
    "na" DOUBLE PRECISION,
    "k" DOUBLE PRECISION,
    "ca" DOUBLE PRECISION,
    "mg" DOUBLE PRECISION,
    "oxa" DOUBLE PRECISION,
    "pral" DOUBLE PRECISION,
    "ig" DOUBLE PRECISION,
    "cg" DOUBLE PRECISION,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aliments_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions_ref" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "nacl" DOUBLE PRECISION,
    "khco3" DOUBLE PRECISION,
    "nahco3" DOUBLE PRECISION,
    "citrate_k" DOUBLE PRECISION,
    "citrate_na" DOUBLE PRECISION,
    "mg_sel" DOUBLE PRECISION,
    "ca_sel" DOUBLE PRECISION,
    "na" DOUBLE PRECISION,
    "k" DOUBLE PRECISION,
    "hco3" DOUBLE PRECISION,
    "cl" DOUBLE PRECISION,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solutions_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplements_ref" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "dosage" TEXT,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "supplements_ref_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repas" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "numero_repas" INTEGER,
    "nacl_g" DOUBLE PRECISION,
    "k_citrate_meq" DOUBLE PRECISION,
    "marche_post_prandiale_min" INTEGER,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repas_aliments" (
    "id" TEXT NOT NULL,
    "repas_id" TEXT NOT NULL,
    "aliment_id" TEXT NOT NULL,
    "poids_g" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "repas_aliments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repas_supplements" (
    "id" TEXT NOT NULL,
    "repas_id" TEXT NOT NULL,
    "supplement_id" TEXT NOT NULL,
    "quantite" DOUBLE PRECISION,
    "dosage" TEXT,

    CONSTRAINT "repas_supplements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hydratations" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "volume_ml" DOUBLE PRECISION,
    "solution_id" TEXT,
    "periode_repas" TEXT,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hydratations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mictions" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "volume_ml" DOUBLE PRECISION,
    "saturation_10" INTEGER,
    "mousse_pct" INTEGER,
    "odeur_desc" TEXT,
    "odeur_10" INTEGER,
    "sg" TEXT,
    "pH" DOUBLE PRECISION,
    "sang" TEXT,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symptomes" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "symptome" TEXT,
    "localisation" TEXT,
    "intensite_10" INTEGER,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symptomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tensions_arterielles" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "delais" TEXT,
    "position" TEXT,
    "systolique" INTEGER,
    "diastolique" INTEGER,
    "fc" INTEGER,
    "pp" INTEGER,
    "pam" INTEGER,
    "ratio_tad_fc" DOUBLE PRECISION,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tensions_arterielles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selles" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "consistance" TEXT,
    "commentaire" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notes" (
    "id" TEXT NOT NULL,
    "journee_id" TEXT NOT NULL,
    "heure" TEXT,
    "commentaire" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "journees_date_idx" ON "journees"("date");

-- CreateIndex
CREATE UNIQUE INDEX "journees_user_id_date_key" ON "journees"("user_id", "date");

-- CreateIndex
CREATE UNIQUE INDEX "aliments_ref_nom_key" ON "aliments_ref"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "solutions_ref_nom_key" ON "solutions_ref"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "supplements_ref_nom_key" ON "supplements_ref"("nom");

-- CreateIndex
CREATE INDEX "repas_journee_id_idx" ON "repas"("journee_id");

-- CreateIndex
CREATE INDEX "repas_aliments_repas_id_idx" ON "repas_aliments"("repas_id");

-- CreateIndex
CREATE INDEX "repas_supplements_repas_id_idx" ON "repas_supplements"("repas_id");

-- CreateIndex
CREATE INDEX "hydratations_journee_id_idx" ON "hydratations"("journee_id");

-- CreateIndex
CREATE INDEX "mictions_journee_id_idx" ON "mictions"("journee_id");

-- CreateIndex
CREATE INDEX "symptomes_journee_id_idx" ON "symptomes"("journee_id");

-- CreateIndex
CREATE INDEX "tensions_arterielles_journee_id_idx" ON "tensions_arterielles"("journee_id");

-- CreateIndex
CREATE INDEX "selles_journee_id_idx" ON "selles"("journee_id");

-- CreateIndex
CREATE INDEX "notes_journee_id_idx" ON "notes"("journee_id");

-- AddForeignKey
ALTER TABLE "journees" ADD CONSTRAINT "journees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repas" ADD CONSTRAINT "repas_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repas_aliments" ADD CONSTRAINT "repas_aliments_repas_id_fkey" FOREIGN KEY ("repas_id") REFERENCES "repas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repas_aliments" ADD CONSTRAINT "repas_aliments_aliment_id_fkey" FOREIGN KEY ("aliment_id") REFERENCES "aliments_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repas_supplements" ADD CONSTRAINT "repas_supplements_repas_id_fkey" FOREIGN KEY ("repas_id") REFERENCES "repas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repas_supplements" ADD CONSTRAINT "repas_supplements_supplement_id_fkey" FOREIGN KEY ("supplement_id") REFERENCES "supplements_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydratations" ADD CONSTRAINT "hydratations_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hydratations" ADD CONSTRAINT "hydratations_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions_ref"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mictions" ADD CONSTRAINT "mictions_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symptomes" ADD CONSTRAINT "symptomes_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tensions_arterielles" ADD CONSTRAINT "tensions_arterielles_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selles" ADD CONSTRAINT "selles_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_journee_id_fkey" FOREIGN KEY ("journee_id") REFERENCES "journees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
