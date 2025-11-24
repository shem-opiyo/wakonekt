// src/pages/ChatPage.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import FloatingBar from '../components/FloatingBar'
import {useCases} from '../context/CasesContext'

export default function ChatPage() {
  const { caseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  //newly added 
  const {cases} = useCases()
  const currentCase = cases.find(c => c.id === caseId) || {
    title: 'New Case',
    junior: { name: 'Junior Assistant' },
    senior: { name: 'Senior Advocate' }
  }

//   // Mock data — replace later with real API
//   useEffect(() => {
//     setMessages([
//       { id: 1, sender: 'junior', text: 'Hello! I’m Alex, a junior legal assistant. How can I help you today?', time: '10:30 AM' },
//       { id: 2, sender: 'system', text: 'Senior Advocate Dr. Mwangi is supervising this chat.', time: '10:31 AM' }
//     ])
//   }, [caseId])

// New mock data
// Load mock messages (replace with real API later)
  useEffect(() => {
    // For now, use mock data per case
    const mockMessages = {
      'case-001': [
        { id: 1, sender: 'junior', text: 'Hi! I’ve been assigned to your land dispute case. Can you share more details?', time: '10:30 AM' },
        { id: 2, sender: 'client', text: 'Yes, I have a title deed and a demand letter from the neighbor.', time: '10:35 AM' },
        { id: 3, sender: 'junior', text: 'Perfect. Please upload them when you can.', time: '10:36 AM' }
      ],
      'case-002': [
        { id: 1, sender: 'junior', text: 'Hello, I’m reviewing your termination letter. Was it wrongful?', time: 'Yesterday' }
      ],
      'default': [
        { id: 1, sender: 'junior', text: `Hello ${user?.name || ''}! I’m your junior legal assistant. How can I help you today?`, time: 'Just now' },
        { id: 2, sender: 'system', text: `Senior Advocate ${currentCase.senior.name} is supervising this chat.`, time: 'Just now' }
      ]
    }

    const msgs = mockMessages[caseId] || mockMessages.default
    setMessages(msgs)
  }, [caseId, user?.name, currentCase.senior.name])

//   Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send message
  const sendMessage = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMsg = {
      id: Date.now(),
      sender: 'client',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')

    // // Mock junior reply after 2 seconds
    // setTimeout(() => {
    //   setMessages(prev => [...prev, {
    //     id: Date.now() + 1,
    //     sender: 'junior',
    //     text: 'Thank you for explaining. Let me review the details and get back to you shortly.',
    //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    //   }])
    // }, 2000)

    // new
    // Mock junior reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'junior',
        text: 'Thank you. I’m reviewing your message and will get back shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }, 1500 + Math.random() * 2000)
  }

  return (
    <>
      <Header />
      <div style={{ paddingTop: '80px', minHeight: '100vh', background: '#f8f9ff' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Chat Header */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{ width: '50px', height: '50px', background: '#6e44ff', borderRadius: '50%', display: 'grid', placeItems: 'center', color: 'white', fontSize: '1.5rem' }}>
              ⚖
            </div>
            <div>
              {/* <h3>Alex Kimani (Junior Assistant)</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Supervised by <strong>Dr. Jane Mwangi</strong> • Active now
              </p> */}
              
              {/* // In the chat header, replace the static name with: */}
              {/* new */}
              <h3 style={{ margin: '0 0 0.4rem 0' }}>  
                {currentCase.junior.name} (Junior Assistant)</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                Supervised by <strong>{currentCase.senior.name}</strong> • Case: {currentCase.title}
  </p>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            background: 'white',
            height: '60vh',
            overflowY: 'auto',
            padding: '2rem',
            border: '1px solid #eee'
          }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                marginBottom: '1rem',
                textAlign: msg.sender === 'client' ? 'right' : 'left'
              }}>
                <div style={{
                  display: 'inline-block',
                  maxWidth: '70%',
                  background: msg.sender === 'client' ? '#6e44ff' : msg.sender === 'junior' ? '#f0f0ff' : '#ffd60a',
                  color: msg.sender === 'client' ? 'white' : '#333',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '18px',
                  borderBottomRightRadius: msg.sender === 'client' ? '4px' : '18px',
                  borderBottomLeftRadius: msg.sender === 'client' ? '18px' : '4px'
                }}>
                  <p style={{ margin: '0 0 0.4rem 0', fontWeight: msg.sender === 'system' ? 'bold' : 'normal' }}>
                    {msg.text}
                  </p>
                  <small style={{ opacity: 0.7 }}>{msg.time}</small>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '0 0 16px 16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '1rem'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '50px',
                border: '1px solid #ddd',
                fontSize: '1rem'
              }}
            />
            <button type="submit" style={{
              background: '#6e44ff',
              color: 'white',
              border: 'none',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}>
              Send
            </button>
          </form>
        </div>
      </div>
      {/* <FloatingBar /> */}
    </>
  )
}