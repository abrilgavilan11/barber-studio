import { useState, useEffect } from "react";
import { Calendar, Clock, User, CheckCircle, MessageCircle, Loader2, UserCircle, Phone, PlusSquare, Plus } from "lucide-react";
import Title from "../components/ui/Title";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";

type BookingStep = 1 | 2 | 3 | 4 | 5;

interface ServiceOption {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

interface Addon {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Professional {
  id: string;
  name: string;
  specialty: string;
}

export default function Booking() {
  const { user } = useAuth();
  
  const [currentStep, setCurrentStep] = useState<BookingStep>(1);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  
  const [clientName, setClientName] = useState(user?.name || "");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [services, setServices] = useState<ServiceOption[]>([]);
  const [addons, setAddons] = useState<Addon[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingAddons, setIsLoadingAddons] = useState(true);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [isLoadingProfessionals, setIsLoadingProfessionals] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servRes, addRes, profRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/services`),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/addons`),
          fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/professionals`)
        ]);
        
        if (servRes.ok) {
          const data = await servRes.json();
          const formattedServices: ServiceOption[] = data.map((service: any) => ({
            id: service.id,
            name: service.name,
            duration: service.duration,
            price: service.price,
            category: service.category?.name || "Otros"
          }));
          setServices(formattedServices);
        }

        if (addRes.ok) {
          const data = await addRes.json();
          setAddons(data);
        }

        if (profRes.ok) {
          const data = await profRes.json();
          setProfessionals(data);
        }
      } catch (error) {
        console.error("Error trayendo datos:", error);
      } finally {
        setIsLoadingServices(false);
        setIsLoadingAddons(false);
        setIsLoadingProfessionals(false);
      }
    };
    fetchData();
  }, []);

  const totalDuration = (selectedService?.duration || 0) + selectedAddons.reduce((acc, a) => acc + a.duration, 0);
  const totalPrice = (selectedService?.price || 0) + selectedAddons.reduce((acc, a) => acc + a.price, 0);

  useEffect(() => {
    if (selectedDate && totalDuration > 0) {
      const fetchAvailability = async () => {
        setIsLoadingTimes(true);
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:3000"}`}/api/availability?date=${selectedDate}&duration=${totalDuration}`);
          if (response.ok) {
            const data = await response.json();
            setAvailableTimes(data.slots || []);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
        } finally {
          setIsLoadingTimes(false);
        }
      };
      fetchAvailability();
    } else {
      setAvailableTimes([]);
    }
  }, [selectedDate, totalDuration]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-AR", { weekday: "short", month: "short", day: "numeric" });
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep((currentStep + 1) as BookingStep);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as BookingStep);
  };

  const toggleAddon = (addon: Addon) => {
    if (selectedAddons.find(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleWhatsAppBooking = async () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert("Por favor, completá tu nombre y teléfono para agendar el turno.");
      return;
    }

    setIsSubmitting(true);

    try {
      const clientRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: clientName, 
          phone: clientPhone, 
          isVIP: false,
          userId: user?.id || null
        }),
      });
      
      if (!clientRes.ok) throw new Error("Error al registrar cliente");
      const clientData = await clientRes.json();
      const newClientId = clientData.data.id;

      const dateTimeString = `${selectedDate}T${selectedTime}:00`;

      const aptRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: newClientId,
          serviceId: selectedService?.id,
          addonIds: selectedAddons.map(a => a.id),
          date: dateTimeString,
          status: "pendiente",
          professionalId: selectedProfessional?.id
        }),
      });

      if (!aptRes.ok) throw new Error("Error al registrar el turno");

      const dateObj = new Date(dateTimeString);
      const formattedDate = dateObj.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });
      
      let addonText = "";
      if (selectedAddons.length > 0) {
        addonText = `\n*Extras:* ${selectedAddons.map(a => a.name).join(", ")}`;
      }

      const message = `¡Hola! Soy ${clientName}, quería pedir un turno en Barber Studio 💈:
      
*Servicio:* ${selectedService?.name}${addonText}
*Fecha:* ${formattedDate}
*Hora:* ${selectedTime} hs
*Profesional / Barbero:* ${selectedProfessional?.name}

¿Me confirman si sigue disponible? ¡Gracias!`;

      const whatsappUrl = `https://wa.me/5492995345386?text=${encodeURIComponent(message)}`;
      
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedAddons([]);
      setSelectedDate("");
      setSelectedTime("");
      setClientName("");
      setClientPhone("");
      
