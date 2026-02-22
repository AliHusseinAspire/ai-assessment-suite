import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding EventFlow database...');

  // Clean existing data
  await prisma.activity.deleteMany();
  await prisma.invitation.deleteMany();
  await prisma.rsvp.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@eventflow.dev',
      name: 'Alice Johnson',
      role: 'OWNER',
      supabaseId: 'evt-seed-alice-001',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@eventflow.dev',
      name: 'Bob Smith',
      role: 'MEMBER',
      supabaseId: 'evt-seed-bob-002',
    },
  });

  const carol = await prisma.user.create({
    data: {
      email: 'carol@eventflow.dev',
      name: 'Carol Williams',
      role: 'GUEST',
      supabaseId: 'evt-seed-carol-003',
    },
  });

  console.log('Created 3 users');

  // Helper to create dates relative to now
  const now = new Date();
  function daysFromNow(days: number, hours = 9, minutes = 0): Date {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    d.setHours(hours, minutes, 0, 0);
    return d;
  }

  // Create events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'Team Weekly Standup',
        description: 'Weekly sync to discuss progress, blockers, and plans for the week.',
        location: 'Conference Room A',
        startDate: daysFromNow(1, 9, 0),
        endDate: daysFromNow(1, 9, 30),
        status: 'UPCOMING',
        color: '#0d9488',
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Product Demo',
        description: 'Showcasing the latest features to stakeholders.',
        location: 'Main Auditorium',
        startDate: daysFromNow(2, 14, 0),
        endDate: daysFromNow(2, 15, 30),
        status: 'UPCOMING',
        color: '#2563eb',
        maxAttendees: 50,
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Sprint Planning',
        description: 'Plan the upcoming sprint goals and task assignments.',
        location: 'Room 301',
        startDate: daysFromNow(3, 10, 0),
        endDate: daysFromNow(3, 12, 0),
        status: 'UPCOMING',
        color: '#059669',
        ownerId: bob.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Lunch & Learn: AI in Scheduling',
        description: 'An informal session exploring how AI can improve event scheduling workflows.',
        location: 'Cafeteria',
        startDate: daysFromNow(4, 12, 0),
        endDate: daysFromNow(4, 13, 0),
        status: 'UPCOMING',
        color: '#7c3aed',
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Design Review',
        description: 'Review mockups and design decisions for the new dashboard.',
        location: 'Design Lab',
        startDate: daysFromNow(5, 15, 0),
        endDate: daysFromNow(5, 16, 0),
        status: 'UPCOMING',
        color: '#db2777',
        ownerId: bob.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Company All-Hands',
        description: 'Quarterly company-wide meeting with leadership updates.',
        location: 'Virtual - Zoom',
        startDate: daysFromNow(7, 10, 0),
        endDate: daysFromNow(7, 11, 30),
        status: 'UPCOMING',
        color: '#0d9488',
        maxAttendees: 200,
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Code Review Session',
        description: 'Collaborative code review of recent pull requests.',
        location: 'Room 202',
        startDate: daysFromNow(-1, 14, 0),
        endDate: daysFromNow(-1, 15, 0),
        status: 'PAST',
        color: '#ea580c',
        ownerId: bob.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Client Meeting - Acme Corp',
        description: 'Progress update and feedback session with the Acme team.',
        location: 'Meeting Room B',
        startDate: daysFromNow(-3, 11, 0),
        endDate: daysFromNow(-3, 12, 0),
        status: 'PAST',
        color: '#ca8a04',
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Team Building Event',
        description: 'Fun team activity to build camaraderie and collaboration.',
        location: 'City Park',
        startDate: daysFromNow(10, 9, 0),
        endDate: daysFromNow(10, 17, 0),
        allDay: true,
        status: 'UPCOMING',
        color: '#059669',
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Cancelled: Old Workshop',
        description: 'This workshop was cancelled due to scheduling conflicts.',
        location: 'Room 101',
        startDate: daysFromNow(-7, 9, 0),
        endDate: daysFromNow(-7, 12, 0),
        status: 'CANCELLED',
        color: '#dc2626',
        ownerId: bob.id,
      },
    }),
    prisma.event.create({
      data: {
        title: '1:1 with Manager',
        description: 'Regular one-on-one sync.',
        location: 'Manager Office',
        startDate: daysFromNow(2, 10, 0),
        endDate: daysFromNow(2, 10, 30),
        status: 'UPCOMING',
        color: '#0d9488',
        ownerId: alice.id,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Release Retrospective',
        description: 'Look back at the last release cycle and identify improvements.',
        location: 'Conference Room C',
        startDate: daysFromNow(6, 15, 0),
        endDate: daysFromNow(6, 16, 30),
        status: 'UPCOMING',
        color: '#7c3aed',
        ownerId: bob.id,
      },
    }),
  ]);

  console.log(`Created ${events.length} events`);

  // Create RSVPs
  const rsvps = await Promise.all([
    // Alice attending her own events
    prisma.rsvp.create({ data: { userId: alice.id, eventId: events[0].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: alice.id, eventId: events[1].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: alice.id, eventId: events[3].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: alice.id, eventId: events[5].id, status: 'ATTENDING' } }),
    // Bob attending various events
    prisma.rsvp.create({ data: { userId: bob.id, eventId: events[0].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: bob.id, eventId: events[1].id, status: 'MAYBE' } }),
    prisma.rsvp.create({ data: { userId: bob.id, eventId: events[2].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: bob.id, eventId: events[4].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: bob.id, eventId: events[5].id, status: 'ATTENDING' } }),
    // Carol RSVPs
    prisma.rsvp.create({ data: { userId: carol.id, eventId: events[0].id, status: 'ATTENDING' } }),
    prisma.rsvp.create({ data: { userId: carol.id, eventId: events[1].id, status: 'DECLINED' } }),
    prisma.rsvp.create({ data: { userId: carol.id, eventId: events[3].id, status: 'MAYBE' } }),
    prisma.rsvp.create({ data: { userId: carol.id, eventId: events[5].id, status: 'PENDING' } }),
  ]);

  console.log(`Created ${rsvps.length} RSVPs`);

  // Create invitations
  const invitations = await Promise.all([
    prisma.invitation.create({
      data: {
        senderId: alice.id,
        recipientId: bob.id,
        eventId: events[3].id,
        status: 'ACCEPTED',
        message: 'Would love to have you join the Lunch & Learn!',
      },
    }),
    prisma.invitation.create({
      data: {
        senderId: alice.id,
        recipientId: carol.id,
        eventId: events[5].id,
        status: 'PENDING',
        message: 'Please join our all-hands meeting.',
      },
    }),
    prisma.invitation.create({
      data: {
        senderId: bob.id,
        recipientId: carol.id,
        eventId: events[2].id,
        status: 'PENDING',
        message: 'Sprint planning - your input is valuable!',
      },
    }),
    prisma.invitation.create({
      data: {
        senderId: bob.id,
        recipientId: alice.id,
        eventId: events[4].id,
        status: 'ACCEPTED',
      },
    }),
    prisma.invitation.create({
      data: {
        senderId: alice.id,
        recipientId: bob.id,
        eventId: events[8].id,
        status: 'PENDING',
        message: 'Team building day!',
      },
    }),
  ]);

  console.log(`Created ${invitations.length} invitations`);

  // Create activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: { action: 'Created event', userId: alice.id, eventId: events[0].id },
    }),
    prisma.activity.create({
      data: { action: 'Created event', userId: alice.id, eventId: events[1].id },
    }),
    prisma.activity.create({
      data: { action: 'Created event', userId: bob.id, eventId: events[2].id },
    }),
    prisma.activity.create({
      data: { action: 'Invited Bob Smith', userId: alice.id, eventId: events[3].id },
    }),
    prisma.activity.create({
      data: { action: 'RSVP: attending', userId: bob.id, eventId: events[0].id },
    }),
    prisma.activity.create({
      data: { action: 'RSVP: maybe', userId: carol.id, eventId: events[3].id },
    }),
    prisma.activity.create({
      data: { action: 'Cancelled event', userId: bob.id, eventId: events[9].id },
    }),
    prisma.activity.create({
      data: { action: 'Created event', userId: alice.id, eventId: events[8].id },
    }),
  ]);

  console.log(`Created ${activities.length} activities`);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
