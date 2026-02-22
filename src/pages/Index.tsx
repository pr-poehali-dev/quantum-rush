import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const ADMIN_USERNAME = "@Rgdakk";

const channels = [
  { id: "general", name: "общий", type: "text" },
  { id: "news", name: "новости", type: "text" },
  { id: "media", name: "медиа", type: "text" },
  { id: "admin", name: "связь-с-админом", type: "text" },
];

const voiceChannels = [
  { id: "vc1", name: "Голосовой чат" },
  { id: "vc2", name: "Стримы" },
];

const stories = [
  { id: 1, name: "Алина", color: "#5865f2", letter: "А", seen: false },
  { id: 2, name: "Марк", color: "#57f287", letter: "М", seen: false },
  { id: 3, name: "Соня", color: "#faa61a", letter: "С", seen: true },
  { id: 4, name: "Иван", color: "#ed4245", letter: "И", seen: false },
  { id: 5, name: "RAG", color: "#5865f2", letter: "R", seen: true },
];

const mockMessages: Record<string, { id: number; author: string; text: string; time: string; color: string; letter: string; isAdmin?: boolean }[]> = {
  general: [
    { id: 1, author: "Алина", text: "Привет всем! 👋 Рада быть здесь", time: "09:12", color: "#5865f2", letter: "А" },
    { id: 2, author: "Марк", text: "Всем привет! RAG — крутой мессенджер", time: "09:15", color: "#57f287", letter: "М" },
    { id: 3, author: "RAG Bot", text: "Добро пожаловать в RAG — ваш новый мессенджер! 🚀", time: "09:20", color: "#faa61a", letter: "R", isAdmin: true },
    { id: 4, author: "Соня", text: "Уже загрузила первое голосовое и видео, всё работает!", time: "09:22", color: "#ed4245", letter: "С" },
  ],
  news: [
    { id: 1, author: "RAG Bot", text: "📢 Обновление 1.0 — истории, звонки, каналы уже доступны!", time: "10:00", color: "#faa61a", letter: "R", isAdmin: true },
    { id: 2, author: "RAG Bot", text: "🎉 Более 1000 пользователей зарегистрировалось за первые сутки!", time: "10:05", color: "#faa61a", letter: "R", isAdmin: true },
  ],
  media: [
    { id: 1, author: "Иван", text: "Прикрепил видео с обзором интерфейса RAG 📹", time: "11:00", color: "#5865f2", letter: "И" },
    { id: 2, author: "Алина", text: "Вот моя история с первым звонком! 🎤", time: "11:10", color: "#5865f2", letter: "А" },
  ],
  admin: [
    { id: 1, author: "RAG Bot", text: `Здесь можно написать администратору ${ADMIN_USERNAME}. Мы ответим в течение часа!`, time: "08:00", color: "#faa61a", letter: "R", isAdmin: true },
  ],
};

