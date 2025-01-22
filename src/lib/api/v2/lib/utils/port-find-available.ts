import findPort from "@/utils/find-port";

async function portFindAvailable({ count }: { count: number }) {
    try {
        const ports = await findPort({ count })
        return {
            status: 200,
            data: ports
        };
    } catch (error) {
        return {
            status: 500,
            error: error
        };
    }
}

export default portFindAvailable