/* eslint-disable @typescript-eslint/no-explicit-any */

async function postOverview({ body }: { body: Record<string, any> }) {
    try {
        console.log(body, "disini datanya")
        // await fs.writeFile(
        //     path.join(
        //         projectEnv.PROJECT_ROOT_DIR,
        //         overviewsDir,
        //         params.name + ".json"
        //     ),
        //     JSON.stringify(data, null, 2),
        //     "utf-8"
        // );
        return {
            success: true,
            message: "Overview created successfully",
            data: body
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            message: "Error creating overview",
        };
    }
}

export default postOverview