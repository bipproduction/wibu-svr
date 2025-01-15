import { APIV2 } from '@/lib/api/v2'
import { treaty } from '@elysiajs/eden'
const AppV2 = treaty<APIV2>(process.env.NEXT_PUBLIC_HOST || 'localhost:3000')

export default AppV2