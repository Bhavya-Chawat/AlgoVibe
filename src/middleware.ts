import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const isDev = process.env.NODE_ENV === 'development'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes (no auth needed)
  const publicRoutes = [
    "/",
    "/login",
    "/admin/login",
    "/evaluator/login",
    "/register",
    "/unauthorized",
  ]
  
  if (publicRoutes.includes(pathname)) {
    if (isDev) console.log("[MIDDLEWARE] Public route:", pathname)
    return supabaseResponse
  }

  // Require authentication for protected routes
  if (!user) {
    if (isDev) console.log("[MIDDLEWARE] No user found, redirecting to login")

    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
    if (pathname.startsWith("/evaluator")) {
      return NextResponse.redirect(new URL("/evaluator/login", request.url))
    }
    if (pathname.startsWith("/contest") || pathname.startsWith("/pre-contest")) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    return supabaseResponse
  }

  if (isDev) console.log("[MIDDLEWARE] User authenticated:", user.email)

  // Create admin client with service role key
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    if (isDev) console.error("[MIDDLEWARE] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing!")
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )

  if (isDev) console.log("[MIDDLEWARE] Checking role for:", user.email)

  // Get user role
  const { data: userRole, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("email", user.email!)
    .single()

  if (isDev) {
    console.log("[MIDDLEWARE] Role query result:", {
      data: userRole,
      error: roleError?.message,
      code: roleError?.code,
      hint: roleError?.hint,
    })
  }

  // Default to contestant if no role found
  const role = userRole?.role || "contestant"
  if (isDev) console.log("[MIDDLEWARE] Final role determined:", role)

  // Role-based route protection (exclude login pages)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (isDev) console.log("[MIDDLEWARE] Checking admin access. User role:", role)
    if (role !== "admin") {
      if (isDev) console.log("[MIDDLEWARE] ❌ Access denied to /admin - role is:", role)
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    if (isDev) console.log("[MIDDLEWARE] ✅ Admin access granted")
  }

  if (pathname.startsWith("/evaluator") && pathname !== "/evaluator/login") {
    if (isDev) console.log("[MIDDLEWARE] Checking evaluator access. User role:", role)
    if (role !== "evaluator" && role !== "admin") {
      if (isDev) console.log("[MIDDLEWARE] ❌ Access denied to /evaluator - role is:", role)
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    if (isDev) console.log("[MIDDLEWARE] ✅ Evaluator access granted")
  }

  if (pathname.startsWith("/contest") || pathname.startsWith("/pre-contest")) {
    if (isDev) console.log("[MIDDLEWARE] Checking contestant access. User role:", role)
    if (role !== "contestant") {
      if (isDev) console.log("[MIDDLEWARE] ❌ Access denied to /contest - role is:", role)
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
    if (isDev) console.log("[MIDDLEWARE] ✅ Contestant access granted")
  }

  // Redirect logged-in users away from login pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url))
    if (role === "evaluator") return NextResponse.redirect(new URL("/evaluator", request.url))
    return NextResponse.redirect(new URL("/pre-contest", request.url))
  }

  if (user && pathname === "/admin/login") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin", request.url))
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (user && pathname === "/evaluator/login") {
    if (role === "evaluator" || role === "admin") {
      return NextResponse.redirect(new URL("/evaluator", request.url))
    }
    return NextResponse.redirect(new URL("/unauthorized", request.url))
  }

  if (isDev) console.log("[MIDDLEWARE] ✅ Access granted to:", pathname)
  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
