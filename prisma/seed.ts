import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALIMENTS = [
  { nom: "Dinde Cuite", kcal: 170, prot: 28.0, lip: 6.0, gluc: 0.0, fib: 0.0, na: 80, k: 280, ca: 2, mg: 15, oxa: 0.0, pral: 14.0, ig: null, cg: null },
  { nom: "Huile Olive", kcal: 900, prot: null, lip: 100.0, gluc: null, fib: null, na: null, k: null, ca: null, mg: null, oxa: null, pral: 0, ig: null, cg: null },
  { nom: "Biscottes", kcal: 390, prot: 12.0, lip: 7.0, gluc: 72.0, fib: 9.0, na: 628, k: 280, ca: 50, mg: 100, oxa: 50.0, pral: 2.0, ig: 70, cg: 50.4 },
  { nom: "Bananes", kcal: 90, prot: 1.0, lip: 0.3, gluc: 19.7, fib: 2.7, na: 1, k: 360, ca: 5, mg: 27, oxa: 6.5, pral: -7.0, ig: 52, cg: 10.2 },
  { nom: "Kiwi", kcal: 61, prot: 1.1, lip: 0.5, gluc: 14.4, fib: 3.0, na: 3, k: 300, ca: 40, mg: 16, oxa: 22.0, pral: -5.5, ig: 53, cg: 7.6 },
  { nom: "Maquereau", kcal: 206, prot: 19.0, lip: 14.0, gluc: 0.0, fib: 0.0, na: 480, k: 450, ca: 12, mg: 30, oxa: 0.0, pral: 8.0, ig: null, cg: null },
  { nom: "Sel de Table", kcal: 0, prot: 0.0, lip: 0.0, gluc: 0.0, fib: 0.0, na: 40000, k: 0, ca: 0, mg: 0, oxa: 0.0, pral: 0.0, ig: null, cg: null },
  { nom: "Petits pois", kcal: 84, prot: 5.0, lip: 0.4, gluc: 14.0, fib: 5.0, na: 1, k: 270, ca: 25, mg: 33, oxa: 1.0, pral: 1.0, ig: 35, cg: 4.9 },
  { nom: "Noix de Grenoble", kcal: 654, prot: 15.0, lip: 65.0, gluc: 14.0, fib: 6.7, na: 2, k: 441, ca: 62, mg: 98, oxa: 7.0, pral: 6.0, ig: 15, cg: 2.1 },
  { nom: "Patate douce", kcal: 90, prot: 2.0, lip: 0.15, gluc: 21.0, fib: 3.3, na: 36, k: 475, ca: 38, mg: 27, oxa: 42.0, pral: -8.0, ig: 61, cg: 12.8 },
  { nom: "Protéines de soja texturées", kcal: 327, prot: 50.0, lip: 1.2, gluc: 18.0, fib: 18.0, na: 20, k: 2384, ca: 241, mg: 290, oxa: 320.0, pral: -11.0, ig: 18, cg: 3.2 },
  { nom: "Carottes", kcal: 41, prot: 0.9, lip: 0.2, gluc: 9.6, fib: 2.8, na: 69, k: 320, ca: 33, mg: 12, oxa: 28.0, pral: -6.0, ig: 35, cg: 3.4 },
  { nom: "Oeufs", kcal: 143, prot: 13.0, lip: 10.0, gluc: 0.7, fib: 0.0, na: 140, k: 134, ca: 53, mg: 12, oxa: 0.0, pral: 9.0, ig: null, cg: null },
  { nom: "Céleri branche", kcal: 16, prot: 0.7, lip: 0.2, gluc: 1.8, fib: 1.6, na: 80, k: 260, ca: 40, mg: 11, oxa: 8.0, pral: -5.0, ig: 15, cg: 0.3 },
  { nom: "Fenouil", kcal: 31, prot: 1.2, lip: 0.2, gluc: 3.9, fib: 3.1, na: 52, k: 414, ca: 49, mg: 17, oxa: 20.0, pral: -8.0, ig: 15, cg: 0.6 },
  { nom: "Native Isolat Whey", kcal: 370, prot: 90.0, lip: 1.0, gluc: 1.0, fib: 0.0, na: 50, k: 200, ca: 60, mg: 20, oxa: 0.0, pral: 18.0, ig: 15, cg: 0.2 },
  { nom: "Isolat Pois", kcal: 380, prot: 85.0, lip: 2.0, gluc: 2.0, fib: 1.0, na: 900, k: 120, ca: 80, mg: 50, oxa: 0.0, pral: 16.0, ig: 15, cg: 0.3 },
  { nom: "Pois chiche", kcal: 164, prot: 8.9, lip: 2.6, gluc: 27.4, fib: 7.6, na: 7, k: 291, ca: 49, mg: 48, oxa: 9.0, pral: -3.0, ig: 28, cg: 7.7 },
  { nom: "Flocon d'avoine", kcal: 389, prot: 13.2, lip: 6.9, gluc: 66.3, fib: 10.6, na: 2, k: 362, ca: 54, mg: 177, oxa: 41.0, pral: -10.0, ig: 55, cg: 36.5 },
  { nom: "Pumpernickel", kcal: 250, prot: 9.0, lip: 1.0, gluc: 47.0, fib: 6.0, na: 520, k: 200, ca: 40, mg: 75, oxa: 8.0, pral: 1.0, ig: 50, cg: 23.5 },
  { nom: "Psyllium", kcal: 200, prot: 7.8, lip: 0.0, gluc: 85.0, fib: 80.0, na: 9, k: 800, ca: 178, mg: 200, oxa: 5.0, pral: -8.0, ig: null, cg: null },
  { nom: "Tofu Soyeux", kcal: 55, prot: 5.3, lip: 2.7, gluc: 2.2, fib: 0.2, na: 6, k: 121, ca: 111, mg: 27, oxa: 10.0, pral: -1.0, ig: 15, cg: 0.3 },
  { nom: "Tempeh", kcal: 193, prot: 18.5, lip: 10.8, gluc: 9.4, fib: 5.4, na: 9, k: 412, ca: 111, mg: 81, oxa: 24.0, pral: 3.0, ig: 15, cg: 1.4 },
  { nom: "Tofu surpressé", kcal: 120, prot: 14.0, lip: 6.0, gluc: 2.5, fib: 0.3, na: 8, k: 150, ca: 140, mg: 35, oxa: 12.0, pral: 2.0, ig: 15, cg: 0.4 },
  { nom: "Graines germées Broccoli", kcal: 35, prot: 3.8, lip: 0.5, gluc: 4.4, fib: 2.6, na: 25, k: 370, ca: 103, mg: 25, oxa: 15.0, pral: -4.0, ig: 15, cg: 0.7 },
  { nom: "Fèves Cacao", kcal: 650, prot: 13.9, lip: 56.5, gluc: 22.2, fib: 33.0, na: 21, k: 1524, ca: 128, mg: 499, oxa: 625.0, pral: -4.0, ig: 20, cg: 4.4 },
  { nom: "Matcha", kcal: 324, prot: 29.0, lip: 5.3, gluc: 39.0, fib: 38.5, na: 6, k: 2700, ca: 420, mg: 230, oxa: 1.0, pral: -12.0, ig: 10, cg: 3.9 },
  { nom: "Double concentré de Tomate", kcal: 86, prot: 4.1, lip: 0.7, gluc: 15.0, fib: 3.0, na: 50, k: 1100, ca: 20, mg: 45, oxa: 10.0, pral: -3.0, ig: 38, cg: 5.7 },
  { nom: "Artichauts", kcal: 47, prot: 3.3, lip: 0.2, gluc: 10.5, fib: 5.4, na: 94, k: 370, ca: 44, mg: 60, oxa: 119.0, pral: -3.5, ig: 15, cg: 1.6 },
  { nom: "Xanthane", kcal: 0, prot: 0.0, lip: 0.0, gluc: 0.0, fib: 0.0, na: 1400, k: 2600, ca: 0, mg: 0, oxa: 0.0, pral: 0.0, ig: null, cg: null },
  { nom: "Tapioca", kcal: 358, prot: 0.2, lip: 0.0, gluc: 88.7, fib: 0.9, na: 1, k: 11, ca: 20, mg: 1, oxa: 0.0, pral: 1.0, ig: 85, cg: 75.4 },
  { nom: "Avocat", kcal: 160, prot: 2.0, lip: 14.7, gluc: 8.5, fib: 6.7, na: 7, k: 485, ca: 12, mg: 29, oxa: 9.0, pral: -8.0, ig: 10, cg: 0.9 },
  { nom: "Courgettes", kcal: 17, prot: 1.2, lip: 0.3, gluc: 3.1, fib: 1.0, na: 8, k: 261, ca: 16, mg: 18, oxa: 4.0, pral: -4.5, ig: 15, cg: 0.5 },
  { nom: "Concombre", kcal: 15, prot: 0.7, lip: 0.1, gluc: 3.6, fib: 0.5, na: 2, k: 147, ca: 16, mg: 13, oxa: 1.9, pral: -3.0, ig: 15, cg: 0.5 },
];

