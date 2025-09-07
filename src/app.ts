import {fastify} from "fastify"
import { userRoutes } from "./modules/users/routes/user.routes"
import { tasksRoutes } from "./modules/users/routes/tasks.routes"
import { AuthFunction } from "./modules/users/routes/auth.routes"
import { FastifyCorsOptions } from "@fastify/cors"
import fastifyCors from "@fastify/cors"
export const app = fastify()

const corsOptions: FastifyCorsOptions = {
  origin: "*",
};

app.register(fastifyCors, corsOptions);
app.register(userRoutes);
app.register(tasksRoutes);
app.register(AuthFunction);