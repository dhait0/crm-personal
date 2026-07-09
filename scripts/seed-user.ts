import { prisma } from "../src/lib/prisma";
import { hashPassword } from "../src/lib/auth";

function readFlag(name: string) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const email = readFlag("--email") ?? process.env.ADMIN_EMAIL;
  const password = readFlag("--password") ?? process.env.ADMIN_PASSWORD;
  const name = readFlag("--name") ?? process.env.ADMIN_NAME ?? "Sebastian";

  if (!email || !password) {
    throw new Error("Debes enviar --email y --password, o definir ADMIN_EMAIL y ADMIN_PASSWORD.");
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      passwordHash,
      name
    },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      name
    }
  });

  console.log(`Usuario listo: ${user.email}`);
}

void main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
