import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import {
  UserModel, ClientModel, CategoryModel, ServiceModel,
  AddonModel, SettingModel, AppointmentModel, ProfessionalModel
} from "./models/index.js";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/barber-studio";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("🟢 Conectado a MongoDB"))
  .catch(err => console.error("🔴 Error conectando a MongoDB:", err));

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "¡El servidor de Barber Studio (MongoDB) está corriendo perfecto! 💈" });
});

app.get("/api/settings", async (_req: Request, res: Response) => {
  try {
    const settings = await SettingModel.find();
    const config = settings.reduce((acc: any, s) => ({ ...acc, [s.key]: s.value }), {});
    if (!config.bufferTime) config.bufferTime = "15";
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.put("/api/settings", async (req: Request, res: Response) => {
  try {
    const settings = req.body;
    for (const [key, value] of Object.entries(settings)) {
      await SettingModel.findOneAndUpdate(
        { key },
        { value: String(value) },
        { upsert: true, new: true }
      );
    }
    res.json({ message: "Guardado" });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.get("/api/addons", async (_req: Request, res: Response) => {
  try {
    const addons = await AddonModel.find().sort({ name: 1 });
    res.json(addons.map(a => ({ ...a.toObject(), id: a._id })));
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.post("/api/addons", async (req: Request, res: Response) => {
  try {
    const { name, price, duration } = req.body;
    const newAddon = await AddonModel.create({ name, price: Number(price), duration: Number(duration) });
    res.status(201).json({ ...newAddon.toObject(), id: newAddon._id });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.put("/api/addons/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, duration } = req.body;
    const updatedAddon = await AddonModel.findByIdAndUpdate(
      id,
      { name, price: Number(price), duration: Number(duration) },
      { new: true }
    );
    res.json(updatedAddon);
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.delete("/api/addons/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await AddonModel.findByIdAndDelete(id);
    res.json({ message: "Eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error" });
  }
});

app.get("/api/categories", async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find().sort({ name: 1 });
    res.json(categories.map(c => ({ ...c.toObject(), id: c._id })));
  } catch (error) {
    res.status(500).json({ error: "Hubo un problema al cargar las categorías" });
  }
});

app.post("/api/categories", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newCategory = await CategoryModel.create({ name });
    res.status(201).json({ message: "Categoría creada", data: { ...newCategory.toObject(), id: newCategory._id } });
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
});

app.put("/api/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { name }, { new: true });
    res.json({ message: "Categoría actualizada", data: updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar la categoría" });
  }
});

app.delete("/api/categories/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await CategoryModel.findByIdAndDelete(id);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar la categoría" });
  }
});

app.get("/api/professionals", async (_req: Request, res: Response) => {
  try {
    const professionals = await ProfessionalModel.find({ status: "activo" }).sort({ name: 1 });
    res.json(professionals.map(p => ({ ...p.toObject(), id: p._id })));
  } catch (error) {
    res.status(500).json({ error: "Error al cargar profesionales" });
  }
});

app.post("/api/professionals", async (req: Request, res: Response) => {
  try {
    const { name, specialty, status } = req.body;
    const newProfessional = await ProfessionalModel.create({ name, specialty, status: status || "activo" });
    res.status(201).json({ message: "Profesional creado", data: { ...newProfessional.toObject(), id: newProfessional._id } });
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el profesional" });
  }
});

app.put("/api/professionals/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, specialty, status } = req.body;
    const updatedProfessional = await ProfessionalModel.findByIdAndUpdate(
      id,
      { name, specialty, status },
      { new: true }
    );
    res.json({ message: "Profesional actualizado", data: updatedProfessional });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el profesional" });
  }
});

app.delete("/api/professionals/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ProfessionalModel.findByIdAndUpdate(id, { status: "inactivo" });
    res.json({ message: "Profesional inhabilitado" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el profesional" });
  }
});

app.get("/api/services", async (_req: Request, res: Response) => {
  try {
    const services = await ServiceModel.find().populate('category').sort({ name: 1 });
    res.json(services.map(s => {
      const doc = s.toObject();
      return { ...doc, id: doc._id, categoryId: doc.category?._id || doc.category };
    }));
  } catch (error) {
    console.error("Error en GET /api/services:", error);
    res.status(500).json({ error: "Hubo un problema al cargar los servicios" });
  }
});

app.post("/api/services", async (req: Request, res: Response) => {
  try {
    const { name, description, price, duration, categoryId, image } = req.body;

    const newService = await ServiceModel.create({
      name,
      description: description || "",
      price: Number(price),
      duration: Number(duration),
      category: categoryId,
      image: image || null
    });

    res.status(201).json({ message: "¡Servicio creado con éxito!", data: { ...newService.toObject(), id: newService._id } });
  } catch (error) {
    res.status(500).json({ error: "No se pudo crear el servicio" });
  }
});

app.put("/api/services/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, categoryId, image } = req.body;

    const updatedService = await ServiceModel.findByIdAndUpdate(id, {
      name,
      description: description || "",
      price: Number(price),
      duration: Number(duration),
      category: categoryId,
      image: image || null
    }, { new: true });
    
    res.json({ message: "Servicio actualizado", data: updatedService });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el servicio" });
  }
});

