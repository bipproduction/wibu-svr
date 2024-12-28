/* eslint-disable @typescript-eslint/no-explicit-any */
import { proxy } from "valtio"

const state = proxy({
    updateRender: {
      key: "zxc",
      setKey: () => {
        state.updateRender.key = Math.random().toString()
      }
    },
    nginx: {
      config: {
        name: "default",
        data: "",
        setName: (name: string) => {
            state.nginx.config.name = name
        },
        setData: (data: string) => {
            state.nginx.config.data = data
        }
      }
    }
  })

export default state