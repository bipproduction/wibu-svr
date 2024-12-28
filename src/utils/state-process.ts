/* eslint-disable @typescript-eslint/no-unused-vars */
import { proxy } from "valtio";

const dataExample = {
    "name": "ninox-fox_3011",
    "pid": 1698183,
    "status": "online",
    "cwd": "/root/projects/ninox-fox",
    "created_at": 1728280102224,
    "restart_time": 0
}

type DataProccess = {
    online: typeof dataExample[];
    stopped: typeof dataExample[];
}

const stateProccess = proxy<{
    data: DataProccess,
    setData: (data: DataProccess) => void
}>({
    data: {
        online: [],
        stopped: []
    },
    setData: (data) => {
        stateProccess.data = data
    }
});

export default stateProccess;