app.delete("/api/services/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ServiceModel.findByIdAndDelete(id);
    res.json({ message: "Servicio eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el servicio" });
  }
});

app.get("/api/clients", async (_req: Request, res: Response) => {
  try {
    const clients = await ClientModel.find().populate('userId').sort({ name: 1 });
    
    const filtered = clients.filter(c => {
      const user: any = c.userId;
      return !user || user.role !== 'admin';
    });
    
    res.json(filtered.map(c => ({ ...c.toObject(), id: c._id })));
  } catch (error) {
    res.status(500).json({ error: "Hubo un problema al cargar los clientes" });
  }
});

app.post("/api/clients", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, phone, isVIP, userId } = req.body;

    if (userId) {
      const existingClient = await ClientModel.findOne({ userId });
      if (existingClient) {
        existingClient.name = name;
        existingClient.phone = phone;
        await existingClient.save();
        return res.status(200).json({ message: "cliente recuperado", data: { ...existingClient.toObject(), id: existingClient._id } });
      }
    }

    if (name && phone) {
      const existingClient = await ClientModel.findOne({ name, phone });
      if (existingClient) {
        return res.status(200).json({ message: "cliente existente recuperado", data: { ...existingClient.toObject(), id: existingClient._id } });
      }
    }

    const newClient = await ClientModel.create({
      name, 
      phone, 
      isVIP: Boolean(isVIP),
      userId: userId || undefined
    });
    res.status(201).json({ message: "¡cliente registrado con éxito!", data: { ...newClient.toObject(), id: newClient._id } });
  } catch (error) {
    res.status(500).json({ error: "No se pudo registrar al cliente" });
  }
});

app.put("/api/clients/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, isVIP } = req.body;
    const updatedClient = await ClientModel.findByIdAndUpdate(id, { name, phone, isVIP: Boolean(isVIP) }, { new: true });
    res.json({ message: "Datos actualizados", data: updatedClient });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar al cliente" });
  }
});

app.delete("/api/clients/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ClientModel.findByIdAndDelete(id);
    res.json({ message: "cliente eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar al cliente" });
  }
});

app.get("/api/appointments", async (_req: Request, res: Response) => {
  try {
    const appointments = await AppointmentModel.find()
      .populate('client')
      .populate('service')
      .populate('addons')
      .populate('professional')
      .sort({ date: 1 });
      
    res.json(appointments.map(a => ({ ...a.toObject(), id: a._id })));
  } catch (error) {
    res.status(500).json({ error: "Hubo un problema al cargar la agenda" });
  }
});

