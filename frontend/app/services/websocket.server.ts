import { Server as HTTPServer } from "http";
import { Server as SocketServer } from "socket.io";
import type { Socket } from "socket.io";
import { db } from "~/utils/db.server";

let io: SocketServer | null = null;

export function initializeWebSockets(httpServer: HTTPServer) {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", handleConnection);
  return io;
}

async function handleConnection(socket: Socket) {
  // Authenticate socket connection
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.disconnect();
    return;
  }

  const user = await db.user.findUnique({
    where: { sessionToken: token }
  });

  if (!user) {
    socket.disconnect();
    return;
  }

  // Join user-specific room
  socket.join(`user:${user.id}`);

  // Handle research collaboration
  socket.on("join-research", async (projectId: string) => {
    const project = await db.researchProject.findUnique({
      where: { id: projectId },
      include: { team: true }
    });

    if (project?.team.some(member => member.id === user.id)) {
      socket.join(`research:${projectId}`);
      socket.emit("research-joined", { projectId });
      socket.to(`research:${projectId}`).emit("member-joined", { 
        userId: user.id,
        name: user.name
      });
    }
  });

  // Handle compute job updates
  socket.on("monitor-compute", async (jobId: string) => {
    const job = await db.computeJob.findUnique({
      where: { id: jobId },
      include: { owner: true }
    });

    if (job?.owner.id === user.id) {
      socket.join(`compute:${jobId}`);
      socket.emit("compute-monitoring-started", { jobId });
    }
  });

  // Cleanup on disconnect
  socket.on("disconnect", () => {
    socket.rooms.forEach(room => {
      if (room.startsWith("research:")) {
        socket.to(room).emit("member-left", { 
          userId: user.id,
          name: user.name
        });
      }
    });
  });
}

export function emitToUser(userId: string, event: string, data: any) {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
}

export function emitToProject(projectId: string, event: string, data: any) {
  if (!io) return;
  io.to(`research:${projectId}`).emit(event, data);
}

export function emitComputeUpdate(jobId: string, update: any) {
  if (!io) return;
  io.to(`compute:${jobId}`).emit("compute-update", update);
}
