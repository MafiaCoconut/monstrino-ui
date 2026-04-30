import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { revalidateSecret } from "@/shared/config/env";

/**
 * On-demand ISR revalidation endpoint.
 *
 * Call this from the backend after entity updates:
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *   { "type": "release", "id": "123" }
 *
 * Cache tags used:
 *   release-{id}   — single release detail page
 *   release-list   — releases listing page
 *   series-{id}, series-list
 *   character-{id}, character-list
 *   pet-{id}, pet-list
 */

type EntityType = "release" | "series" | "character" | "pet";

function buildTags(type: EntityType, id: string): string[] {
  return [`${type}-${id}`, `${type}-list`];
}

export async function POST(req: NextRequest) {
  const secret = revalidateSecret;
  const auth = req.headers.get("authorization");

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ revalidated: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      type?: string;
      id?: string;
      tag?: string;
    };

    // Direct tag revalidation (advanced use)
    if (body.tag) {
      revalidateTag(body.tag, "max");
      return NextResponse.json({ revalidated: true, tags: [body.tag] });
    }

    if (!body.type || !body.id) {
      return NextResponse.json(
        { revalidated: false, message: "Missing type or id" },
        { status: 400 },
      );
    }

    const validTypes: EntityType[] = ["release", "series", "character", "pet"];
    if (!validTypes.includes(body.type as EntityType)) {
      return NextResponse.json(
        { revalidated: false, message: `Unsupported type: ${body.type}` },
        { status: 400 },
      );
    }

    const tags = buildTags(body.type as EntityType, body.id);
    tags.forEach((tag) => revalidateTag(tag, "max"));

    return NextResponse.json({ revalidated: true, tags });
  } catch {
    return NextResponse.json({ revalidated: false, message: "Invalid payload" }, { status: 400 });
  }
}
