import { useMemo, useState } from "react";
import {
  Bell, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  ClipboardList, Hash, LayoutGrid, MessageSquare, Plus, Search, Settings,
  Sparkles, Users, PanelLeftClose, Send, Trash2, X
} from "lucide-react";

const defaultServers = [
  { name: "PartCrew", mark: "P", active: true },
  { name: "Retail Empire", mark: "RE" },
  { name: "Sea Survivors", mark: "SS" },
  { name: "Downtown Games", mark: "DG" }
];

const channelGroups = [
  { name: "START HERE", channels: [["welcome", Hash], ["announcements", Hash]] },
  { name: "TEAM", channels: [["general", MessageSquare], ["dev-chat", MessageSquare], ["showcase", Sparkles]] },
  { name: "PROJECT MANAGEMENT", channels: [["calendar", CalendarDays], ["planner", ClipboardList], ["beehive", LayoutGrid]] },
  { name: "DEVELOPMENT", channels: [["scripting", Hash], ["building", Hash], ["ui-design", Hash], ["qa-testing", Hash]] }
];

const starterMessages = [
  { id: 1, name: "Jacob", time: "6:42 PM", initials: "JK", text: "Welcome to PartCrew. This is the central workspace for our development team." },
  { id: 2, name: "Alex", time: "6:45 PM", initials: "AX", text: "I’m starting on the core project structure. We should keep the Beehive updated as features move through testing." },
  { id: 3, name: "Mia", time: "6:48 PM", initials: "MI", text: "UI foundation is ready for the first pass. I’ll post the component list in #ui-design." }
];

const starterTasks = [
  { id: 1, title: "Core gameplay loop", owner: "Jacob", status: "In Progress" },
  { id: 2, title: "Store placement system", owner: "Alex", status: "Testing" },
  { id: 3, title: "UI foundation", owner: "Jacob", status: "In Progress" },
  { id: 4, title: "Roblox data integration", owner: "Mia", status: "Not Started" },
  { id: 5, title: "Launch trailer", owner: "Noah", status: "Blocked" },
  { id: 6, title: "QA checklist", owner: "Sam", status: "Completed" }
];

const roles = ["Owner", "Co-Owner", "Project Manager", "Lead Developer", "Programmer", "Builder", "UI Designer", "3D Modeler", "Animator", "VFX Artist", "GFX Artist", "Sound Designer", "QA Tester"];

