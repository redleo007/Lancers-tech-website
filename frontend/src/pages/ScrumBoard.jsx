import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useSocket } from "../context/SocketContext.jsx";
import PokerDeck from "../components/PokerDeck.jsx";
import PresenceList from "../components/PresenceList.jsx";
import ActivityFeed from "../components/ActivityFeed.jsx";

export default function ScrumBoard() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [session, setSession] = useState(null);
  const [storyIndex, setStoryIndex] = useState(0);
  const [vote, setVote] = useState(null);
  const [presence, setPresence] = useState([]);
  const [activity, setActivity] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!sessionId) return;
    api.get(`/sessions/${sessionId}`).then((r) => {
      setSession(r.data.session);
      setNotes(r.data.session.notes || "");
    });
  }, [sessionId]);

  useEffect(() => {
    if (!socket || !sessionId || !user) return;
    socket.emit("session:join", { sessionId, user });
    socket.on("session:presence", ({ users }) => setPresence(users));
    socket.on("activity:new", (a) => setActivity((p) => [a, ...p].slice(0, 30)));
    socket.on("notes:update", ({ content }) => setNotes(content));
    socket.on("session:reveal", () => {
      api.get(`/sessions/${sessionId}`).then((r) => setSession(r.data.session));
    });
    return () => {
      socket.off("session:presence");
      socket.off("activity:new");
      socket.off("notes:update");
      socket.off("session:reveal");
    };
  }, [socket, sessionId, user]);

  if (!sessionId) {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold mb-2">No session selected</h2>
        <p className="text-white/60 text-sm">
          Create or open an estimation session to start Planning Poker.
        </p>
      </div>
    );
  }

  if (!session) return <div className="text-white/60">Loading session…</div>;
  const story = session.stories[storyIndex];

  const castVote = async (value) => {
    setVote(value);
    await api.post(`/sessions/${sessionId}/vote`, { storyIndex, value });
  };

  const reveal = async () => {
    await api.post(`/sessions/${sessionId}/reveal`, { storyIndex });
  };

  const saveNotes = (content) => {
    setNotes(content);
    socket?.emit("notes:typing", { sessionId, content });
    api.put(`/sessions/${sessionId}/notes`, { notes: content });
  };

  const canReveal = ["Admin", "TeamLeader"].includes(user.role);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{session.title}</h1>
          <p className="text-white/60 text-sm">
            Story {storyIndex + 1} / {session.stories.length}
          </p>
        </div>
        <PresenceList users={presence} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          {story ? (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{story.title}</h2>
                  <p className="text-white/60 text-sm mt-1">{story.description}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  story.risk === "high" ? "bg-rose-500/20 text-rose-300" :
                  story.risk === "medium" ? "bg-amber-500/20 text-amber-300" :
                  "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {story.risk} risk
                </span>
              </div>

              <div className="mt-6">
                <div className="text-sm text-white/60 mb-3">Your estimate</div>
                <PokerDeck selected={vote} onSelect={castVote} disabled={story.revealed} />
              </div>

              {story.revealed ? (
                <div className="mt-6 glass-strong rounded-xl p-4">
                  <div className="font-semibold mb-2">
                    Final estimate: {story.finalPoints} pts
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {story.votes.map((v, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-white/10 text-xs">
                        {v.value} pts
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                canReveal && (
                  <button onClick={reveal} className="btn btn-primary mt-6">
                    Reveal votes
                  </button>
                )
              )}

              <div className="flex gap-2 mt-6">
                <button
                  className="btn btn-ghost"
                  disabled={storyIndex === 0}
                  onClick={() => { setStoryIndex((i) => i - 1); setVote(null); }}
                >← Prev</button>
                <button
                  className="btn btn-ghost"
                  disabled={storyIndex >= session.stories.length - 1}
                  onClick={() => { setStoryIndex((i) => i + 1); setVote(null); }}
                >Next →</button>
              </div>
            </>
          ) : (
            <div className="text-white/50">No stories in this session yet.</div>
          )}
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <div className="font-semibold mb-2">Shared notes</div>
            <textarea
              value={notes}
              onChange={(e) => saveNotes(e.target.value)}
              rows={6}
              className="input"
              placeholder="Write decisions, blockers, action items…"
            />
          </div>
          <ActivityFeed items={activity} />
        </div>
      </div>
    </div>
  );
}
