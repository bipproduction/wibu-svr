const PROJECTS_DIR = process.env.PROJECTS_DIR
const NGINX_CONF_DIR = process.env.NGINX_CONF_DIR
const NEXT_PUBLIC_HOST = process.env.NEXT_PUBLIC_HOST

if (!PROJECTS_DIR || !NGINX_CONF_DIR || !NEXT_PUBLIC_HOST) {
    throw new Error('PROJECTS_DIR, NGINX_CONF_DIR, and NEXT_PUBLIC_HOST must be set')
}

const projectEnv = {
    PROJECTS_DIR,
    NGINX_CONF_DIR,
    NEXT_PUBLIC_HOST
}
export default projectEnv
