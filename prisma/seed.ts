import prisma from "@/lib/prisma";

const listEnvGroup = ['production', 'preview', 'development']

async function main() {
    for (const envGroup of listEnvGroup) {
        await prisma.envGroup.upsert({
            where: { name: envGroup },
            update: {},
            create: { id: envGroup, name: envGroup }
        })
    }

    console.log('EnvGroup created')
}

main().then(() => {
    console.log('Seed completed')
}).catch((error) => {
    console.error('Error seeding database:', error)
}).finally(() => {
    prisma.$disconnect()
})