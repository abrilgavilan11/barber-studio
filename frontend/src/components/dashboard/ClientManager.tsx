import { useState, useEffect } from "react";
import { Search, MessageCircle, Star, Edit2, Trash2, Plus } from "lucide-react";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Label from "../ui/Label";
import Modal from "../ui/Modal";

interface Client {
  id: string;
  name: string;
  phone: string;
  visits: number;
  isVIP: boolean;
}

export default function ClientManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/clients`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const openCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que querés eliminar a este cliente?")) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/clients/${id}`, { method: "DELETE" });
      if (response.ok) fetchClients();
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const clientData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      isVIP: formData.get("isVIP") === "on",
    };

    const method = editingClient ? "PUT" : "POST";
    const url = editingClient 
      ? `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/clients/${editingClient.id}`
      : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/clients`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchClients();
      }
    } catch (error) {
      console.error("Error guardando cliente:", error);
    }
  };

  const handleWhatsApp = (phone: string, name: string) => {
    const message = `¡Hola ${name}! Te escribo de Barber Studio 💈. `;
    const cleanPhone = phone.replace(/\D/g, ''); 
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input 
            type="text" 
            placeholder="Buscar cliente por nombre o teléfono..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="flex items-center gap-2" onClick={openCreateModal}>
          <Plus className="w-5 h-5" />
          Nueva cliente
        </Button>
      </div>

      <Card className="bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">cliente</th>
                <th className="p-4 font-semibold">Contacto</th>
                <th className="p-4 font-semibold text-center">Visitas</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground animate-pulse">Cargando clientes...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">No se encontraron clientes regsitrados.</td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center text-foreground font-bold">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground flex items-center gap-1">
                            {client.name}
                            {client.isVIP && (
                              <span title="cliente VIP" className="flex items-center">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{client.phone}</td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center bg-secondary/50 text-muted-foreground font-bold rounded-full w-8 h-8">
                        {client.visits}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleWhatsApp(client.phone, client.name)} title="Enviar WhatsApp" className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => openEditModal(client)} className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors cursor-pointer">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(client.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? "Editar cliente" : "Registrar cliente"}>
        <form key={editingClient ? editingClient.id : 'new'} className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Nombre Completo</Label>
            <Input name="name" type="text" defaultValue={editingClient?.name} placeholder="Ej: Sofía Martínez" required />
          </div>
          <div>
            <Label>Teléfono / WhatsApp</Label>
            <Input name="phone" type="text" defaultValue={editingClient?.phone} placeholder="Ej: 5492991112222" required />
            <p className="text-xs text-gray-500 mt-1">Incluí el código de país y área sin el "+" para que funcione bien el botón de WhatsApp.</p>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" name="isVIP" id="isVIP" defaultChecked={editingClient?.isVIP} className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"/>
            <Label htmlFor="isVIP" className="!mb-0 cursor-pointer">¿Es cliente VIP?</Label>
          </div>
          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editingClient ? "Actualizar" : "Guardar"}</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}