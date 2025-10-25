import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
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

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/admin/login",
    "/evaluator/login",
    "/register",
  ];
  if (publicRoutes.includes(pathname)) {
    return supabaseResponse;
  }

  // Require authentication for protected routes
  if (!user) {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (pathname.startsWith("/evaluator")) {
      return NextResponse.redirect(new URL("/evaluator/login", request.url));
    }
    if (
      pathname.startsWith("/contest") ||
      pathname.startsWith("/pre-contest")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // Get user role
  const { data: userRole } = await supabase
    .from("user_roles")
    .select("role")
    .eq("email", user.email!)
    .single();

  const role = userRole?.role || "contestant";

  // Role-based route protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    pathname.startsWith("/evaluator") &&
    role !== "evaluator" &&
    role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/contest") && role !== "contestant") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Redirect logged-in users away from login pages
  if (user && (pathname === "/login" || pathname === "/register")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "evaluator") {
      return NextResponse.redirect(new URL("/evaluator", request.url));
    }
    return NextResponse.redirect(new URL("/pre-contest", request.url));
  }

  if (
    user &&
    (pathname === "/admin/login" || pathname === "/evaluator/login")
  ) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (role === "evaluator") {
      return NextResponse.redirect(new URL("/evaluator", request.url));
    }
    return NextResponse.redirect(new URL("/pre-contest", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
