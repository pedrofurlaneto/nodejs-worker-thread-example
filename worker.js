import { workerData, parentPort } from "worker_threads";

let result = 0;
for (let i = workerData.init; i < workerData.end; i++) {
    result += Math.sqrt(i);
}

parentPort.postMessage(result);