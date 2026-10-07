import { useMemo, useState } from "react";
import {
  Bell, CalendarDays, CheckCircle2, ChevronDown, ChevronRight, CircleHelp,
  ClipboardList, Hash, LayoutGrid, MessageSquare, Plus, Search, Settings,
  ShieldCheck, Sparkles, Users, Zap, FolderKanban, PanelLeftClose
} from "lucide-react";

const servers = [
  { name: "PartCrew", mark: "P", active: true },
  { name: "Retail Empire", mark: "RE" },
  { name: "Sea Survivors", mark: "SS" },
  { name: "Downtown Games", mark: "DG" }
];

const channelGroups = [
  { name: "START HERE", channels: [
    ["welcome", Hash], ["announcements", Hash]
  ]},
  { name: "TEAM", channels: [
    ["general", MessageSquare], ["dev-chat", MessageSquare], ["showcase", Sparkles]
  ]},
  { name: "PROJECT MANAGEMENT", channels: [
    ["calendar", CalendarDays], ["planner", ClipboardList], ["beehive", LayoutGrid]
  ]},
  { name: "DEVELOPMENT", channels: [
    ["scripting", Hash], ["building", Hash], ["ui-design", Hash], ["qa-testing", Hash]
  ]}
];

const tasks = [
  { title: "Core gameplay loop", owner: "Jacob", status: "In Progress", color: "active" },
  { title: "Store placement system", owner: "Alex", status: "Testing", color: "testing" },
  { title: "UI foundation", owner: "Jacob", status: "In Progress", color: "active" },
  { title: "Roblox data integration", owner: "Mia", status: "Not Started", color: "idle" },
  { title: "Launch trailer", owner: "Noah", status: "Blocked", color: "blocked" },
  { title: "QA checklist", owner: "Sam", status: "Completed", color: "done" }
];

function App() {
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeServer, setActiveServer] = useState("PartCrew");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [query, setQuery] = useState("");

  const current = useMemo(() => {
    for (const group of channelGroups) {
      const found = group.channels.find(([name]) => name === activeChannel);
      if (found) return found;
    }
    return ["general", MessageSquare];
  }, [activeChannel]);

  const isSpecial = ["calendar", "planner", "beehive"].includes(activeChannel);

  return (
    <div className="app-shell">
      <aside className="server-rail">
        {servers.map((server) => (
          <button
            key={server.name}
            className={`server-button ${server.name === activeServer ? "selected" : ""}`}
            onClick={() => setActiveServer(server.name)}
            title={server.name}
          >
            {server.mark}
          </button>
        ))}
        <button className="server-button add-server" title="Create workspace"><Plus size={20}/></button>
        <div className="rail-spacer" />
        <button className="server-button" title="Help"><CircleHelp size={20}/></button>
        <button className="server-button" title="Settings"><Settings size={20}/></button>
      </aside>

      <aside className={`channel-sidebar ${mobileSidebar ? "mobile-open" : ""}`}>
        <div className="workspace-header">
          <div>
            <div className="eyebrow">WORKSPACE</div>
            <strong>{activeServer}</strong>
          </div>
          <ChevronDown size={18}/>
        </div>

        <div className="sidebar-search">
          <Search size={15}/>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search channels" />
        </div>

        <div className="channel-list">
          {channelGroups.map((group) => {
            const visible = group.channels.filter(([name]) => name.includes(query.toLowerCase()));
            if (!visible.length) return null;
            return (
              <section className="channel-group" key={group.name}>
                <div className="group-label"><span>{group.name}</span><Plus size={14}/></div>
                {visible.map(([name, Icon]) => (
                  <button
                    className={`channel-button ${activeChannel === name ? "active" : ""}`}
                    key={name}
                    onClick={() => { setActiveChannel(name); setMobileSidebar(false); }}
                  >
                    <Icon size={17}/>
                    <span>{name}</span>
                    {name === "beehive" && <span className="new-dot" />}
                  </button>
                ))}
              </section>
            );
          })}
        </div>

        <div className="profile-card">
          <div className="avatar">JK</div>
          <div className="profile-copy">
            <strong>Jacob</strong>
            <span>Owner</span>
          </div>
          <button><Settings size={16}/></button>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="channel-title">
            <button className="mobile-menu" onClick={() => setMobileSidebar(!mobileSidebar)}><PanelLeftClose size={18}/></button>
            <current[1] size={19}/>
            <strong>{activeChannel}</strong>
            <span className="divider" />
            <span className="topic">{isSpecial ? "Project workspace" : "Build together. Ship better."}</span>
          </div>
          <div className="top-actions">
            <button title="Notifications"><Bell size={18}/></button>
            <button title="Members"><Users size={18}/></button>
            <div className="top-search"><Search size={15}/><input placeholder="Search PartCrew" /></div>
          </div>
        </header>

        <div className="content">
          {activeChannel === "beehive" ? <Beehive /> :
           activeChannel === "calendar" ? <Calendar /> :
           activeChannel === "planner" ? <Planner /> :
           <Chat channel={activeChannel} />}
        </div>
      </main>

      <aside className="member-panel">
        <div className="member-heading">TEAM — 6</div>
        <Member name="Jacob" role="Owner" initials="JK" online />
        <Member name="Alex" role="Lead Developer" initials="AX" online />
        <Member name="Mia" role="UI Designer" initials="MI" online />
        <Member name="Noah" role="Builder" initials="NO" />
        <Member name="Sam" role="QA Tester" initials="SA" />
        <Member name="Taylor" role="Animator" initials="TA" />
      </aside>
    </div>
  );
}

