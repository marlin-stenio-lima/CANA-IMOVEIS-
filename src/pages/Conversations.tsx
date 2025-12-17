import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Star, 
  Phone, 
  Calendar, 
  Pin, 
  Mail, 
  Trash2, 
  Send,
  Smile,
  X,
  MessageCircle
} from "lucide-react";

// Mock data
const conversations = [
  { id: 1, name: "João Silva", avatar: "", lastMessage: "Olá, gostaria de saber mais sobre...", time: "10:30", unread: 2, starred: true },
  { id: 2, name: "Maria Santos", avatar: "", lastMessage: "Obrigada pelo atendimento!", time: "09:45", unread: 0, starred: false },
  { id: 3, name: "Pedro Oliveira", avatar: "", lastMessage: "Qual o valor do serviço?", time: "Ontem", unread: 1, starred: true },
  { id: 4, name: "Ana Costa", avatar: "", lastMessage: "Podemos agendar para amanhã?", time: "Ontem", unread: 0, starred: false },
  { id: 5, name: "Carlos Lima", avatar: "", lastMessage: "Perfeito, combinado!", time: "18/01", unread: 0, starred: false },
];

const messages = [
  { id: 1, sender: "contact", content: "Olá, tudo bem?", time: "10:00", isAuto: false },
  { id: 2, sender: "user", content: "Olá! Tudo ótimo, como posso ajudar?", time: "10:02", isAuto: false },
  { id: 3, sender: "contact", content: "Gostaria de saber mais sobre seus serviços", time: "10:05", isAuto: false },
  { id: 4, sender: "user", content: "Claro! Temos várias opções disponíveis. Você está interessado em qual área específica?", time: "10:08", isAuto: false },
  { id: 5, sender: "contact", content: "Estou procurando algo para minha empresa", time: "10:15", isAuto: false },
  { id: 6, sender: "user", content: "Perfeito! Vou enviar nosso catálogo de serviços corporativos.", time: "10:18", isAuto: true },
];

const contactDetails = {
  name: "João Silva",
  nickname: "João",
  phone: "+55 11 99999-0001",
  email: "joao@email.com",
  birthday: "15/03/1990",
  tags: ["WhatsApp", "Lead Quente", "Interesse Alto"],
  owner: "Você",
  followers: ["Maria", "Pedro"],
};

export default function Conversations() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [showDetails, setShowDetails] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all");

  const filteredConversations = conversations.filter(conv => {
    if (filter === "unread") return conv.unread > 0;
    if (filter === "starred") return conv.starred;
    return true;
  });

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-background rounded-lg border overflow-hidden">
      {/* Left Column - Conversation List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg mb-3">Caixa de Entrada</h2>
          <div className="flex gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              Todos
            </Button>
            <Button 
              variant={filter === "unread" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Não lidos
            </Button>
            <Button 
              variant={filter === "starred" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("starred")}
            >
              <Star className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors border-b ${
                selectedConversation.id === conv.id ? "bg-muted" : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conv.avatar} />
                  <AvatarFallback>{getInitials(conv.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {conv.starred && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                  {conv.unread > 0 && (
                    <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Center Column - Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedConversation.name}</h3>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Pin className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowDetails(!showDetails)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Hoje
              </span>
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </span>
                    {msg.isAuto && (
                      <Badge variant="outline" className="text-xs h-4 px-1">
                        Automático
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              placeholder="Digite sua mensagem..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === "Enter" && messageInput.trim() && setMessageInput("")}
            />
            <Button size="icon" disabled={!messageInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Contact Details */}
      {showDetails && (
        <div className="w-80 border-l flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Detalhes do contato</h3>
            <Button variant="ghost" size="icon" onClick={() => setShowDetails(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Contact Avatar & Name */}
              <div className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarFallback className="text-xl">
                    {getInitials(contactDetails.name)}
                  </AvatarFallback>
                </Avatar>
                <h4 className="font-semibold">{contactDetails.name}</h4>
              </div>

              <Separator />

              {/* Owner & Followers */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proprietário</span>
                  <span>{contactDetails.owner}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seguidores</span>
                  <span>{contactDetails.followers.join(", ")}</span>
                </div>
              </div>

              <Separator />

              {/* Tags */}
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Etiquetas</span>
                <div className="flex flex-wrap gap-2">
                  {contactDetails.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Contact Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Nome</label>
                  <Input value={contactDetails.name} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Apelido</label>
                  <Input value={contactDetails.nickname} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Telefone</label>
                  <Input value={contactDetails.phone} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">E-mail</label>
                  <Input value={contactDetails.email} readOnly className="mt-1" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Data de nascimento</label>
                  <Input value={contactDetails.birthday} readOnly className="mt-1" />
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
