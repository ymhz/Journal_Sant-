import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALIMENTS = [
  { nom: "Dinde Cuite", kcal: 170, prot: 28, lip: 6, gluc: 0, fib: null, na: 80, k: 280, ca: 15, mg: 25, oxa: 2, pral: 14, ig: null, cg: null },
  { nom: "Huile Olive", kcal: 900, prot: null, lip: 100, gluc: null, fib: null, na: null, k: null, ca: null, mg: null, oxa: null, pral: 0, ig: null, cg: null },
  { nom: "Vollkornbrot", kcal: 240, prot: 7, lip: 2, gluc: 47, fib: 9, na: 400, k: 340, ca: 40, mg: 70, oxa: 27, pral: 3, ig: null, cg: null },
  { nom: "Biscottes", kcal: 390, prot: 12, lip: 7, gluc: 72, fib: 9, na: 628, k: 280, ca: 50, mg: 100, oxa: 50, pral: 2, ig: null, cg: null },
  { nom: "Bananes", kcal: 90, prot: 1, lip: 0.3, gluc: 23, fib: 2.7, na: 0, k: 360, ca: 5, mg: 27, oxa: 6.5, pral: -7, ig: null, cg: null },
  { nom: "Kiwi", kcal: 55, prot: 1, lip: 0.5, gluc: 13, fib: 2.7, na: 3, k: 270, ca: 36, mg: 14, oxa: 20, pral: -5, ig: null, cg: null },
  { nom: "Maquereau", kcal: 206, prot: 19, lip: 14, gluc: 0, fib: null, na: 480, k: 450, ca: 12, mg: 30, oxa: null, pral: 8, ig: null, cg: null },
  { nom: "Sel de Table", kcal: 0, prot: 0, lip: 0, gluc: 0, fib: 0, na: 40000, k: 0, ca: 0, mg: 0, oxa: 0, pral: 0, ig: null, cg: null },
  { nom: "Petits pois", kcal: 84, prot: 5, lip: 0.4, gluc: 14, fib: 5, na: 1, k: 270, ca: 25, mg: 33, oxa: 1, pral: 1, ig: null, cg: null },
  { nom: "Noix de Grenoble", kcal: 654, prot: 15, lip: 65, gluc: 7, fib: 7, na: 2, k: 441, ca: 98, mg: 158, oxa: 62, pral: 6, ig: null, cg: null },
  { nom: "Patate douce", kcal: 90, prot: 2, lip: 0.15, gluc: 21, fib: 3.3, na: 36, k: 475, ca: 38, mg: 27, oxa: 42, pral: -8, ig: null, cg: null },
  { nom: "ProtÃ©ines de soja texturÃ©es", kcal: 327, prot: 50, lip: 1.2, gluc: 16, fib: 18, na: 20, k: 2384, ca: 241, mg: 290, oxa: 320, pral: -11, ig: null, cg: null },
  { nom: "Carottes", kcal: 41, prot: 0.9, lip: 0.2, gluc: 9.6, fib: 2.8, na: 69, k: 320, ca: 33, mg: 12, oxa: 28, pral: -6, ig: null, cg: null },
  { nom: "Oeufs", kcal: 143, prot: 13, lip: 10, gluc: 0.7, fib: 0, na: 140, k: 134, ca: 53, mg: 12, oxa: 0, pral: 9, ig: null, cg: null },
  { nom: "CÃ©leri branche", kcal: 16, prot: 0.7, lip: 0.2, gluc: 1.8, fib: 1.6, na: 80, k: 260, ca: 40, mg: 11, oxa: 8, pral: -5, ig: null, cg: null },
  { nom: "Fenouil", kcal: 31, prot: 1.2, lip: 0.2, gluc: 3.9, fib: 3.1, na: 52, k: 414, ca: 49, mg: 17, oxa: 20, pral: -8, ig: null, cg: null },
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
  { nom: "PrÃ©charge", nacl: null, khco3: 200, nahco3: 997.5, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 399, k: 80, hco3: null, cl: null },
  { nom: "ELEC-Matin-03", nacl: 1776, khco3: 100, nahco3: 130, citrateK: null, citrateNa: null, mgSel: 222, caSel: null, na: null, k: 92, hco3: null, cl: null },
  { nom: "Daily03", nacl: 1666.67, khco3: null, nahco3: null, citrateK: null, citrateNa: null, mgSel: null, caSel: null, na: 666.67, k: null, hco3: null, cl: null },
];

const SUPPLEMENTS = [
  { nom: "Eurobiol", dosage: "25000 UI" },
  { nom: "Azinc", dosage: "1 gÃ©lule" },
  { nom: "Vitamine D3-K2", dosage: "2000 UI" },
  { nom: "Vitamine C", dosage: "500 mg" },
  { nom: "Ergymag", dosage: "2 gÃ©lules" },
  { nom: "Mg Bisglycinate", dosage: "300 mg" },
];

async function main() {
  console.log("ðŸŒ± Seeding database...\n");

  const user = await prisma.user.upsert({
    where: { email: "moi@journal-sante.local" },
    update: {},
    create: { email: "moi@journal-sante.local", nom: "Utilisateur" },
  });
  console.log(`âœ“ User: ${user.email}`);

  for (const a of ALIMENTS) {
    await prisma.alimentRef.upsert({
      where: { nom: a.nom },
      update: a,
      create: a,
    });
  }
  console.log(`âœ“ ${ALIMENTS.length} aliments`);

  for (const s of SOLUTIONS) {
    await prisma.solutionRef.upsert({
      where: { nom: s.nom },
      update: s,
      create: s,
    });
  }
  console.log(`âœ“ ${SOLUTIONS.length} solutions`);

  for (const s of SUPPLEMENTS) {
    await prisma.supplementRef.upsert({
      where: { nom: s.nom },
      update: s,
      create: s,
    });
  }
  console.log(`âœ“ ${SUPPLEMENTS.length} supplÃ©ments`);

  console.log("\nâœ… Seed terminÃ©.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
