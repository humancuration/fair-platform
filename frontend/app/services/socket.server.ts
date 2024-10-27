import { Server } from "socket.io";
import type { AIResearchTool } from "~/types/science";

export function setupResearchSockets(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-research-session", (sessionId: string) => {
      socket.join(`research:${sessionId}`);
    });

    socket.on("research-update", (data: {
      sessionId: string;
      update: any;
    }) => {
      socket.to(`research:${data.sessionId}`).emit("research-updated", data.update);
    });

    // Handle other events...
  });
}