const features = [
  { icon: "MessageCircle", title: "Личные сообщения", desc: "Пишите напрямую любому пользователю" },
  { icon: "Phone", title: "Голосовые звонки", desc: "Звонки один на один и групповые" },
  { icon: "Video", title: "Видеозвонки", desc: "HD-видео без ограничений" },
  { icon: "Hash", title: "Каналы", desc: "Создавайте каналы и публикуйте посты" },
  { icon: "Image", title: "Истории", desc: "Делитесь моментами с друзьями" },
  { icon: "Paperclip", title: "Файлы и медиа", desc: "Видео, аудио, документы — всё в одном" },
  { icon: "Search", title: "Поиск", desc: "Ищите людей, каналы и сообщения" },
  { icon: "Shield", title: "Безопасность", desc: "End-to-end шифрование всех чатов" },
];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState("general");
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authTab, setAuthTab] = useState<"phone" | "email">("phone");
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [activeAccount, setActiveAccount] = useState(0);
  const [inCall, setInCall] = useState(false);

  const accounts = [
    { name: "Алексей", tag: "@alex_rag", color: "#5865f2", letter: "А" },
    { name: "Work", tag: "@alex_work", color: "#57f287", letter: "W" },
  ];

  const currentChannel = channels.find((c) => c.id === activeChannel);
  const messages = mockMessages[activeChannel] || [];

  return (
    <div className="min-h-screen bg-[#36393f] text-white overflow-x-hidden">
      {/* NAV */}
      <nav className="bg-[#2f3136] border-b border-[#202225] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5865f2] rounded-xl flex items-center justify-center font-bold text-lg">R</div>
            <div>
              <h1 className="text-lg font-black text-white tracking-wider">RAG</h1>
              <p className="text-xs text-[#b9bbbe] hidden sm:block">Мессенджер нового поколения</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] text-sm" onClick={() => { setShowAuth(true); setAuthMode("login"); }}>
              Войти
            </Button>
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-5 py-2 rounded-lg text-sm font-semibold" onClick={() => { setShowAuth(true); setAuthMode("register"); }}>
              Регистрация
            </Button>
          </div>
          <Button variant="ghost" className="sm:hidden text-[#b9bbbe] hover:text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>
        {mobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-[#202225] flex flex-col gap-2">
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white justify-start" onClick={() => { setShowAuth(true); setAuthMode("login"); setMobileMenuOpen(false); }}>Войти</Button>
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white" onClick={() => { setShowAuth(true); setAuthMode("register"); setMobileMenuOpen(false); }}>Регистрация</Button>
          </div>
        )}
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex" style={{ minHeight: "calc(100vh - 57px)" }}>
        {/* SERVERS SIDEBAR */}
        <div className="hidden lg:flex w-[72px] bg-[#202225] flex-col items-center py-3 gap-2">
          <div className="w-12 h-12 bg-[#5865f2] rounded-2xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer font-black text-lg">R</div>
          <div className="w-8 h-[2px] bg-[#36393f] rounded-full my-1"></div>
          {["💬", "📢", "🎵", "⭐"].map((emoji, i) => (
            <div key={i} className="w-12 h-12 bg-[#36393f] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#5865f2] text-xl">
              {emoji}
            </div>
          ))}
          <div className="mt-auto mb-2">
            <div className="w-12 h-12 bg-[#36393f] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#5865f2]" onClick={() => setShowCreateChannel(true)}>
              <Icon name="Plus" size={20} className="text-[#57f287]" />
            </div>
          </div>
        </div>

        {/* CHANNELS SIDEBAR */}
        <div className={`${mobileSidebarOpen ? "fixed inset-0 z-30" : "hidden"} lg:relative lg:flex w-full lg:w-60 bg-[#2f3136] flex-col`}>
          {mobileSidebarOpen && <div className="lg:hidden absolute inset-0 bg-black/50 -z-10" onClick={() => setMobileSidebarOpen(false)} />}
          <div className="w-full lg:w-60 bg-[#2f3136] flex flex-col h-full">
            <div className="p-4 border-b border-[#202225] flex items-center justify-between">
              <h2 className="text-white font-bold text-base">RAG Messenger</h2>
              <Button variant="ghost" className="lg:hidden text-[#b9bbbe] p-1" onClick={() => setMobileSidebarOpen(false)}>
                <Icon name="X" size={16} />
              </Button>
            </div>

            {/* STORIES */}
            <div className="px-3 pt-3 pb-2">
              <p className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide mb-2">Истории</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {stories.map((s) => (
                  <div key={s.id} className="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0" onClick={() => setActiveStory(s.id)}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 ${s.seen ? "border-[#40444b]" : "border-[#5865f2]"}`} style={{ backgroundColor: s.color }}>
                      {s.letter}
                    </div>
                    <span className="text-[#8e9297] text-[10px] truncate w-10 text-center">{s.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
              {/* TEXT CHANNELS */}
              <div className="mb-3">
                <div className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronDown" size={12} />
                  <span>Текстовые каналы</span>
                </div>
                {channels.map((ch) => (
                  <div key={ch.id} onClick={() => { setActiveChannel(ch.id); setMobileSidebarOpen(false); }}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm transition-colors ${activeChannel === ch.id ? "bg-[#393c43] text-white" : "text-[#8e9297] hover:text-[#dcddde] hover:bg-[#393c43]"}`}>
                    <Icon name="Hash" size={15} />
                    <span>{ch.name}</span>
                    {ch.id === "admin" && <span className="ml-auto text-[10px] bg-[#5865f2] text-white px-1.5 py-0.5 rounded-full">ADM</span>}
                  </div>
                ))}
              </div>
              {/* VOICE CHANNELS */}
              <div>
                <div className="flex items-center gap-1 px-2 py-1 text-[#8e9297] text-xs font-semibold uppercase tracking-wide">
                  <Icon name="ChevronDown" size={12} />
                  <span>Голосовые каналы</span>
                </div>
                {voiceChannels.map((ch) => (
                  <div key={ch.id} onClick={() => setInCall(true)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded cursor-pointer text-sm text-[#8e9297] hover:text-[#dcddde] hover:bg-[#393c43] transition-colors">
                    <Icon name="Mic" size={15} />
                    <span>{ch.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* USER PANEL */}
            <div className="p-2 bg-[#292b2f] border-t border-[#202225]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: accounts[activeAccount].color }}>
                  {accounts[activeAccount].letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{accounts[activeAccount].name}</div>
                  <div className="text-[#b9bbbe] text-xs truncate">{accounts[activeAccount].tag}</div>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#40444b] transition-colors" onClick={() => setActiveAccount(activeAccount === 0 ? 1 : 0)} title="Переключить аккаунт">
                    <Icon name="RefreshCw" size={14} className="text-[#b9bbbe]" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#40444b] transition-colors" onClick={() => setShowSettings(true)}>
                    <Icon name="Settings" size={14} className="text-[#b9bbbe]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* CHAT HEADER */}
          <div className="h-12 bg-[#36393f] border-b border-[#202225] flex items-center px-4 gap-2 flex-shrink-0">
            <button className="lg:hidden text-[#8e9297] hover:text-[#dcddde] p-1 mr-1" onClick={() => setMobileSidebarOpen(true)}>
              <Icon name="Menu" size={20} />
            </button>
            <Icon name="Hash" size={18} className="text-[#8e9297]" />
            <span className="text-white font-semibold text-sm">{currentChannel?.name}</span>
            <div className="w-px h-5 bg-[#40444b] mx-2 hidden sm:block"></div>
            <span className="text-[#8e9297] text-xs hidden sm:block">
              {activeChannel === "admin" ? `Прямая связь с администратором ${ADMIN_USERNAME}` : "Канал для общения пользователей RAG"}
            </span>
            <div className="ml-auto flex items-center gap-3">
              <button className="text-[#b9bbbe] hover:text-white transition-colors" onClick={() => setShowSearch(true)}>
                <Icon name="Search" size={18} />
              </button>
              <button className="text-[#b9bbbe] hover:text-white transition-colors" onClick={() => setInCall(true)}>
                <Icon name="Phone" size={18} />
              </button>
              <button className="text-[#b9bbbe] hover:text-white transition-colors" onClick={() => setInCall(true)}>
                <Icon name="Video" size={18} />
              </button>
              <Icon name="Bell" size={18} className="text-[#b9bbbe] cursor-pointer hover:text-white" />
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-[#5865f2]/20 to-[#57f287]/10 border border-[#5865f2]/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#5865f2] rounded-xl flex items-center justify-center font-black text-lg">R</div>
                <div>
                  <h3 className="text-white font-bold">Добро пожаловать в RAG</h3>
                  <p className="text-[#b9bbbe] text-xs">Мессенджер нового поколения</p>
                </div>
              </div>
              <p className="text-[#b9bbbe] text-sm">Здесь вы найдёте всё: личные чаты, каналы, голосовые и видеозвонки, истории, файлы и многое другое.</p>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 group">
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{ backgroundColor: msg.color }}>
                  {msg.letter}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-white text-sm font-semibold">{msg.author}</span>
                    {msg.isAdmin && <span className="text-[10px] bg-[#5865f2] text-white px-1.5 py-0.5 rounded-full">ADMIN</span>}
                    <span className="text-[#72767d] text-xs">{msg.time}</span>
                  </div>
                  <p className="text-[#dcddde] text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* MESSAGE INPUT */}
          <div className="p-4 bg-[#36393f]">
            <div className="bg-[#40444b] rounded-lg flex items-center gap-2 px-4 py-2.5">
              <button className="text-[#b9bbbe] hover:text-white transition-colors flex-shrink-0">
                <Icon name="Plus" size={20} />
              </button>
              <input
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={`Написать в #${currentChannel?.name}`}
                className="flex-1 bg-transparent text-[#dcddde] text-sm outline-none placeholder-[#72767d]"
                onKeyDown={(e) => e.key === "Enter" && setInputMsg("")}
              />
              <div className="flex gap-2 flex-shrink-0">
                <button className="text-[#b9bbbe] hover:text-white transition-colors"><Icon name="Paperclip" size={18} /></button>
                <button className="text-[#b9bbbe] hover:text-white transition-colors"><Icon name="Mic" size={18} /></button>
                <button className="text-[#b9bbbe] hover:text-white transition-colors"><Icon name="Smile" size={18} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* MEMBERS PANEL */}
        <div className="hidden xl:flex w-56 bg-[#2f3136] flex-col p-3 gap-2 border-l border-[#202225]">
          <p className="text-[#8e9297] text-xs font-semibold uppercase tracking-wide px-2 mb-1">Онлайн — 5</p>
          {[
            { name: "Алина", color: "#5865f2", letter: "А", status: "В сети" },
            { name: "Марк", color: "#57f287", letter: "М", status: "В сети" },
            { name: "RAG Bot", color: "#faa61a", letter: "R", status: "Бот", isAdmin: true },
            { name: "Иван", color: "#ed4245", letter: "И", status: "Не беспокоить" },
            { name: "Соня", color: "#9b59b6", letter: "С", status: "Не активна" },
          ].map((u) => (
            <div key={u.name} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#393c43] cursor-pointer transition-colors">
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: u.color }}>{u.letter}</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#57f287] rounded-full border-2 border-[#2f3136]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#dcddde] text-sm truncate font-medium">{u.name}</div>
                <div className="text-[#72767d] text-[10px] truncate">{u.status}</div>
              </div>
              {u.isAdmin && <Icon name="Shield" size={12} className="text-[#faa61a]" />}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="bg-[#2f3136] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">Всё что нужно для общения</h2>
            <p className="text-[#b9bbbe] text-lg">RAG — мессенджер с полным набором функций</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-[#36393f] rounded-xl p-5 hover:bg-[#393c43] transition-colors border border-[#202225]">
                <div className="w-10 h-10 bg-[#5865f2]/20 rounded-lg flex items-center justify-center mb-3">
                  <Icon name={f.icon} size={20} className="text-[#5865f2]" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-[#8e9297] text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#36393f] to-[#202225]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-[#5865f2] rounded-3xl flex items-center justify-center font-black text-4xl mx-auto mb-6">R</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Начните общаться в RAG</h2>
          <p className="text-[#b9bbbe] text-lg mb-8">Регистрация через телефон или почту — занимает 30 секунд</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button className="bg-[#5865f2] hover:bg-[#4752c4] text-white px-8 py-3 rounded-xl text-base font-semibold" onClick={() => { setShowAuth(true); setAuthMode("register"); }}>
              Создать аккаунт
            </Button>
            <Button variant="ghost" className="text-[#b9bbbe] hover:text-white hover:bg-[#40444b] px-8 py-3 rounded-xl text-base border border-[#40444b]" onClick={() => { setShowAuth(true); setAuthMode("login"); }}>
              Уже есть аккаунт
            </Button>
          </div>
          <p className="text-[#72767d] text-sm mt-6">Администратор: {ADMIN_USERNAME}</p>
        </div>
      </section>

      {/* AUTH MODAL */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#36393f] rounded-2xl w-full max-w-md p-8 relative">
            <button className="absolute top-4 right-4 text-[#b9bbbe] hover:text-white" onClick={() => setShowAuth(false)}>
              <Icon name="X" size={20} />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#5865f2] rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-3">R</div>
              <h2 className="text-2xl font-black text-white">{authMode === "register" ? "Создать аккаунт" : "Добро пожаловать"}</h2>
              <p className="text-[#b9bbbe] text-sm mt-1">{authMode === "register" ? "Присоединяйся к RAG" : "Войди в свой аккаунт"}</p>
            </div>

            {/* Auth tabs */}
            <div className="flex bg-[#2f3136] rounded-lg p-1 mb-5">
              <button onClick={() => setAuthTab("phone")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${authTab === "phone" ? "bg-[#5865f2] text-white" : "text-[#b9bbbe] hover:text-white"}`}>
                📱 Телефон
              </button>
              <button onClick={() => setAuthTab("email")} className={`flex-1 py-2 rounded-md text-sm font-semibold transition-colors ${authTab === "email" ? "bg-[#5865f2] text-white" : "text-[#b9bbbe] hover:text-white"}`}>
                ✉️ Почта
              </button>
            </div>

            <div className="space-y-3">
              {authMode === "register" && (
                <div>
                  <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Имя пользователя</label>
                  <input placeholder="@username" className="w-full bg-[#202225] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5865f2] border border-[#202225]" />
                </div>
              )}
              {authTab === "phone" ? (
                <div>
                  <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Номер телефона</label>
                  <input placeholder="+7 999 123-45-67" className="w-full bg-[#202225] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5865f2] border border-[#202225]" />
                </div>
              ) : (
                <div>
                  <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Email</label>
                  <input placeholder="you@example.com" className="w-full bg-[#202225] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5865f2] border border-[#202225]" />
                </div>
              )}
              <div>
                <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Пароль</label>
                <input type="password" placeholder="••••••••" className="w-full bg-[#202225] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5865f2] border border-[#202225]" />
              </div>
              <Button className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white py-3 rounded-lg font-semibold mt-2">
                {authMode === "register" ? "Создать аккаунт" : "Войти"}
              </Button>
            </div>
            <p className="text-center text-[#b9bbbe] text-sm mt-4">
              {authMode === "register" ? "Уже есть аккаунт? " : "Нет аккаунта? "}
              <button className="text-[#5865f2] hover:underline font-semibold" onClick={() => setAuthMode(authMode === "register" ? "login" : "register")}>
                {authMode === "register" ? "Войти" : "Зарегистрироваться"}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* STORY MODAL */}
      {activeStory !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50" onClick={() => setActiveStory(null)}>
          <div className="text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center font-black text-4xl mx-auto mb-4 border-4 border-[#5865f2]"
              style={{ backgroundColor: stories.find(s => s.id === activeStory)?.color }}>
              {stories.find(s => s.id === activeStory)?.letter}
            </div>
            <p className="text-white text-xl font-bold mb-2">{stories.find(s => s.id === activeStory)?.name}</p>
            <p className="text-[#b9bbbe] text-sm mb-6">История пользователя</p>
            <div className="bg-[#2f3136] rounded-2xl p-8 w-80 h-48 flex items-center justify-center">
              <p className="text-[#8e9297] text-sm">📸 Контент истории</p>
            </div>
            <button className="mt-6 text-[#b9bbbe] hover:text-white" onClick={() => setActiveStory(null)}>
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>
      )}

      {/* CALL MODAL */}
      {inCall && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-[#36393f] rounded-2xl p-10 text-center w-80">
            <div className="w-20 h-20 bg-[#5865f2] rounded-full flex items-center justify-center font-black text-3xl mx-auto mb-4">А</div>
            <h3 className="text-white text-xl font-bold mb-1">Алина</h3>
            <p className="text-[#b9bbbe] text-sm mb-8">Идёт вызов...</p>
            <div className="flex justify-center gap-6">
              <button className="w-14 h-14 bg-[#40444b] rounded-full flex items-center justify-center hover:bg-[#4f545c] transition-colors">
                <Icon name="Mic" size={22} className="text-white" />
              </button>
              <button className="w-14 h-14 bg-[#ed4245] rounded-full flex items-center justify-center hover:bg-[#c03537] transition-colors" onClick={() => setInCall(false)}>
                <Icon name="PhoneOff" size={22} className="text-white" />
              </button>
              <button className="w-14 h-14 bg-[#40444b] rounded-full flex items-center justify-center hover:bg-[#4f545c] transition-colors">
                <Icon name="Video" size={22} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 pt-20 p-4">
          <div className="bg-[#36393f] rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center gap-3 p-4 border-b border-[#202225]">
              <Icon name="Search" size={18} className="text-[#b9bbbe]" />
              <input autoFocus placeholder="Поиск людей, каналов, сообщений..." className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#72767d]" />
              <button onClick={() => setShowSearch(false)}><Icon name="X" size={18} className="text-[#b9bbbe] hover:text-white" /></button>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-[#8e9297] text-xs font-semibold uppercase mb-2">Каналы</p>
              {channels.map((ch) => (
                <div key={ch.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#40444b] cursor-pointer" onClick={() => { setActiveChannel(ch.id); setShowSearch(false); }}>
                  <Icon name="Hash" size={16} className="text-[#8e9297]" />
                  <span className="text-[#dcddde] text-sm">{ch.name}</span>
                </div>
              ))}
              <p className="text-[#8e9297] text-xs font-semibold uppercase mt-4 mb-2">Пользователи</p>
              {["Алина", "Марк", "Соня", "Иван"].map((u) => (
                <div key={u} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#40444b] cursor-pointer">
                  <div className="w-7 h-7 bg-[#5865f2] rounded-full flex items-center justify-center text-xs font-bold">{u[0]}</div>
                  <span className="text-[#dcddde] text-sm">{u}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE CHANNEL MODAL */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#36393f] rounded-2xl w-full max-w-md p-6 relative">
            <button className="absolute top-4 right-4 text-[#b9bbbe] hover:text-white" onClick={() => setShowCreateChannel(false)}>
              <Icon name="X" size={20} />
            </button>
            <h2 className="text-white text-xl font-black mb-1">Создать канал</h2>
            <p className="text-[#b9bbbe] text-sm mb-5">Создайте канал и публикуйте посты</p>
            <div className="space-y-3">
              <div>
                <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Название канала</label>
                <input placeholder="мой-канал" className="w-full bg-[#202225] text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#5865f2]" />
              </div>
              <div>
                <label className="text-[#b9bbbe] text-xs font-semibold uppercase tracking-wide block mb-1">Тип</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#202225] border border-[#5865f2] rounded-lg p-3 cursor-pointer">
                    <p className="text-white text-sm font-semibold"># Текстовый</p>
                    <p className="text-[#8e9297] text-xs">Сообщения и файлы</p>
                  </div>
                  <div className="flex-1 bg-[#202225] rounded-lg p-3 cursor-pointer hover:border hover:border-[#40444b]">
                    <p className="text-white text-sm font-semibold">📢 Анонсы</p>
                    <p className="text-[#8e9297] text-xs">Только посты</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-[#5865f2] hover:bg-[#4752c4] text-white py-3 rounded-lg font-semibold">
                Создать канал
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#36393f] rounded-2xl w-full max-w-sm p-6 relative">
            <button className="absolute top-4 right-4 text-[#b9bbbe] hover:text-white" onClick={() => setShowSettings(false)}>
              <Icon name="X" size={20} />
            </button>
            <h2 className="text-white text-xl font-black mb-5">Настройки</h2>
            <div className="space-y-1">
              {[
                { icon: "User", label: "Мой профиль" },
                { icon: "Bell", label: "Уведомления" },
                { icon: "Shield", label: "Конфиденциальность" },
                { icon: "Volume2", label: "Звук и видео" },
                { icon: "Palette", label: "Внешний вид" },
                { icon: "RefreshCw", label: "Сменить аккаунт" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#40444b] cursor-pointer transition-colors">
                  <Icon name={item.icon} size={18} className="text-[#b9bbbe]" />
                  <span className="text-[#dcddde] text-sm">{item.label}</span>
                  <Icon name="ChevronRight" size={16} className="text-[#72767d] ml-auto" />
                </div>
              ))}
              <div className="pt-2 border-t border-[#202225]">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#40444b] cursor-pointer transition-colors">
                  <Icon name="LogOut" size={18} className="text-[#ed4245]" />
                  <span className="text-[#ed4245] text-sm">Выйти</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;