function Member({ name, role, initials, online }) {
  return <div className="member">
    <div className="avatar small">{initials}<span className={`presence ${online ? "online" : ""}`} /></div>
    <div><strong>{name}</strong><span>{role}</span></div>
  </div>;
}

function Chat({ channel }) {
  const messages = [
    { name: "Jacob", time: "6:42 PM", initials: "JK", text: "Welcome to PartCrew. This is the central workspace for our development team." },
    { name: "Alex", time: "6:45 PM", initials: "AX", text: "I’m starting on the core project structure. We should keep the Beehive updated as features move through testing." },
    { name: "Mia", time: "6:48 PM", initials: "MI", text: "UI foundation is ready for the first pass. I’ll post the component list in #ui-design." }
  ];
  return <div className="chat-view">
    <div className="chat-intro">
      <div className="intro-icon"><Hash size={28}/></div>
      <h1>Welcome to #{channel}</h1>
      <p>This is the beginning of the <strong>#{channel}</strong> channel.</p>
    </div>
    <div className="messages">
      {messages.map((m) => <div className="message" key={m.time}>
        <div className="avatar">{m.initials}</div>
        <div className="message-body"><div><strong>{m.name}</strong><span>{m.time}</span></div><p>{m.text}</p></div>
      </div>)}
    </div>
    <div className="composer">
      <Plus size={19}/><input placeholder={`Message #${channel}`} /><Sparkles size={18}/>
    </div>
  </div>;
}

function Beehive() {
  return <div className="management-view">
    <div className="view-heading">
      <div><span className="kicker">PROJECT MAP</span><h1>Beehive</h1><p>A visual map of everything being built, tested, and shipped.</p></div>
      <button className="primary"><Plus size={16}/> Add task</button>
    </div>
    <div className="legend">
      <span><i className="dot idle"/> Not Started</span><span><i className="dot active"/> In Progress</span><span><i className="dot testing"/> Testing</span><span><i className="dot blocked"/> Blocked</span><span><i className="dot done"/> Completed</span>
    </div>
    <div className="honeycomb">
      {tasks.map((task, i) => <div className={`hex-card ${task.color}`} key={task.title} style={{transform: `translateY(${(i % 2) * 34}px)`}}>
        <div className="hex-top"><span className="task-number">0{i + 1}</span><CheckCircle2 size={16}/></div>
        <h3>{task.title}</h3>
        <span>{task.owner}</span>
        <small>{task.status}</small>
      </div>)}
    </div>
  </div>;
}

function Calendar() {
  const days = ["Mon 12", "Tue 13", "Wed 14", "Thu 15", "Fri 16", "Sat 17", "Sun 18"];
  return <div className="management-view">
    <div className="view-heading"><div><span className="kicker">TEAM SCHEDULE</span><h1>Calendar</h1><p>Plan meetings, milestones, playtests, and releases.</p></div><button className="primary"><Plus size={16}/> Event</button></div>
    <div className="calendar-card">
      <div className="calendar-head">{days.map(d => <div key={d}>{d}</div>)}</div>
      <div className="calendar-grid">{days.map((d, i) => <div className="day-column" key={d}>
        <div className="day-number">{i + 12}</div>
        {i === 1 && <Event label="UI review" tone="purple"/>}
        {i === 2 && <Event label="Playtest" tone="blue"/>}
        {i === 4 && <Event label="Build deadline" tone="green"/>}
      </div>)}</div>
    </div>
  </div>;
}

function Event({label, tone}) { return <div className={`event ${tone}`}><strong>{label}</strong><span>3:00 PM</span></div>; }

function Planner() {
  const columns = [["Backlog", ["Inventory system", "Role permissions"]], ["In Progress", ["Workspace UI", "Roblox integration"]], ["Review", ["Mobile layout"]], ["Done", ["Project setup"]]];
  return <div className="management-view">
    <div className="view-heading"><div><span className="kicker">TASK BOARD</span><h1>Planner</h1><p>Move work from an idea to shipped.</p></div><button className="primary"><Plus size={16}/> New task</button></div>
    <div className="kanban">{columns.map(([title, items]) => <div className="kanban-column" key={title}><div className="column-title"><strong>{title}</strong><span>{items.length}</span></div>{items.map(item => <div className="task-card" key={item}><span>{item}</span><div><div className="mini-avatar">JK</div><ChevronRight size={14}/></div></div>)}</div>)}</div>
  </div>;
}

export default App;
