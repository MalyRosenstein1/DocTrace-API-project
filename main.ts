import App from "./app";

async function main() {
    const app = new App();
    process.on("exit", async () => {
        await app.terminate();
    });

    await app.init();
}

main();