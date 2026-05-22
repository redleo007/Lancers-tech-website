// Socket.io handlers — presence, kanban, notes, activity feed.

const sessionPresence = new Map(); // sessionId -> Map<socketId, user>

export function registerSocketHandlers(io) {
  io.on("connection", (socket) => {
    socket.on("session:join", ({ sessionId, user }) => {
      if (!sessionId || !user) return;
      socket.join(`session:${sessionId}`);
      socket.data.sessionId = sessionId;
      socket.data.user = user;

      const presence = sessionPresence.get(sessionId) || new Map();
      presence.set(socket.id, user);
      sessionPresence.set(sessionId, presence);

      io.to(`session:${sessionId}`).emit("session:presence", {
        users: Array.from(presence.values()),
      });
      io.to(`session:${sessionId}`).emit("activity:new", {
        message: `${user.name} joined the session`,
        user,
        at: new Date().toISOString(),
      });
    });

    socket.on("project:join", ({ projectId }) => {
      if (projectId) socket.join(`project:${projectId}`);
    });

    socket.on("notes:typing", ({ sessionId, content }) => {
      socket.to(`session:${sessionId}`).emit("notes:update", { sessionId, content });
    });

    socket.on("kanban:move", ({ projectId, kanban }) => {
      socket.to(`project:${projectId}`).emit("kanban:update", { projectId, kanban });
    });

    socket.on("disconnect", () => {
      const { sessionId, user } = socket.data || {};
      if (sessionId) {
        const presence = sessionPresence.get(sessionId);
        if (presence) {
          presence.delete(socket.id);
          io.to(`session:${sessionId}`).emit("session:presence", {
            users: Array.from(presence.values()),
          });
          if (user) {
            io.to(`session:${sessionId}`).emit("activity:new", {
              message: `${user.name} left the session`,
              user,
              at: new Date().toISOString(),
            });
          }
        }
      }
    });
  });
}
