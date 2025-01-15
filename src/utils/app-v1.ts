import { ApiV1 } from '@/lib/api/v1/api-v1'
import { treaty } from '@elysiajs/eden'
const AppV1 = treaty<ApiV1>('localhost:3000')

export default AppV1