      window.open(whatsappUrl, "_blank");

    } catch (error) {
      console.error("Error en el proceso de reserva:", error);
      alert("Hubo un error al procesar tu reserva. Por favor intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedService !== null;
      case 2: return true;
      case 3: return selectedDate !== "" && selectedTime !== "";
      case 4: return selectedProfessional !== null;
      case 5: return clientName.trim() !== "" && clientPhone.trim() !== "";
      default: return false;
    }
  };

  return (
    <div className="bg-background min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Title level={1}>Reserva tu Turno</Title>
          <p className="text-lg text-muted-foreground">
            Seguí estos simples pasos para agendar tu visita
          </p>
        </div>

        <div className="mb-12 overflow-x-auto pb-4 custom-scrollbar">
          <div className="flex items-center justify-between min-w-[600px] mx-auto px-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center flex-1 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step <= currentStep
                        ? "bg-primary text-white shadow-md"
                        : "bg-card text-card-foreground text-muted-foreground/60 border-2 border-border"
                    }`}
                  >
                    {step}
                  </div>
                  <div
                    className={`text-xs mt-2 text-center font-bold ${
                      step <= currentStep ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {step === 1 && "Servicio"}
                    {step === 2 && "Extras"}
                    {step === 3 && "Fecha"}
                    {step === 4 && "Profesional / Barbero"}
                    {step === 5 && "Confirmar"}
                  </div>
                </div>
                {step < 5 && (
                  <div
                    className={`h-1 flex-1 -mx-4 ${
                      step < currentStep ? "bg-primary" : "bg-secondary"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl shadow-lg border border-border p-6 md:p-8 min-h-[500px] flex flex-col">
          
          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <Title level={2} className="!mb-0">Elegí el Servicio Principal</Title>
              </div>

              {isLoadingServices ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p className="font-medium text-muted-foreground">Cargando catálogo de servicios...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80 text-center">
                  <p className="font-medium text-muted-foreground">No hay servicios disponibles en este momento.</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(
                    services.reduce((acc, service) => {
                      if (!acc[service.category]) acc[service.category] = [];
                      acc[service.category].push(service);
                      return acc;
                    }, {} as Record<string, ServiceOption[]>)
                  ).map(([category, categoryServices]) => (
                    <div key={category} className="space-y-3">
                      <h3 className="text-foreground font-bold border-b-2 border-border/50 pb-1 mb-3 sticky top-0 bg-card text-card-foreground z-10 py-2">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryServices.map((service) => (
                          <button
                            key={service.id}
                            onClick={() => setSelectedService(service)}
                            className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                              selectedService?.id === service.id
                                ? "border-primary bg-secondary/50 shadow-md transform scale-[1.02]"
                                : "border-border hover:border-primary/50 hover:shadow-sm"
                            }`}
                          >
                            <h3 className="font-semibold text-foreground mb-1">{service.name}</h3>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {service.duration} min</span>
                              <span className="font-bold text-primary">${service.price.toLocaleString('es-AR')}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Addons */}
          {currentStep === 2 && (
            <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner">
                  <PlusSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Title level={2} className="!mb-0">Agregá Extras</Title>
                  <p className="text-sm text-primary mt-1">Seleccioná opciones adicionales si las necesitás (Opcional)</p>
                </div>
              </div>

              {isLoadingAddons ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                </div>
              ) : addons.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80 text-center">
                  <p className="font-medium text-muted-foreground">No hay adicionales disponibles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {addons.map((addon) => {
                    const isSelected = selectedAddons.find(a => a.id === addon.id);
                    return (
                      <button
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-secondary/50 shadow-sm"
                            : "border-border hover:border-primary/50 hover:bg-secondary/50"
                        }`}
                      >
                        <div>
                          <h3 className="font-bold text-foreground text-lg flex items-center gap-2">
                            {addon.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm mt-1">
                            <span className="text-primary font-semibold">+${addon.price.toLocaleString('es-AR')}</span>
                            <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3"/> +{addon.duration} min</span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected ? "bg-primary border-primary text-white" : "border-gray-300"
                        }`}>
                          {isSelected && <CheckCircle className="w-4 h-4" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {currentStep === 3 && (
            <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <Title level={2} className="!mb-0">Elegí Fecha y Hora</Title>
                  <p className="text-sm text-primary mt-1">Calculamos {totalDuration} minutos exactos para tu turno</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Días Disponibles</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {generateDates().map((date, index) => {
                      const dateStr = date.toISOString().split("T")[0];
                      return (
                        <button
                          key={index}
                          onClick={() => { setSelectedDate(dateStr); setSelectedTime(""); }}
                          className={`p-3 rounded-lg border-2 text-center transition-all text-sm capitalize cursor-pointer ${
                            selectedDate === dateStr
                              ? "border-primary bg-primary text-white font-bold shadow-sm"
                              : "border-border text-foreground hover:border-primary/50"
                          }`}
                        >
                          {formatDate(date)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <h3 className="font-semibold text-foreground mb-3">
                      Horarios Disponibles
                    </h3>
                    
                    {isLoadingTimes ? (
                      <div className="py-8 flex flex-col items-center justify-center text-primary/80">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm">Buscando lugares...</span>
                      </div>
                    ) : availableTimes.length === 0 ? (
                      <div className="py-8 text-center bg-gray-50 border border-gray-200 rounded-xl text-gray-500 font-medium">
                        No hay horarios disponibles para esta fecha con el tiempo requerido ({totalDuration} min).
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {availableTimes.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 rounded-lg border-2 text-center transition-all text-sm cursor-pointer ${
                              selectedTime === time
                                ? "border-primary bg-secondary/50 text-foreground font-bold shadow-sm"
                                : "border-border text-gray-700 hover:border-primary/50 hover:bg-secondary/30"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Select Professional */}
          {currentStep === 4 && (
            <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <Title level={2} className="!mb-0">Elegí la Profesional / Barbero</Title>
              </div>

              {isLoadingProfessionals ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                </div>
              ) : professionals.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-primary/80 text-center">
                  <p className="font-medium text-muted-foreground">No hay profesionales disponibles en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {professionals.map((professional) => (
                    <button
                    key={professional.id}
                    onClick={() => setSelectedProfessional(professional)}
                    className={`p-5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      selectedProfessional?.id === professional.id
                        ? "border-primary bg-secondary/50 shadow-md transform scale-[1.02]"
                        : "border-border hover:border-primary/50 hover:shadow-sm"
                    }`}
                  >
                      <h3 className="font-bold text-foreground mb-1 text-lg">
                        {professional.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{professional.specialty}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review & Confirm */}
          {currentStep === 5 && (
            <div className="flex-grow animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-inner">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <Title level={2} className="!mb-0">Completá tus Datos</Title>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Resumen del turno */}
                <div className="space-y-4">
                  <div className="p-4 border border-border bg-card text-card-foreground shadow-sm rounded-xl">
                    <div className="flex justify-between items-start border-b border-border/50 pb-3 mb-3">
                      <div>
                        <div className="text-sm text-muted-foreground font-medium mb-1">Servicio Base</div>
                        <div className="font-bold text-foreground text-lg">{selectedService?.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{selectedService?.duration} min</div>
                        <div className="font-bold text-primary">${selectedService?.price.toLocaleString('es-AR')}</div>
                      </div>
                    </div>
                    
                    {selectedAddons.length > 0 && (
                      <div className="border-b border-border/50 pb-3 mb-3">
                        <div className="text-sm text-muted-foreground font-medium mb-2">Adicionales Elegidos</div>
                        <div className="space-y-2">
                          {selectedAddons.map(addon => (
                            <div key={addon.id} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 flex items-center gap-1"><Plus className="w-3 h-3 text-muted-foreground/60"/> {addon.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-500 text-xs">+{addon.duration} min</span>
                                <span className="font-medium text-primary">+${addon.price.toLocaleString('es-AR')}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-foreground uppercase text-sm">Total Estimado</span>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-medium mb-0.5">{totalDuration} min aprox</div>
                        <div className="font-black text-muted-foreground text-xl">${totalPrice.toLocaleString('es-AR')}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Fecha y Hora</div>
                      <div className="font-semibold text-foreground capitalize">
                        {selectedDate && (() => {
                          const d = new Date(`${selectedDate}T${selectedTime}:00`);
                          return d.toLocaleDateString("es-AR", { weekday: "short", day: "numeric", month: "short" });
                        })()}
                      </div>
                      <div className="text-primary font-bold mt-1">{selectedTime} hs</div>
                    </div>

                    <div className="p-4 border border-border bg-secondary/50 rounded-xl">
                      <div className="text-sm text-muted-foreground mb-1">Profesional / Barbero</div>
                      <div className="font-semibold text-foreground">{selectedProfessional?.name}</div>
                    </div>
                  </div>
                </div>

                {/* Formulario de Contacto */}
                <div className="space-y-4 bg-card text-card-foreground p-5 border border-border rounded-xl shadow-sm">
                  <h3 className="font-bold text-foreground border-b border-border/50 pb-2">Tus datos de contacto</h3>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Nombre Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserCircle className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Ej. Sofía Martínez"
                        className="block w-full pl-10 pr-3 py-2.5 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Teléfono (WhatsApp)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-muted-foreground/60" />
                      </div>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="Ej. 299 123 4567"
                        className="block w-full pl-10 pr-3 py-2.5 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/20 border border-border rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      Completar vía WhatsApp
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Al hacer clic, <strong>guardaremos tu turno en el sistema</strong> y se abrirá WhatsApp para que nos confirmes la reserva.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleWhatsAppBooking}
                disabled={!canProceed() || isSubmitting}
                className="w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Procesando Reserva...</>
                ) : (
                  <><MessageCircle className="w-5 h-5" /> Agendar por WhatsApp</>
                )}
              </Button>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Atrás
            </Button>

            {currentStep < 5 && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className={!canProceed() ? "opacity-50 cursor-not-allowed" : ""}
              >
                Siguiente
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}