import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
import { cookies } from "next/headers";

import db from "./db";

const adapter = new BetterSqlite3Adapter(db, {
  user: "users",
  session: "sessions",
});

const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export async function createAuthSession(id: string) {
  const session = await lucia.createSession(id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function verifyAuth() {
  const cookie = cookies().get(lucia.sessionCookieName);

  if (!cookie) {
    return {
      user: null,
      session: null,
    };
  }

  const id = cookie.value;
  if (!id) {
    return {
      user: null,
      session: null,
    };
  }

  const res = await lucia.validateSession(id);

  try {
    //next will create an error and we wanna ignore it.
    if (res.session && res.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(res.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
    //if session is not truthy we have to clear the cookie!
    if (!res.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }
  } catch {}

  return res;
}

export async function deleteSession() {
  const res = await verifyAuth();
  if (!res.session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(res.session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
