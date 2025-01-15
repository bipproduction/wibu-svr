async function deploymentFind({ name }: { name: string }) {
    return {
        status: 200,
        success: true,
        message: "success find deployment by name",
    };
}

export default deploymentFind;
