import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import { z } from "zod";
// Input validation schemas
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // Validate input
    const validatedData = signupSchema.parse(body);
    console.log(validatedData);
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: validatedData.password, // Note: In production, hash the password!
        name: validatedData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    console.log("user", user);
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      jwt: token,
      user,
    });
  } catch (error) {
    c.status(400);
    return c.json({
      error: error instanceof z.ZodError ? "Invalid input" : "Signup failed",
    });
  }
});

userRouter.post("/signin", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    // Validate input
    const validatedData = signinSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email,
        password: validatedData.password, // Note: In production, compare hashed passwords!
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "Invalid credentials" });
    }

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
      user,
    });
  } catch (error) {
    c.status(400);
    return c.json({
      error: error instanceof z.ZodError ? "Invalid input" : "Signin failed",
    });
  }
});
