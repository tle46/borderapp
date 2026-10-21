// Pages routes every /api/* request here; BACKEND_ORIGIN is server-side only.
export async function onRequest({ request, env }) {
  let upstream
  let backendPrefix
  try {
    upstream = new URL(env.BACKEND_ORIGIN)
    if (!['http:', 'https:'].includes(upstream.protocol) || upstream.search || upstream.hash || upstream.username || upstream.password) {
      throw new Error('Expected an HTTP(S) base URL')
    }
    backendPrefix = upstream.pathname.replace(/\/+$/, '')
  } catch {
    return Response.json({ detail: 'BACKEND_ORIGIN must be configured as an HTTP(S) base URL, optionally including a path prefix.' }, { status: 503 })
  }

  const incoming = new URL(request.url)
  // Assign pathname rather than resolving a relative URL so paths cannot change the origin.
  upstream.pathname = backendPrefix + (incoming.pathname.replace(/^\/api(?=\/|$)/, '') || '/')
  upstream.search = incoming.search
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('X-Forwarded-Host', incoming.host)
  headers.set('X-Forwarded-Proto', incoming.protocol.slice(0, -1))
  const options = { method: request.method, headers, redirect: 'manual' }
  if (!['GET', 'HEAD'].includes(request.method)) options.body = request.body

  try {
    const response = await fetch(upstream, options)
    const responseHeaders = new Headers(response.headers)
    const location = responseHeaders.get('location')
    if (location) {
      const redirect = new URL(location, upstream)
      if (redirect.origin === upstream.origin && (!backendPrefix || redirect.pathname === backendPrefix || redirect.pathname.startsWith(`${backendPrefix}/`))) {
        redirect.protocol = incoming.protocol
        redirect.host = incoming.host
        redirect.pathname = `/api${redirect.pathname.slice(backendPrefix.length) || '/'}`
        responseHeaders.set('location', redirect.toString())
      }
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers: responseHeaders })
  } catch {
    return Response.json({ detail: 'Backend is unavailable.' }, { status: 502 })
  }
}