function load(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
function statusClass(status) {
  return ({ "In Progress": "active", Testing: "testing", Blocked: "blocked", Completed: "done", "Not Started": "idle" })[status] || "idle";
}

function App() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeServer, setActiveServer] = useState("PartCrew");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState(() => load("partcrew-messages", starterMessages));
  const [tasks, setTasks] = useState(() => load("partcrew-tasks", starterTasks));
  const [composer, setComposer] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [toast, setToast] = useState("");

  const current = useMemo(() => {
    for (const group of channelGroups) {
      const found = group.channels.find(([name]) => name === activeChannel);
      if (found) return found;
    }
    return ["general", MessageSquare];
  }, [activeChannel]);

  const sendMessage = () => {
    const text = composer.trim();
    if (!text) return;
    const next = [...messages, { id: Date.now(), name: "Jacob", time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }), initials: "JK", text, channel: activeChannel }];
    setMessages(next);
    save("partcrew-messages", next);
    setComposer("");
  };

  const addTask = (task) => {
    const next = [...tasks, { ...task, id: Date.now() }];
    setTasks(next);
    save("partcrew-tasks", next);
    setShowNewTask(false);
    flash("Task added to the Beehive");
  };

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className="app-shell">
      <aside className="server-rail">
        {defaultServers.map((server) => (
          <button key={server.name} className={`server-button ${server.name === activeServer ? "selected" : ""}`} onClick={() => { setActiveServer(server.name); flash(`${server.name} workspace selected`); }} title={server.name}>{server.mark}</button>
        ))}
        <button className="server-button add-server" title="Create workspace" onClick={() => flash("Workspace creation is ready for the next backend step")}><Plus size={20}/></button>
        <div className="rail-spacer" />
        <button className="server-button" title="Help"><CircleHelp size={20}/></button>
        <button className="server-button" title="Settings"><Settings size={20}/></button>
      </aside>

      <aside className={`channel-sidebar ${mobileSidebar ? "mobile-open" : ""}`}>
        <div className="workspace-header">
          <div><div className="eyebrow">WORKSPACE</div><strong>{activeServer}</strong></div>
          <ChevronDown size={18}/>
        </div>
        <div className="sidebar-search"><Search size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search channels" /></div>
        <div className="channel-list">
          {channelGroups.map((group) => {
            const visible = group.channels.filter(([name]) => name.includes(query.toLowerCase()));
            if (!visible.length) return null;
            return <section className="channel-group" key={group.name}>
              <div className="group-label"><span>{group.name}</span><Plus size={14}/></div>
              {visible.map(([name, Icon]) => <button className={`channel-button ${activeChannel === name ? "active" : ""}`} key={name} onClick={() => { setActiveChannel(name); setMobileSidebar(false); }}>
                <Icon size={17}/><span>{name}</span>{name === "beehive" && <span className="new-dot" />}
              </button>)}
            </section>;
          })}
        </div>
        <div className="profile-card">
          <div className="avatar">JK</div><div className="profile-copy"><strong>Jacob</strong><span>Owner</span></div><button><Settings size={16}/></button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="channel-title">
            <button className="mobile-menu" onClick={() => setMobileSidebar(!mobileSidebar)}><PanelLeftClose size={18}/></button>
            <current[1] size={19}/><strong>{activeChannel}</strong><span className="divider" /><span className="topic">{["calendar","planner","beehive"].includes(activeChannel) ? "Project workspace" : "Build together. Ship better."}</span>
          </div>
          <div className="top-actions"><button title="Notifications"><Bell size={18}/></button><button title="Members"><Users size={18}/></button><div className="top-search"><Search size={15}/><input placeholder="Search PartCrew" /></div></div>
        </header>
        <div className="content">
          {activeChannel === "beehive" ? <Beehive tasks={tasks} onAdd={() => setShowNewTask(true)} /> :
           activeChannel === "calendar" ? <Calendar onAdd={() => setShowEvent(true)} /> :
           activeChannel === "planner" ? <Planner tasks={tasks} onAdd={() => setShowNewTask(true)} /> :
           <Chat channel={activeChannel} messages={messages} composer={composer} setComposer={setComposer} sendMessage={sendMessage} />}
        </div>
      </main>

      <aside className="member-panel">
        <div className="member-heading">TEAM — 6</div>
        <Member name="Jacob" role="Owner" initials="JK" online /><Member name="Alex" role="Lead Developer" initials="AX" online />
        <Member name="Mia" role="UI Designer" initials="MI" online /><Member name="Noah" role="Builder" initials="NO" />
        <Member name="Sam" role="QA Tester" initials="SA" /><Member name="Taylor" role="Animator" initials="TA" />
      </aside>

      {showNewTask && <TaskModal onClose={() => setShowNewTask(false)} onSave={addTask} />}
      {showEvent && <EventModal onClose={() => setShowEvent(false)} onSave={(event) => { setShowEvent(false); flash(`Event “${event.title}” created`); }} />}
      {toast && <div className="toast"><CheckCircle2 size={16}/>{toast}</div>}
    </div>
  );
}

function Member({ name, role, initials, online }) {
  return <div className="member"><div className="avatar small">{initials}<span className={`presence ${online ? "online" : ""}`} /></div><div><strong>{name}</strong><span>{role}</span></div></div>;
}

