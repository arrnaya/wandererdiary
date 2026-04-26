'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, User } from 'lucide-react'

const conversations = [
  { id: '1', name: 'Sarah Mitchell', lastMessage: 'Thanks for reading my story!', time: '2m ago', unread: 2 },
  { id: '2', name: 'Arjun Mehta', lastMessage: 'Let me know if you need more tips.', time: '1h ago', unread: 0 },
]

const messages = [
  { id: '1', sender: 'them', content: 'Hi there! Thanks for reaching out.', time: '10:00 AM' },
  { id: '2', sender: 'me', content: 'Hi Sarah! I loved your El Nido story. Any tips for solo travelers?', time: '10:05 AM' },
  { id: '3', sender: 'them', content: 'Absolutely! El Nido is great for solo travel. I recommend joining group tours — you will meet amazing people.', time: '10:08 AM' },
]

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="animate-fade-in h-[calc(100vh-64px)] flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-brand-cream hidden md:flex flex-col">
        <div className="p-4 border-b border-brand-cream">
          <h2 className="font-display text-xl font-bold text-brand-darkGreen">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-brand-offWhite transition-colors text-left ${
                activeChat.id === chat.id ? 'bg-brand-offWhite' : ''
              }`}
            >
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-brand-darkGreen text-white text-sm">
                  {chat.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm truncate">{chat.name}</p>
                  <span className="text-xs text-muted-foreground">{chat.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-amber text-white text-xs flex items-center justify-center">
                  {chat.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-brand-offWhite">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-white border-b border-brand-cream">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-brand-darkGreen text-white">
              {activeChat.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{activeChat.name}</p>
            <p className="text-xs text-muted-foreground">Travel Writer</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-xl px-4 py-2 ${
                  msg.sender === 'me'
                    ? 'bg-brand-darkGreen text-white'
                    : 'bg-white text-brand-dark'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-brand-cream">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              setNewMessage('')
            }}
          >
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
