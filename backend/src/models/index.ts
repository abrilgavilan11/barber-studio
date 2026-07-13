import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}
const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, default: "cliente" }
}, { timestamps: true });
export const UserModel = mongoose.model<IUser>('User', UserSchema);

export interface IClient extends Document {
  name: string;
  phone: string;
  isVIP: boolean;
  userId?: mongoose.Types.ObjectId;
}
const ClientSchema = new Schema<IClient>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  isVIP: { type: Boolean, default: false },
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true }
});
export const ClientModel = mongoose.model<IClient>('Client', ClientSchema);

export interface ICategory extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });
export const CategoryModel = mongoose.model<ICategory>('Category', CategorySchema);

export interface IService extends Document {
  name: string;
  category: mongoose.Types.ObjectId;
  duration: number;
  price: number;
  description?: string;
  image?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  status: { type: String, default: "activo" }
}, { timestamps: true });
export const ServiceModel = mongoose.model<IService>('Service', ServiceSchema);

export interface IProfessional extends Document {
  name: string;
  specialty: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
const ProfessionalSchema = new Schema<IProfessional>({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  status: { type: String, default: "activo" }
}, { timestamps: true });
export const ProfessionalModel = mongoose.model<IProfessional>('Professional', ProfessionalSchema);

export interface IAddon extends Document {
  name: string;
  price: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}
const AddonSchema = new Schema<IAddon>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }
}, { timestamps: true });
export const AddonModel = mongoose.model<IAddon>('Addon', AddonSchema);

export interface ISetting extends Document {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });
export const SettingModel = mongoose.model<ISetting>('Setting', SettingSchema);

export interface IAppointment extends Document {
  date: Date;
  status: string;
  client: mongoose.Types.ObjectId;
  professional: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
  addons: mongoose.Types.ObjectId[];
  totalDuration: number;
  totalPrice: number;
  createdAt: Date;
}
const AppointmentSchema = new Schema<IAppointment>({
  date: { type: Date, required: true },
  status: { type: String, default: "pendiente" },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  professional: { type: Schema.Types.ObjectId, ref: 'Professional', required: true },
  service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  addons: [{ type: Schema.Types.ObjectId, ref: 'Addon' }],
  totalDuration: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 }
}, { timestamps: true });
export const AppointmentModel = mongoose.model<IAppointment>('Appointment', AppointmentSchema);