function Chat({ channel, messages, composer, setComposer, sendMessage }) {
  const visible = messages.filter((m) => !m.channel || m.channel === channel);
  return <div className="chat-view">
    <div className="chat-intro"><div className="intro-icon"><Hash size={28}/></div><h1>Welcome to #{channel}</h1><p>This is the beginning of the <strong>#{channel}</strong> channel.</p></div>
    <div className="messages">{visible.map((m) => <div className="message" key={m.id}><div className="avatar">{m.initials}</div><div className="message-body"><div><strong>{m.name}</strong><span>{m.time}</span></div><p>{m.text}</p></div></div>)}</div>
    <div className="composer"><button onClick={() => setComposer(composer + " ")}><Plus size={19}/></button><input value={composer} onChange={(e) => setComposer(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} placeholder={`Message #${channel}`} /><button onClick={sendMessage}><Send size={17}/></button></div>
  </div>;
}

function Beehive({ tasks, onAdd }) {
  return <div className="management-view">
    <div className="view-heading"><div><span className="kicker">PROJECT MAP</span><h1>Beehive</h1><p>A visual map of everything being built, tested, and shipped.</p></div><button className="primary" onClick={onAdd}><Plus size={16}/> Add task</button></div>
    <div className="legend"><span><i className="dot idle"/> Not Started</span><span><i className="dot active"/> In Progress</span><span><i className="dot testing"/> Testing</span><span><i className="dot blocked"/> Blocked</span><span><i className="dot done"/> Completed</span></div>
    <div className="honeycomb">{tasks.map((task, i) => <div className={`hex-card ${statusClass(task.status)}`} key={task.id} style={{transform: `translateY(${(i % 2) * 34}px)`}}>
      <div className="hex-top"><span className="task-number">{String(i + 1).padStart(2,"0")}</span><CheckCircle2 size={16}/></div><h3>{task.title}</h3><span>{task.owner}</span><small>{task.status}</small>
    </div>)}</div>
  </div>;
}

function Calendar({ onAdd }) {
  const days = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];
  return <div className="management-view"><div className="view-heading"><div><span className="kicker">TEAM SCHEDULE</span><h1>Calendar</h1><p>Plan meetings, milestones, playtests, and releases.</p></div><button className="primary" onClick={onAdd}><Plus size={16}/> Event</button></div>
    <div className="calendar-card"><div className="calendar-head">{days.map(d => <div key={d}>{d}</div>)}</div><div className="calendar-grid">{days.map((d, i) => <div className="day-column" key={d}><div className="day-number">{i + 12}</div>{i === 1 && <Event label="UI review" tone="purple"/>}{i === 2 && <Event label="Playtest" tone="blue"/>}{i === 4 && <Event label="Build deadline" tone="green"/>}</div>)}</div></div>
  </div>;
}
function Event({label, tone}) { return <div className={`event ${tone}`}><strong>{label}</strong><span>3:00 PM</span></div>; }

function Planner({ tasks, onAdd }) {
  const columns = ["Not Started", "In Progress", "Testing", "Completed"];
  return <div className="management-view"><div className="view-heading"><div><span className="kicker">TASK BOARD</span><h1>Planner</h1><p>Move work from an idea to shipped.</p></div><button className="primary" onClick={onAdd}><Plus size={16}/> New task</button></div>
    <div className="kanban">{columns.map(title => { const items = tasks.filter(t => t.status === title); return <div className="kanban-column" key={title}><div className="column-title"><strong>{title}</strong><span>{items.length}</span></div>{items.map(item => <div className="task-card" key={item.id}><span>{item.title}</span><div><div className="mini-avatar">{item.owner.slice(0,2).toUpperCase()}</div><ChevronRight size={14}/></div></div>)}</div>; })}</div>
  </div>;
}

function TaskModal({ onClose, onSave }) {
  const [title, setTitle] = useState(""); const [owner, setOwner] = useState("Jacob"); const [status, setStatus] = useState("Not Started");
  return <Modal title="Create task" onClose={onClose}><label>Task name<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Inventory system" /></label><label>Owner<select value={owner} onChange={e=>setOwner(e.target.value)}>{["Jacob","Alex","Mia","Noah","Sam","Taylor"].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}>{["Not Started","In Progress","Testing","Blocked","Completed"].map(x=><option key={x}>{x}</option>)}</select></label><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={!title.trim()} onClick={()=>onSave({title:title.trim(),owner,status})}>Create task</button></div></Modal>;
}

function EventModal({ onClose, onSave }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState(""); const [time, setTime] = useState("15:00");
  return <Modal title="Create calendar event" onClose={onClose}><label>Event name<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Team playtest" /></label><div className="form-row"><label>Date<input type="date" value={date} onChange={e=>setDate(e.target.value)} /></label><label>Time<input type="time" value={time} onChange={e=>setTime(e.target.value)} /></label></div><div className="modal-actions"><button className="secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={!title.trim()} onClick={()=>onSave({title,date,time})}>Create event</button></div></Modal>;
}

function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-header"><h2>{title}</h2><button onClick={onClose}><X size={18}/></button></div>{children}</div></div>; }

export default App;
