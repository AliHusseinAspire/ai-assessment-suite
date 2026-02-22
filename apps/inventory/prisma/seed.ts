import { PrismaClient, Role, ItemStatus } from './generated/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Seeding database...');

  // Create users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@stocksmart.app' },
    update: {},
    create: {
      email: 'admin@stocksmart.app',
      name: 'Admin User',
      role: Role.ADMIN,
      supabaseId: 'admin-supabase-id-placeholder',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@stocksmart.app' },
    update: {},
    create: {
      email: 'manager@stocksmart.app',
      name: 'Sarah Manager',
      role: Role.MANAGER,
      supabaseId: 'manager-supabase-id-placeholder',
    },
  });

  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@stocksmart.app' },
    update: {},
    create: {
      email: 'viewer@stocksmart.app',
      name: 'John Viewer',
      role: Role.VIEWER,
      supabaseId: 'viewer-supabase-id-placeholder',
    },
  });

  console.log('Created users:', { admin: admin.id, manager: manager.id, viewer: viewer.id });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Electronics' },
      update: {},
      create: {
        name: 'Electronics',
        description: 'Electronic devices, components, and accessories',
        color: '#3b82f6',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Office Supplies' },
      update: {},
      create: {
        name: 'Office Supplies',
        description: 'Paper, pens, and other office essentials',
        color: '#10b981',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Furniture' },
      update: {},
      create: {
        name: 'Furniture',
        description: 'Desks, chairs, and office furniture',
        color: '#f59e0b',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Safety Equipment' },
      update: {},
      create: {
        name: 'Safety Equipment',
        description: 'PPE, fire safety, and first aid supplies',
        color: '#ef4444',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Cleaning Supplies' },
      update: {},
      create: {
        name: 'Cleaning Supplies',
        description: 'Cleaning chemicals, tools, and janitorial supplies',
        color: '#8b5cf6',
      },
    }),
  ]);

  console.log('Created categories:', categories.map((c) => c.name));

  const [electronics, office, furniture, safety, cleaning] = categories;

  // Create inventory items
  const items = [
    { name: 'MacBook Pro 16"', description: 'Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD', sku: 'ELEC-001', quantity: 25, price: 2499.99, status: ItemStatus.IN_STOCK, supplier: 'Apple Inc.', minStock: 5, maxStock: 50, categoryId: electronics.id },
    { name: 'Dell Monitor 27"', description: 'Dell UltraSharp 27" 4K USB-C Hub Monitor', sku: 'ELEC-002', quantity: 42, price: 619.99, status: ItemStatus.IN_STOCK, supplier: 'Dell Technologies', minStock: 10, maxStock: 80, categoryId: electronics.id },
    { name: 'Wireless Keyboard', description: 'Logitech MX Keys Advanced Wireless Keyboard', sku: 'ELEC-003', quantity: 8, price: 119.99, status: ItemStatus.LOW_STOCK, supplier: 'Logitech', minStock: 15, maxStock: 100, categoryId: electronics.id },
    { name: 'USB-C Hub', description: '7-in-1 USB-C Hub with HDMI, USB 3.0, SD Card', sku: 'ELEC-004', quantity: 3, price: 49.99, status: ItemStatus.LOW_STOCK, supplier: 'Anker', minStock: 20, maxStock: 150, categoryId: electronics.id },
    { name: 'Webcam HD', description: 'Logitech C920 HD Pro Webcam', sku: 'ELEC-005', quantity: 0, price: 79.99, status: ItemStatus.ORDERED, supplier: 'Logitech', minStock: 10, maxStock: 60, categoryId: electronics.id },
    { name: 'Ethernet Cable Cat6', description: '50ft Cat6 Ethernet Cable - Blue', sku: 'ELEC-006', quantity: 150, price: 12.99, status: ItemStatus.IN_STOCK, supplier: 'Cable Matters', minStock: 30, maxStock: 200, categoryId: electronics.id },
    { name: 'A4 Copy Paper', description: 'Premium white A4 copy paper, 500 sheets per ream', sku: 'OFFC-001', quantity: 200, price: 8.99, status: ItemStatus.IN_STOCK, supplier: 'Staples', minStock: 50, maxStock: 500, categoryId: office.id },
    { name: 'Ballpoint Pens (Box)', description: 'BIC Cristal ballpoint pens, 12-pack, blue ink', sku: 'OFFC-002', quantity: 45, price: 5.49, status: ItemStatus.IN_STOCK, supplier: 'BIC', minStock: 20, maxStock: 200, categoryId: office.id },
    { name: 'Sticky Notes', description: 'Post-it Super Sticky Notes, 3x3, 12 pads', sku: 'OFFC-003', quantity: 12, price: 14.99, status: ItemStatus.LOW_STOCK, supplier: '3M', minStock: 15, maxStock: 100, categoryId: office.id },
    { name: 'Stapler', description: 'Swingline Desktop Stapler, 20-sheet capacity', sku: 'OFFC-004', quantity: 0, price: 12.99, status: ItemStatus.DISCONTINUED, supplier: 'Swingline', minStock: 5, maxStock: 30, categoryId: office.id },
    { name: 'File Folders', description: 'Manila file folders, letter size, 100-pack', sku: 'OFFC-005', quantity: 67, price: 19.99, status: ItemStatus.IN_STOCK, supplier: 'Staples', minStock: 20, maxStock: 150, categoryId: office.id },
    { name: 'Standing Desk', description: 'Electric sit-stand desk, 60" x 30", programmable heights', sku: 'FURN-001', quantity: 10, price: 699.99, status: ItemStatus.IN_STOCK, supplier: 'FlexiSpot', minStock: 3, maxStock: 20, categoryId: furniture.id },
    { name: 'Ergonomic Chair', description: 'Herman Miller Aeron Chair, fully loaded, size B', sku: 'FURN-002', quantity: 2, price: 1395.00, status: ItemStatus.LOW_STOCK, supplier: 'Herman Miller', minStock: 5, maxStock: 25, categoryId: furniture.id },
    { name: 'Bookshelf', description: '5-tier bookshelf, walnut finish, 72"H x 36"W', sku: 'FURN-003', quantity: 15, price: 189.99, status: ItemStatus.IN_STOCK, supplier: 'IKEA', minStock: 5, maxStock: 30, categoryId: furniture.id },
    { name: 'Filing Cabinet', description: '3-drawer lateral filing cabinet, black steel', sku: 'FURN-004', quantity: 0, price: 299.99, status: ItemStatus.ORDERED, supplier: 'HON', minStock: 3, maxStock: 15, categoryId: furniture.id },
    { name: 'Conference Table', description: '8-person conference table, oval, cherry finish', sku: 'FURN-005', quantity: 4, price: 1299.99, status: ItemStatus.IN_STOCK, supplier: 'Steelcase', minStock: 1, maxStock: 5, categoryId: furniture.id },
    { name: 'Safety Goggles', description: 'Anti-fog safety goggles, ANSI Z87.1 certified', sku: 'SAFE-001', quantity: 75, price: 8.99, status: ItemStatus.IN_STOCK, supplier: '3M', minStock: 20, maxStock: 200, categoryId: safety.id },
    { name: 'First Aid Kit', description: 'Comprehensive first aid kit, 299-piece, OSHA compliant', sku: 'SAFE-002', quantity: 5, price: 34.99, status: ItemStatus.LOW_STOCK, supplier: 'Johnson & Johnson', minStock: 8, maxStock: 30, categoryId: safety.id },
    { name: 'Fire Extinguisher', description: 'ABC dry chemical fire extinguisher, 5lb', sku: 'SAFE-003', quantity: 12, price: 49.99, status: ItemStatus.IN_STOCK, supplier: 'Kidde', minStock: 6, maxStock: 25, categoryId: safety.id },
    { name: 'Hard Hat', description: 'Type I hard hat, ratchet suspension, hi-vis yellow', sku: 'SAFE-004', quantity: 30, price: 19.99, status: ItemStatus.IN_STOCK, supplier: 'MSA Safety', minStock: 10, maxStock: 80, categoryId: safety.id },
    { name: 'Disinfectant Wipes', description: 'Clorox disinfecting wipes, 75-count canister', sku: 'CLEN-001', quantity: 48, price: 6.99, status: ItemStatus.IN_STOCK, supplier: 'Clorox', minStock: 20, maxStock: 150, categoryId: cleaning.id },
    { name: 'Floor Cleaner', description: 'All-purpose floor cleaner concentrate, 1 gallon', sku: 'CLEN-002', quantity: 7, price: 24.99, status: ItemStatus.LOW_STOCK, supplier: 'Diversey', minStock: 10, maxStock: 40, categoryId: cleaning.id },
    { name: 'Trash Bags (Box)', description: 'Heavy-duty 33-gallon trash bags, 100-count', sku: 'CLEN-003', quantity: 22, price: 18.99, status: ItemStatus.IN_STOCK, supplier: 'Glad', minStock: 10, maxStock: 60, categoryId: cleaning.id },
    { name: 'Microfiber Cloths', description: 'Microfiber cleaning cloths, 12-pack, assorted colors', sku: 'CLEN-004', quantity: 35, price: 11.99, status: ItemStatus.IN_STOCK, supplier: 'AmazonBasics', minStock: 15, maxStock: 100, categoryId: cleaning.id },
    { name: 'Hand Sanitizer', description: 'Purell Advanced Hand Sanitizer, 8oz pump bottle', sku: 'CLEN-005', quantity: 60, price: 4.99, status: ItemStatus.IN_STOCK, supplier: 'GOJO Industries', minStock: 25, maxStock: 200, categoryId: cleaning.id },
  ];

  for (const item of items) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: item,
    });
  }

  console.log(`Created ${items.length} inventory items`);

  // Create sample activities
  const allItems = await prisma.inventoryItem.findMany({ take: 10 });
  const activities = [
    { action: 'CREATED', details: { message: 'Item created during initial setup' }, userId: admin.id, itemId: allItems[0]?.id },
    { action: 'UPDATED', details: { field: 'quantity', from: 20, to: 25 }, userId: manager.id, itemId: allItems[0]?.id },
    { action: 'UPDATED', details: { field: 'status', from: 'ORDERED', to: 'IN_STOCK' }, userId: manager.id, itemId: allItems[1]?.id },
    { action: 'CREATED', details: { message: 'New item added to inventory' }, userId: manager.id, itemId: allItems[5]?.id },
    { action: 'STATUS_CHANGE', details: { from: 'IN_STOCK', to: 'LOW_STOCK' }, userId: admin.id, itemId: allItems[2]?.id },
    { action: 'UPDATED', details: { field: 'price', from: 599.99, to: 619.99 }, userId: admin.id, itemId: allItems[1]?.id },
    { action: 'DELETED', details: { itemName: 'Old Scanner', reason: 'Obsolete' }, userId: admin.id, itemId: null },
    { action: 'CREATED', details: { message: 'Bulk import - 5 items' }, userId: admin.id, itemId: allItems[8]?.id },
  ];

  for (const activity of activities) {
    if (activity.itemId || activity.action === 'DELETED') {
      await prisma.activity.create({ data: activity });
    }
  }

  console.log(`Created ${activities.length} activity records`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