app.post("/api/appointments", async (req: Request, res: Response): Promise<any> => {
  try {
    const { clientId, serviceId, date, status, addonIds, professionalId } = req.body;
    
    if (!professionalId) return res.status(400).json({ error: "Debe elegir un profesional" });

    const service = await ServiceModel.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    let totalDuration = service.duration;
    let totalPrice = service.price;

    if (addonIds && Array.isArray(addonIds) && addonIds.length > 0) {
      const addons = await AddonModel.find({ _id: { $in: addonIds } });
      addons.forEach(a => {
        totalDuration += a.duration;
        totalPrice += a.price;
      });
    }

    const newAppointment = await AppointmentModel.create({
      date: new Date(date),
      status: status || "pendiente",
      client: clientId,
      service: serviceId,
      addons: addonIds || [],
      professional: professionalId,
      totalDuration,
      totalPrice
    });
    
    const populated = await newAppointment.populate(['client', 'service', 'addons', 'professional']);
    res.status(201).json({ message: "¡Turno agendado con éxito!", data: { ...populated.toObject(), id: populated._id } });
  } catch (error) {
    res.status(500).json({ error: "No se pudo registrar el turno" });
  }
});

app.put("/api/appointments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedAppointment = await AppointmentModel.findByIdAndUpdate(id, { status }, { new: true })
      .populate(['client', 'service', 'addons', 'professional']);
    res.json({ message: "Estado actualizado", data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el turno" });
  }
});

app.delete("/api/appointments/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await AppointmentModel.findByIdAndDelete(id);
    res.json({ message: "Turno eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el turno" });
  }
});

app.get("/api/availability", async (req: Request, res: Response): Promise<any> => {
  try {
    const { date, duration, professionalId } = req.query;
    if (!date || !duration) return res.status(400).json({ error: "Faltan datos" });

    const reqDuration = Number(duration);
    
    const bufferSetting = await SettingModel.findOne({ key: "bufferTime" });
    const bufferTime = bufferSetting ? Number(bufferSetting.value) : 15;
    
    const totalReqTime = reqDuration + bufferTime;

    const queryDate = new Date(`${date}T00:00:00-03:00`); 
    if (isNaN(queryDate.getTime())) return res.status(400).json({ error: "Fecha inválida" });

    const nextDate = new Date(queryDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const queryParams: any = {
      date: {
        $gte: queryDate,
        $lt: nextDate
      },
      status: { $ne: "cancelado" }
    };
    
    if (professionalId) {
      queryParams.professional = professionalId;
    }

    const appointments = await AppointmentModel.find(queryParams).sort({ date: 1 });

    const slots = [];
    let current = new Date(queryDate);
    current.setHours(9, 0, 0, 0); 
    
    const endOfDay = new Date(queryDate);
    endOfDay.setHours(19, 0, 0, 0); 

    while (current < endOfDay) {
      const slotEnd = new Date(current.getTime() + totalReqTime * 60000);
      
      if (slotEnd > endOfDay) {
        break; 
      }

      let overlap = false;
      for (const app of appointments) {
        const appStart = app.date;
        const appEnd = new Date(appStart.getTime() + (app.totalDuration + bufferTime) * 60000);
        
        if (current < appEnd && slotEnd > appStart) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        slots.push(current.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }));
      }

      current = new Date(current.getTime() + 30 * 60000);
    }

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ error: "Error interno" });
  }
});

app.post("/api/auth/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userCount = await UserModel.countDocuments();
    const finalRole = userCount === 0 ? (role || "admin") : "cliente";

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
    });

    let newClient;
    if (finalRole === "cliente") {
      newClient = await ClientModel.create({
        name: name,
        phone: phone || "Sin especificar",
        userId: newUser._id
      });
    }

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      clientId: newClient?._id
    });
  } catch (error) {
    console.error("Error en POST /api/auth/register:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

app.post("/api/auth/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error("Error en POST /api/auth/login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select('name email role createdAt').sort({ createdAt: 1 });
    res.json(users.map(u => ({ ...u.toObject(), id: u._id })));
  } catch (error) {
    res.status(500).json({ error: "Error al cargar los usuarios" });
  }
});

app.put("/api/users/:id/role", async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (role !== "admin" && role !== "cliente") {
      return res.status(400).json({ error: "Rol inválido" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, { role }, { new: true }).select('name email role');
    res.json({ message: "Rol actualizado", data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "No se pudo actualizar el rol" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});