import { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:5000');

const languages = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C', value: 'c' },
  { label: 'C++', value: 'cpp' },
];

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [userCount, setUserCount] = useState(1);
  const editorRef = useRef(null);

  useEffect(() => {
    console.log('Connecting to Socket.io server...');
    socket.on('connect', () => {
      console.log('Connected to backend via Socket.io');
    });
    socket.on('init', (content) => {
      console.log('Received init:', content);
      setCode(content);
    });
    socket.on('code-change', (newContent) => {
      console.log('Received code-change:', newContent);
      setCode(newContent);
    });
    socket.on('user-count', (count) => {
      setUserCount(count);
    });
    return () => {
      socket.off('connect');
      socket.off('init');
      socket.off('code-change');
      socket.off('user-count');
    };
  }, []);

  const handleEditorChange = (value) => {
    setCode(value);
    console.log('Emitting code-change:', value);
    socket.emit('code-change', value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  function CustomDropdown({ options, value, onChange }) {
    const [open, setOpen] = useState(false);
    const handleSelect = (val) => {
      onChange(val);
      setOpen(false);
    };
    const selected = options.find(opt => opt.value === value);
    useEffect(() => {
      if (!open) return;
      const handleClick = (e) => {
        if (!e.target.closest('.custom-dropdown')) setOpen(false);
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);
    return (
      <div className="custom-dropdown">
        <button
          type="button"
          className="custom-dropdown-btn"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          {selected ? selected.label : 'Select Language'}
          <span style={{ marginLeft: 8, fontSize: 12 }}>▼</span>
        </button>
        <div className={`custom-dropdown-list${open ? ' open' : ''}`} role="listbox">
          {options.map(opt => (
            <div
              key={opt.value}
              className="custom-dropdown-item"
              role="option"
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#181c24' }}>
      <h2
        style={{
          textAlign: 'center',
          color: '#fff',
          marginTop: 0,
          paddingTop: 28,
          fontWeight: 900,
          letterSpacing: 2,
          fontSize: '2.5rem',
          textShadow: '0 2px 16px #61dafb55, 0 1px 0 #222',
          background: 'linear-gradient(90deg, #61dafb 0%, #646cff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: 'Avenir Next, Segoe UI, Arial, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        Real-Time Collaborative Code Editor
      </h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 40px 10px 40px' }}>
        <span style={{ color: '#fff', fontWeight: 500, fontSize: 15 }}>
          Active users: {userCount}
        </span>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label htmlFor="language-select" style={{ color: '#fff', marginRight: 8, fontWeight: 500 }}>Language:</label>
          <CustomDropdown
            options={languages}
            value={language}
            onChange={setLanguage}
          />
        </div>
      </div>
      <div style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.18)', borderRadius: 10, overflow: 'hidden', margin: '0 40px' }}>
        <MonacoEditor
          height="80vh"
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{ fontSize: 16, minimap: { enabled: false }, fontFamily: 'Fira Mono, JetBrains Mono, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
        />
      </div>
    </div>
  );
}

export default App;
