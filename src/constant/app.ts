import { API } from '@/app/api/[[...slog]]/route'
import { treaty } from '@elysiajs/eden'
const url = process.env.NEXT_PUBLIC_URL;
if (!url) {
    throw new Error('NEXT_PUBLIC_URL is not set')
}
const app = treaty<API>(url)
export default app;
