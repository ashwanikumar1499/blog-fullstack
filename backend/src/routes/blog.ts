import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import { z } from "zod";

// Blog interface as you specified
export interface Blog {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// Input validation schema for blog creation
const createBlogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// Middleware to verify JWT
blogRouter.use("/*", async (c, next) => {
  const header = c.req.header("authorization") || "";
  try {
    const token = header.split(" ")[1];
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set("userId", payload.id as string);
    await next();
  } catch (error) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
});

// Create a blog post
blogRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const body = await c.req.json();

  try {
    // Validate input
    const validatedData = createBlogSchema.parse(body);

    const blog = await prisma.blog.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return c.json({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: {
        id: blog.author.id,
        name: blog.author.name,
      },
      createdAt: blog.createdAt.toISOString(),
    });
  } catch (error) {
    c.status(400);
    return c.json({
      error:
        error instanceof z.ZodError ? "Invalid input" : "Blog creation failed",
    });
  }
});

// Get all blogs (with pagination)
blogRouter.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const page = Number(c.req.query("page") || 1);
    const limit = Number(c.req.query("limit") || 10);

    const blogs = await prisma.blog.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json(
      blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author: {
          id: blog.author.id,
          name: blog.author.name,
        },
        createdAt: blog.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    c.status(500);
    return c.json({ error: "Failed to fetch blogs" });
  }
});

// Get a specific blog by ID
blogRouter.get("/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const id = c.req.param("id");

  try {
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!blog) {
      c.status(404);
      return c.json({ error: "Blog not found" });
    }

    return c.json({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: {
        id: blog.author.id,
        name: blog.author.name,
      },
      createdAt: blog.createdAt.toISOString(),
    });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Failed to fetch blog" });
  }
});
