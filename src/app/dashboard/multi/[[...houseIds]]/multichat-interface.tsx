"use client"

import React, { useEffect, useRef, useState } from "react"
import { api } from "@/trpc/react"
import { toast } from "sonner"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PaperPlaneIcon } from "@radix-ui/react-icons"
import ReactMarkdown from 'react-markdown'
import { twMerge } from "tailwind-merge"
import { CopyIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface MultiChatInterfaceProps {
  houseIds: string[]
}

type ComponentProps = {
  className?: string
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLElement>

type CodeProps = ComponentProps & {
  inline?: boolean
}

const baseTextStyles = "text-gray-800 leading-relaxed"
const headingStyles = "font-semibold tracking-tight"

export const markdownComponents = {
  h1: ({className, ...props}: ComponentProps) => (
    <h1 className={twMerge(`${baseTextStyles} ${headingStyles} text-3xl my-2`, className)} {...props} />
  ),
  h2: ({className, ...props}: ComponentProps) => (
    <h2 className={twMerge(`${baseTextStyles} ${headingStyles} text-2xl my-1.5`, className)} {...props} />
  ),
  h3: ({className, ...props}: ComponentProps) => (
    <h3 className={twMerge(`${baseTextStyles} ${headingStyles} text-xl my-1`, className)} {...props} />
  ),
  p: ({className, ...props}: ComponentProps) => (
    <p className={twMerge(`${baseTextStyles} mb-1`, className)} {...props} />
  ),
  ul: ({className, ...props}: ComponentProps) => (
    <ul className={twMerge("list-disc pl-5 mb-4", className)} {...props} />
  ),
  ol: ({className, ...props}: ComponentProps) => (
    <ol className={twMerge("list-decimal pl-5 mb-4", className)} {...props} />
  ),
  li: ({className, ...props}: ComponentProps) => (
    <li className={twMerge(`${baseTextStyles} mb-0.5`, className)} {...props} />
  ),
  code: ({className, inline, ...props}: CodeProps) => (
    inline ? (
      <code className={twMerge("bg-gray-100 text-red-600 rounded px-1 py-0.5 text-sm", className)} {...props} />
    ) : (
      <code
        className={twMerge("block bg-gray-100 rounded p-3 overflow-x-auto text-sm my-4", className)} {...props} />
    )
  ),
  blockquote: ({className, ...props}: ComponentProps) => (
    <blockquote className={twMerge("border-l-4 border-gray-300 pl-4 italic my-4", className)} {...props} />
  ),
}

export const MultiChatInterface: React.FC<MultiChatInterfaceProps> = ({houseIds}) => {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string }>>([])
  const [newMessage, setNewMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const updateMultiChat = api.house.updateMultiChat.useMutation({
    onMutate: async (newMessage) => {
      setChatMessages(prevMessages => [...prevMessages, { sender: "You", message: newMessage.newChat }])
    },
    onError: (err) => {
      toast.error("Failed to send message")
    },
    onSuccess: (data) => {
      setChatMessages(prevMessages => [...prevMessages, { sender: "AI", message: data.chatData[data.chatData.length - 1].message }])
    },
  })

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const typingIndicatorVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages, updateMultiChat.isPending])

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement> | undefined) => {
    if (e) {
      e.preventDefault()
    }
    if (newMessage.trim() === "") return

    try {
      await updateMultiChat.mutateAsync({
        newChat: newMessage,
        houseIds: houseIds,
        chatData: chatMessages,
      })
      setNewMessage("")
    } catch (error) {
      toast.error("Failed to send message")
    }
  }

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(undefined)
    }
  }

  const handleCopyClick = (message: string) => {
    navigator.clipboard.writeText(message)
    toast.success("Copied to clipboard.")
  }

  if (houseIds.length === 0) return null

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2 bg-secondary">
        <h2 className="text-lg font-semibold">Multi-House Chat</h2>
      </div>
      <Separator />
      <ScrollArea ref={scrollAreaRef} className="flex-grow pr-1 md:pr-4">
        <div className="p-4 space-y-4">
          <AnimatePresence initial={false}>
            {chatMessages.map((message, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.1, delay: index * 0.02 }}
              >
                <div
                  className={`p-3 md:max-w-[65%] mt-2 rounded-t-lg ${message.sender === 'You' ? 'bg-blue-100 rounded-b-lg ml-auto max-w-[80%]' : 'bg-gray-100'}`}>
                  <p className="font-semibold">{message.sender}</p>
                  <ReactMarkdown components={markdownComponents}>{message.message}</ReactMarkdown>
                </div>
                {message.sender !== 'You' && (
                  <div className="bg-gray-200 p-1.5 flex justify-between rounded-b-lg md:max-w-[65%]">
                    <Button variant="ghost" size="sm" onClick={() => handleCopyClick(message.message)}>
                      <CopyIcon className="mr-2 w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
            {updateMultiChat.isPending && (
              <motion.div
                key="typing"
                variants={typingIndicatorVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
                className="p-3 my-2 rounded-lg bg-gray-100 inline-block"
              >
                <span className="flex space-x-1">
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  />
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.25, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-500 rounded-full"
                  />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form className="flex space-x-2" onSubmit={handleSendMessage}>
          <Textarea
            placeholder="Type your message here..."
            className="flex-grow p-2 border rounded-lg sm:text-md text-[16px]"
            disabled={updateMultiChat.isPending}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={onEnterPress}
          />
          <Button type="submit" disabled={newMessage.trim() === "" || updateMultiChat.isPending}>
            <PaperPlaneIcon className="sm:mr-2" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}