import { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, Search } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Modal from "../ui/Modal";

interface Service {
  id: string | number;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  category?: { id: string; name: string };
}

interface Category {
  id: string;
  name: string;
}

export default function CatalogManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [imageBase64, setImageBase64] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/services`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error cargando servicios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    setImageMode("url");
    setImageBase64("");
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setImageMode("url");
    setImageBase64(service.image || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm("¿Estás seguro de que querés eliminar este servicio de forma permanente?")) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/services/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error("Error eliminando el servicio:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const imageFinal = imageMode === "url" 
      ? (formData.get("imageUrl") as string || "")
      : imageBase64;

    const serviceData = {
      name: formData.get("name"),
      categoryId: formData.get("categoryId"),
      duration: formData.get("duration"),
      price: formData.get("price"),
      description: formData.get("description"),
      image: imageFinal || editingService?.image || "",
    };

    const method = editingService ? "PUT" : "POST";
    const url = editingService 
      ? `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/services/${editingService.id}`
      : `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/services`;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchServices();
      } else {
        const errData = await response.json().catch(() => ({}));
        alert("Error al guardar: " + (errData.error || response.statusText));
      }
    } catch (error) {
      alert("Error de red al intentar guardar el servicio.");
      console.error("Error guardando el servicio:", error);
    }
  };

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    service.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar por nombre o categoría..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="flex items-center gap-2" onClick={openCreateModal}>
          <Plus className="w-5 h-5" />
          Nuevo Servicio
        </Button>
      </div>

      <Card className="bg-card text-card-foreground overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary text-foreground text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Imagen</th>
                <th className="p-4 font-semibold">Servicio</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold">Duración</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground animate-pulse">
                    Cargando servicios...
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    No se encontraron servicios.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4">
                      {service.image ? (
                        <img src={service.image} alt={service.name} className="w-12 h-12 object-cover rounded-lg border border-border" />
                      ) : (
                        <div className="w-12 h-12 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground text-xs font-bold">SIN IMG</div>
                      )}
                    </td>
                    <td className="p-4 font-medium text-foreground">{service.name}</td>
                    <td className="p-4 text-muted-foreground">
                      <span className="bg-secondary/50 text-foreground px-2 py-1 rounded text-xs font-semibold uppercase">
                        {service.category?.name || 'Sin Categoría'}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{service.duration} min</td>
                    <td className="p-4 font-bold text-primary">${service.price.toLocaleString('es-AR')}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(service)}
                          className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingService ? "Editar Servicio" : "Agregar Nuevo Servicio"}
      >
        <form key={editingService ? editingService.id : 'new'} className="space-y-4" onSubmit={handleSubmit}>
          
          <div>
            <Label>Nombre del Servicio</Label>
            <Input name="name" type="text" defaultValue={editingService?.name} placeholder="Ej: Corte Clasico " required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Categoría</Label>
              <select name="categoryId" defaultValue={editingService?.category?.id || ""} className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-card text-card-foreground outline-none" required>
                <option value="" disabled>Seleccionar Categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Duración (minutos)</Label>
              <Input name="duration" type="number" defaultValue={editingService?.duration} placeholder="Ej: 90" required />
            </div>
          </div>

          <div>
            <Label>Precio ($)</Label>
            <Input name="price" type="number" defaultValue={editingService?.price} placeholder="Ej: 20000" required />
          </div>

          <div>
            <Label>Descripción Corta</Label>
            <textarea 
              name="description"
              defaultValue={editingService?.description}
              className="block w-full px-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
              rows={3}
              placeholder="Detalles del servicio..."
              required
            ></textarea>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Imagen del Servicio</Label>
              <div className="flex gap-2 text-sm bg-rose-50 rounded-lg p-1">
                <button 
                  type="button" 
                  onClick={() => setImageMode("url")} 
                  className={`px-3 py-1 rounded-md transition-colors ${imageMode === "url" ? "bg-card text-card-foreground text-rose-700 shadow-sm font-medium" : "text-rose-500"}`}
                >
                  URL
                </button>
                <button 
                  type="button" 
                  onClick={() => setImageMode("upload")} 
                  className={`px-3 py-1 rounded-md transition-colors ${imageMode === "upload" ? "bg-card text-card-foreground text-rose-700 shadow-sm font-medium" : "text-rose-500"}`}
                >
                  Subir
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <>
                <Input name="imageUrl" type="url" defaultValue={editingService?.image && !editingService.image.startsWith('data:') ? editingService.image : ""} placeholder="https://ejemplo.com/imagen.jpg" />
                <p className="text-xs text-muted-foreground mt-1">Podés pegar el link directo de una imagen (Pinterest, Google, etc).</p>
              </>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 cursor-pointer"
                />
                {(imageBase64 || (editingService?.image && editingService.image.startsWith('data:'))) && (
                  <p className="text-xs text-green-600 mt-2 font-medium">¡Imagen cargada correctamente!</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingService ? "Actualizar Cambios" : "Guardar Servicio"}
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
}