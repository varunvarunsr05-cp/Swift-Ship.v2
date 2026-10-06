require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Service = require('../models/Service');
const Shipment = require('../models/Shipment');
const TrackingUpdate = require('../models/TrackingUpdate');
const Gallery = require('../models/Gallery');
const generateTrackingNumber = require('./generateTrackingNumber');
const dns = require('dns');
dns.setServers(['1.1.1.1', '0.0.0.0']);

const services = [
  { name: 'Standard Delivery', description: 'Reliable and cost-effective delivery across India.', deliveryTime: '3 - 5 business days', estimatedDays: 5, basePrice: 60, weightLimit: 20, icon: 'package', status: 'active', isActive: true },
  { name: 'Express Delivery', description: 'Fast and priority delivery for urgent shipments.', deliveryTime: '1 - 2 business days', estimatedDays: 2, basePrice: 150, weightLimit: 15, icon: 'zap', status: 'active', isActive: true },
  { name: 'International Shipping', description: 'Global delivery to 200+ countries.', deliveryTime: '5 - 10 business days', estimatedDays: 10, basePrice: 800, weightLimit: 30, icon: 'plane', status: 'active', isActive: true },
  { name: 'Freight & Cargo', description: 'Bulk and heavy shipment solutions.', deliveryTime: '2 - 7 business days', estimatedDays: 7, basePrice: 1200, weightLimit: 500, icon: 'truck', status: 'active', isActive: true },
  { name: 'Document Delivery', description: 'Secure delivery of important documents.', deliveryTime: '1 - 3 business days', estimatedDays: 3, basePrice: 40, weightLimit: 2, icon: 'file', status: 'active', isActive: true },
  { name: 'Insurance Coverage', description: 'Shipment insurance for added security.', deliveryTime: 'N/A', estimatedDays: 0, basePrice: 25, weightLimit: 0, icon: 'shield', status: 'inactive', isActive: false },
  { name: 'Return Logistics', description: 'Hassle-free return shipping for e-commerce.', deliveryTime: '3 - 5 business days', estimatedDays: 5, basePrice: 55, weightLimit: 20, icon: 'undo', status: 'under_review', isActive: false },
  { name: 'Same Day Delivery', description: 'Delivery within the same day (in select cities).', deliveryTime: 'Same day', estimatedDays: 1, basePrice: 220, weightLimit: 10, icon: 'pin', status: 'active', isActive: true },
];

const indianCities = [
  ['Mumbai', 'MH'], ['Delhi', 'DL'], ['Bengaluru', 'KA'], ['Chennai', 'TN'], ['Hyderabad', 'TG'],
  ['Pune', 'MH'], ['Kochi', 'KL'], ['Ahmedabad', 'GJ'], ['Jaipur', 'RJ'], ['Lucknow', 'UP'],
];

const names = ['Rahul Mehta', 'Priya Sharma', 'Amit Kumar', 'Sneha Reddy', 'Vikram Singh', 'Neha Patel', 'Arjun Nair', 'Kavya Iyer', 'Rohit Verma', 'Pooja Nair'];

const statuses = ['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'];

const run = async () => {
  await connectDB();
  console.log('Seeding database...');

  await Promise.all([
    User.deleteMany({}),
    Service.deleteMany({}),
    Shipment.deleteMany({}),
    TrackingUpdate.deleteMany({}),
    Gallery.deleteMany({}),
  ]);

  // const admin = await User.create({
  //   name: 'SwiftShip Admin',
  //   email: 'admin@swiftship.com',
  //   phone: '+91 9876543210',
  //   password: 'Admin@123',
  //   role: 'admin',
  //   city: 'Bengaluru',
  //   state: 'Karnataka',
  // });

  // const customer = await User.create({
  //   name: 'Varun SR',
  //   email: 'varun@example.com',
  //   phone: '+91 9876500000',
  //   password: 'Customer@123',
  //   role: 'customer',
  //   address: '123 Main St',
  //   city: 'Kochi',
  //   state: 'Kerala',
  //   pincode: '682001',
  // });

  const createdServices = await Service.insertMany(services);

  const shipmentDocs = [];
  for (let i = 0; i < 24; i += 1) {
    const [city, state] = indianCities[i % indianCities.length];
    const service = createdServices[i % createdServices.length];
    const status = statuses[i % statuses.length];
    const daysAgo = i;
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    shipmentDocs.push({
      userId: customer._id,
      trackingNumber: generateTrackingNumber(),
      serviceId: service._id,
      sender: { name: 'Varun SR', phone: '+91 9876500000', address: '123 Main St', city: 'Kochi', state: 'Kerala', postalCode: '682001', country: 'India' },
      receiver: { name: names[i % names.length], phone: '+91 98765000' + (10 + i), address: '456 Park Ave', city, state, postalCode: '560001', country: 'India' },
      packageType: 'Parcel',
      weight: Math.round((Math.random() * 10 + 0.5) * 10) / 10,
      dimensions: { length: 20, width: 15, height: 10 },
      pickupDate: createdAt,
      preferredTimeSlot: '10:00 AM - 1:00 PM',
      status,
      currentLocation: city,
      createdAt,
      updatedAt: createdAt,
    });
  }

  const createdShipments = await Shipment.insertMany(shipmentDocs);

  const trackingDocs = [];
  createdShipments.forEach((s) => {
    trackingDocs.push({ shipmentId: s._id, status: 'booked', location: s.sender.city, description: 'Shipment booked and awaiting pickup.', timestamp: s.createdAt });
    if (s.status !== 'booked') {
      trackingDocs.push({ shipmentId: s._id, status: 'picked_up', location: s.sender.city, description: 'Package received at our facility.', timestamp: s.createdAt });
    }
    if (['in_transit', 'out_for_delivery', 'delivered'].includes(s.status)) {
      trackingDocs.push({ shipmentId: s._id, status: 'in_transit', location: 'Regional Hub', description: 'Package is on the way to destination.', timestamp: s.createdAt });
    }
    if (['out_for_delivery', 'delivered'].includes(s.status)) {
      trackingDocs.push({ shipmentId: s._id, status: 'out_for_delivery', location: s.receiver.city, description: 'Your package is out for delivery.', timestamp: s.createdAt });
    }
    if (s.status === 'delivered') {
      trackingDocs.push({ shipmentId: s._id, status: 'delivered', location: s.receiver.city, description: 'Package delivered successfully.', timestamp: s.createdAt });
    }
    if (s.status === 'cancelled') {
      trackingDocs.push({ shipmentId: s._id, status: 'cancelled', location: s.sender.city, description: 'Shipment was cancelled.', timestamp: s.createdAt });
    }
  });
  await TrackingUpdate.insertMany(trackingDocs);

  await Gallery.insertMany([
    { title: 'Global Delivery Without Limits', url: 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=1200', type: 'banner', caption: 'Fast. Reliable. Everywhere.', status: 'active', displayOrder: 1, uploadedBy: admin._id },
    { title: 'Your Package Our Priority', url: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=1200', type: 'banner', caption: 'Safe. Secure. On Time.', status: 'active', displayOrder: 2, uploadedBy: admin._id },
    { title: 'Connecting People & Possibilities', url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200', type: 'banner', caption: 'Across Cities. Across the World.', status: 'scheduled', displayOrder: 3, uploadedBy: admin._id },
  ]);

  console.log('Seed complete.');
  console.log('Admin login: admin@swiftship.com / Admin@123');
  console.log('Customer login: varun@example.com / Customer@123');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