const SOLUTIONS = [
  { nom: "Eau pure", nacl: 0, khco3: 0, nahco3: 0, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 0, k: 0, hco3: null, cl: null },
  { nom: "EP", nacl: null, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: null, k: null, hco3: null, cl: null },
  { nom: "Badoit", nacl: null, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 180, k: null, hco3: 1250, cl: null },
  { nom: "Badoit Citrate", nacl: null, khco3: null, nahco3: null, citrateK: null, citrateNa: 1250, mgSel: null, caSel: null, na: 180, k: null, hco3: null, cl: null },
  { nom: "EP - Na2", nacl: 2000, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 800, k: null, hco3: null, cl: null },
  { nom: "EP - NaHCO3 x1", nacl: null, khco3: null, nahco3: 1000, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 270, k: null, hco3: 730, cl: null },
  { nom: "Vichy", nacl: null, khco3: null, nahco3: 2989, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 1172, k: null, hco3: 2989, cl: null },
  { nom: "Electrolytes 12/12", nacl: 3200, khco3: 5600, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 1280, k: 2240, hco3: null, cl: null },
  { nom: "Electrolytes 4:2", nacl: 3200, khco3: 2000, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 1280, k: 800, hco3: 1200, cl: null },
  { nom: "Vichy-K", nacl: null, khco3: 1000, nahco3: 1494.5, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 586, k: 400, hco3: 2094.5, cl: null },
  { nom: "Vichy-Cl", nacl: 1000, khco3: null, nahco3: 1494.5, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 1086, k: null, hco3: 1494.5, cl: null },
  { nom: "ELEC0801", nacl: 1333, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 800, k: null, hco3: null, cl: null },
  { nom: "ELEC1301", nacl: 1250, khco3: null, nahco3: null, citrateK: 2083, citrateNa: null, mgSel: null, caSel: null, na: 500, k: 833, hco3: null, cl: null },
  { nom: "ELEC1401", nacl: 1750, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 700, k: null, hco3: null, cl: null },
  { nom: "ELEC-Matin-01", nacl: 2125, khco3: null, nahco3: null, citrateK: null, citrateNa: 1875, mgSel: null, caSel: null, na: 1325, k: null, hco3: null, cl: 1275 },
  { nom: "ELEC-Lis-01", nacl: 1250, khco3: null, nahco3: null, citrateK: null, citrateNa: 2000, mgSel: null, caSel: null, na: 790, k: null, hco3: null, cl: 375 },
  { nom: "ELEC-TAMPON", nacl: null, khco3: null, nahco3: 3000, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 810, k: null, hco3: 2190, cl: null },
  { nom: "ELEC charge 8", nacl: null, khco3: null, nahco3: null, citrateK: null, citrateNa: 5328, mgSel: null, caSel: null, na: 1438.56, k: null, hco3: null, cl: null },
  { nom: "ELEC-Matin-02", nacl: 2000, khco3: 400, nahco3: null, citrateK: null, citrateNa: 600, mgSel: 200, caSel: null, na: 962, k: 160, hco3: null, cl: null },
  { nom: "ELEC-Na-4", nacl: 2666, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 1066.4, k: null, hco3: null, cl: null },
  { nom: "Daily01", nacl: 1333, khco3: null, nahco3: 400, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 641.2, k: null, hco3: null, cl: null },
  { nom: "Précharge", nacl: null, khco3: 200, nahco3: 997.5, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 399, k: 80, hco3: null, cl: null },
  { nom: "ELEC-Matin-03", nacl: 1776, khco3: 100, nahco3: 130, citrateK: null, citrateNa: null, mgSel: 222, caSel: null, na: null, k: 92, hco3: null, cl: null },
  { nom: "Daily03", nacl: 1666.67, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 666.67, k: null, hco3: null, cl: null },
];

