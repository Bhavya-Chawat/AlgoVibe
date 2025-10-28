import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const isDev = process.env.NODE_ENV === "development";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  if (isDev)
    console.log("[MIDDLEWARE] Processing request:", request.nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (isDev)
    console.log("[MIDDLEWARE] Authenticated user:", user?.email || null);

  // Public routes - no auth required
  const publicRoutes = [
    "/",
    "/login",
    "/admin/login",
    "/evaluator/login",
    "/register",
    "/unauthorized",
    "/favicon.ico",
  ];
  if (publicRoutes.includes(pathname)) {
    if (isDev) console.log(`[MIDDLEWARE] Public route accessed: ${pathname}`);
    return supabaseResponse;
  }

  // Require authenticated user
  if (!user) {
    if (isDev)
      console.log("[MIDDLEWARE] No user found, redirecting based on path");

    if (pathname.startsWith("/admin")) {
      if (isDev) console.log("[MIDDLEWARE] Redirecting to /admin/login");
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (pathname.startsWith("/evaluator")) {
      if (isDev) console.log("[MIDDLEWARE] Redirecting to /evaluator/login");
      return NextResponse.redirect(new URL("/evaluator/login", request.url));
    }
    if (
      pathname.startsWith("/contest") ||
      pathname.startsWith("/pre-contest") ||
      pathname === "/contest-end"
    ) {
      if (isDev)
        console.log("[MIDDLEWARE] Redirecting to /login for contestant area");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return supabaseResponse;
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    if (isDev)
      console.error(
        "[MIDDLEWARE] CRITICAL: SUPABASE_SERVICE_ROLE_KEY missing!"
      );
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {},
      },
    }
  );

  if (isDev) console.log(`[MIDDLEWARE] Fetching role for user: ${user.email}`);

  // Get user role from user_roles table, using maybeSingle to avoid errors
  const { data: userRole, error: roleError } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("email", user.email!)
    .maybeSingle();

  if (isDev) {
    if (roleError) {
      console.log("[MIDDLEWARE] Role query error:", roleError.message);
    }
    console.log("[MIDDLEWARE] Role query result:", userRole);
  }

  // Fallback if no role found
  const role = userRole?.role || "contestant";
  if (isDev) console.log(`[MIDDLEWARE] Computed role: ${role}`);

  // Fetch contest information to check if it has ended
  const { data: contest, error: contestError } = await supabaseAdmin
    .from("contest")
    .select("is_active, start_time, duration_minutes, end_time")
    .single();

  if (isDev) {
    if (contestError) {
      console.log("[MIDDLEWARE] Contest fetch error:", contestError.message);
    }
    console.log(`[MIDDLEWARE] Contest data:`, contest);
  }

  // Check if contest has ended
  let contestHasEnded = false;
  let contestIsActive = false;

  if (contest) {
    contestIsActive = contest.is_active === true;

    if (contest.end_time) {
      const endTime = new Date(contest.end_time);
      const now = new Date();
      contestHasEnded = now > endTime;

      if (isDev) {
        console.log(`[MIDDLEWARE] Contest end time: ${endTime}`);
        console.log(`[MIDDLEWARE] Current time: ${now}`);
        console.log(`[MIDDLEWARE] Contest has ended: ${contestHasEnded}`);
      }
    } else if (isDev) {
      console.log(`[MIDDLEWARE] No end time found`);
    }
  } else if (isDev) {
    console.log(`[MIDDLEWARE] No contest data found`);
  }

  // Handle contest-end page access
  if (pathname === "/contest-end") {
    // Only allow access to contest-end page when contest has actually ended
    if (!contestHasEnded) {
      if (isDev)
        console.log(
          "[MIDDLEWARE] Contest not ended yet - redirecting from /contest-end"
        );

      // Redirect to appropriate contest page based on contest state
      if (contestIsActive) {
        return NextResponse.redirect(new URL("/contest", request.url));
      } else {
        return NextResponse.redirect(new URL("/pre-contest", request.url));
      }
    }

    if (isDev) console.log(`[MIDDLEWARE] Accessing contest-end page directly`);
    // Add cache control headers to prevent caching
    const response = NextResponse.next({ request });
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    return response;
  }

  // Role-based access control:

  // Admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (role !== "admin") {
      if (isDev)
        console.log(`[MIDDLEWARE] Access denied to /admin for role: ${role}`);
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isDev) console.log("[MIDDLEWARE] Admin access granted");
  }

  // Evaluator routes
  if (pathname.startsWith("/evaluator") && pathname !== "/evaluator/login") {
    if (role !== "evaluator" && role !== "admin") {
      if (isDev)
        console.log(
          `[MIDDLEWARE] Access denied to /evaluator for role: ${role}`
        );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
    if (isDev) console.log("[MIDDLEWARE] Evaluator access granted");
  }

  // Contestant routes (/contest & /pre-contest & /contest-end)
  if (
    pathname.startsWith("/contest") ||
    pathname.startsWith("/pre-contest") ||
    pathname === "/contest-end"
  ) {
    if (role !== "contestant") {
      if (isDev)
        console.log(
          `[MIDDLEWARE] Access denied contestant area for role: ${role}`
        );
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Redirect contestant based on contest state
    if (pathname.startsWith("/contest")) {
      // If contest has ended, redirect to contest-end
      if (contestHasEnded) {
        if (isDev)
          console.log(
            "[MIDDLEWARE] Contest has ended - redirecting /contest → /contest-end"
          );
        const response = NextResponse.redirect(
          new URL("/contest-end", request.url)
        );
        response.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate"
        );
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        return response;
      }

      // If contest is not active, redirect to pre-contest
      if (!contestIsActive) {
        if (isDev)
          console.log(
            "[MIDDLEWARE] Contest inactive - redirecting /contest → /pre-contest"
          );
        return NextResponse.redirect(new URL("/pre-contest", request.url));
      }
    }

    if (pathname.startsWith("/pre-contest")) {
      // If contest has ended, redirect to contest-end
      if (contestHasEnded) {
        if (isDev)
          console.log(
            "[MIDDLEWARE] Contest has ended - redirecting /pre-contest → /contest-end"
          );
        const response = NextResponse.redirect(
          new URL("/contest-end", request.url)
        );
        response.headers.set(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate"
        );
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
        return response;
      }

      // If contest is active, redirect to contest
      if (contestIsActive) {
        if (isDev)
          console.log(
            "[MIDDLEWARE] Contest active - redirecting /pre-contest → /contest"
          );
        return NextResponse.redirect(new URL("/contest", request.url));
      }
    }

    if (isDev) console.log("[MIDDLEWARE] Contestant access granted");
  }

  // Redirect logged-in users away from login/register pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin", request.url));
    if (role === "evaluator")
      return NextResponse.redirect(new URL("/evaluator", request.url));

    // Redirect to appropriate contest page based on contest state
    if (contestHasEnded) {
      return NextResponse.redirect(new URL("/contest-end", request.url));
    } else if (contestIsActive) {
      return NextResponse.redirect(new URL("/contest", request.url));
    } else {
      return NextResponse.redirect(new URL("/pre-contest", request.url));
    }
  }

  if (user && pathname === "/admin/login") {
    if (role === "admin")
      return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (user && pathname === "/evaluator/login") {
    if (role === "evaluator" || role === "admin") {
      return NextResponse.redirect(new URL("/evaluator", request.url));
    }
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isDev) console.log(`[MIDDLEWARE] Access granted to path: ${pathname}`);
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
