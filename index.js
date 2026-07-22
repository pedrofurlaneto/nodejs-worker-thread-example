import express from "express";
import { Worker } from "worker_threads";

const app = express();

const THREADS_NUMBER = 4;

app.get("/non-blockeable", (req, res) => {
    res.status(200).send("Hello! This is a non-blockable route.");
});

app.get("/blockeable", (req, res) => {
    let result = 0;
    for (let i = 0; i < 200_000_000_000; i++) {
        result += Math.sqrt(i);
    }

    res.status(200).send(`This is a main thread blockeable route. The result is: ${count}`);
});

app.get("/count-with-workers", async (req, res) => {
    const promises = [];

    for (let i = 1; i < THREADS_NUMBER; i++) {
        const init = i * 50_000_000_000;
        const end = (i + 1) * 50_000_000_000;

        promises.push(
            new Promise((resolve, reject) => {
                const worker = new Worker("./worker.js", {
                    workerData: { init, end }
                });

                worker.on("message", resolve);
                worker.on("error", reject);
            })
        );
    }

    const results = await Promise.all(promises);
    const totalCount = results.reduce((acc, curr) => acc + curr, 0);

    res.status(200).send(`This is a worker thread route. The total result is: ${totalCount}`);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});