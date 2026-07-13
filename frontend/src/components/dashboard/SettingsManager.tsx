import { useState, useEffect } from "react";
import { Settings, Save } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import Title from "../ui/Title";

export default function SettingsManager() {
  const [bufferTime, setBufferTime] = useState("15");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/settings");
        const data = await response.json();
        if (data.bufferTime) {
          setBufferTime(data.bufferTime);
        }
      } catch (error) {
        console.error("Error cargando configuraciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:3000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bufferTime })
      });
      if (response.ok) {
        alert("Configuraciones guardadas con éxito");
      }
    } catch (error) {
      console.error("Error guardando configuraciones:", error);
      alert("Hubo un error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando configuraciones...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
      <Card className="bg-card text-card-foreground p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-secondary/50 rounded-lg text-primary">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <Title level={3} className="!mb-0">Configuración del Sistema</Title>
            <p className="text-sm text-primary">Ajustá cómo se comporta el turnero inteligente</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-secondary/50 p-4 rounded-xl border border-border">
            <div className="mb-4">
              <Label className="text-lg">Tiempo de Limpieza (Buffer Time)</Label>
              <p className="text-sm text-primary mb-3">
                Es el tiempo automático que el sistema bloqueará en tu agenda DESPUÉS de cada turno para que puedas limpiar la mesa y esterilizar tus herramientas.
              </p>
              <div className="flex items-center gap-3">
                <Input 
                  type="number" 
                  value={bufferTime} 
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="max-w-[120px]"
                  min="0"
                  required
                />
                <span className="font-medium text-foreground">minutos</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
              <Save className="w-5 h-5" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