const SUPPLEMENTS = [
  { nom: "Eurobiol", dosage: "25000 UI" },
  { nom: "Azinc", dosage: "1 gélule" },
  { nom: "Vitamine D3-K2", dosage: "2000 UI" },
  { nom: "Vitamine C", dosage: "500 mg" },
  { nom: "Ergymag", dosage: "2 gélules" },
  { nom: "Mg Bisglycinate", dosage: "300 mg" },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  const user = await prisma.user.upsert({
    where: { email: "moi@journal-sante.local" },
    update: {},
    create: { email: "moi@journal-sante.local", nom: "Utilisateur" },
  });
  console.log(`✓ User: ${user.email}`);

  for (const a of ALIMENTS) {
    await prisma.alimentRef.upsert({
      where: { nom: a.nom },
      update: a,
      create: a,
    });
  }
  console.log(`✓ ${ALIMENTS.length} aliments`);

  for (const s of SOLUTIONS) {
    await prisma.solutionRef.upsert({
      where: { nom: s.nom },
      update: s,
      create: s,
    });
  }
  console.log(`✓ ${SOLUTIONS.length} solutions`);

  for (const s of SUPPLEMENTS) {
    await prisma.supplementRef.upsert({
      where: { nom: s.nom },
      update: s,
      create: s,
    });
  }
  console.log(`✓ ${SUPPLEMENTS.length} suppléments`);

  console.log("\n✅ Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());