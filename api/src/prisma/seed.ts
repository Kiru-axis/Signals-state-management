import { PrismaClient, Role } from '@prisma/client';
import { bCryptHash } from 'src/common';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function seed() {
  await seedUsers();
  await seedClientLocations();
  await seedProjects();
  await seedTaskPriorities();
  await seedTaskStatus();
}

async function seedUsers() {
  await prisma.user.createMany({
    data: [
      {
        id: 'user-1',
        email: 'admin@gmail.com',
        firstname: 'Admin',
        lastname: 'Maine',
        mobile: faker.phone.number(),
        password: await bCryptHash('Pass1234.'),
        role: Role.ADMIN,
        country: 'Chad',
        gender: 'male',
      },
      {
        id: 'user-2',
        email: 'anna@gmail.com',
        firstname: 'Anna',
        lastname: 'Bakugo',
        mobile: faker.phone.number(),
        password: await bCryptHash('Pass1234.'),
        country: 'Brazil',
        gender: 'female',
      },
      {
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        mobile: faker.phone.number(),
        password: await bCryptHash('Pass1234.'),
        country: 'Iran',
        gender: faker.person.sexType(),
      },
      {
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        mobile: faker.phone.number(),
        password: await bCryptHash('Pass1234.'),
        country: 'Japan',
        gender: faker.person.sexType(),
      },
      {
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        mobile: faker.phone.number(),
        password: await bCryptHash('Pass1234.'),
        country: 'Canada',
        gender: faker.person.sexType(),
      },
    ],
  });
}

async function seedClientLocations() {
  await prisma.clientLocation.create({
    data: {
      name: faker.location.country(),
      id: 'loc-1',
    },
  });
  await prisma.clientLocation.create({
    data: {
      name: faker.location.country(),
      id: 'loc-2',
    },
  });
  await prisma.clientLocation.create({
    data: {
      name: faker.location.country(),
      id: 'loc-3',
    },
  });
  await prisma.clientLocation.create({
    data: {
      name: faker.location.country(),
      id: 'loc-4',
    },
  });
  await prisma.clientLocation.create({
    data: {
      name: faker.location.country(),
      id: 'loc-5',
    },
  });
}

async function seedProjects() {
  await prisma.project.create({
    data: {
      active: true,
      dateOfStart: faker.date.between({
        from: '2024-06-01T00:00:00:000Z',
        to: '2025-06-01T00:00:00:000Z',
      }),
      name: faker.company.name(),
      status: 'support',
      teamSize: faker.number.int({ min: 3, max: 55 }),
      ClientLocation: {
        connect: { id: 'loc-1' },
      },
    },
  });
  await prisma.project.create({
    data: {
      active: true,
      dateOfStart: faker.date.between({
        from: '2024-06-01T00:00:00:000Z',
        to: '2025-06-01T00:00:00:000Z',
      }),
      name: faker.company.name(),
      status: 'in force',
      teamSize: 12,
      ClientLocation: {
        connect: { id: 'loc-1' },
      },
    },
  });
  await prisma.project.create({
    data: {
      active: true,
      dateOfStart: faker.date.between({
        from: '2024-06-01T00:00:00:000Z',
        to: '2025-06-01T00:00:00:000Z',
      }),
      name: faker.company.name(),
      status: 'support',
      teamSize: 12,
      ClientLocation: {
        connect: { id: 'loc-1' },
      },
    },
  });
  await prisma.project.create({
    data: {
      active: true,
      dateOfStart: faker.date.between({
        from: '2024-06-01T00:00:00:000Z',
        to: '2025-06-01T00:00:00:000Z',
      }),
      name: faker.company.name(),
      status: 'in force',
      teamSize: 12,
      ClientLocation: {
        connect: { id: 'loc-1' },
      },
    },
  });
  await prisma.project.create({
    data: {
      active: true,
      dateOfStart: faker.date.between({
        from: '2024-06-01T00:00:00:000Z',
        to: '2025-06-01T00:00:00:000Z',
      }),
      name: faker.company.name(),
      status: 'in force',
      teamSize: 12,
      ClientLocation: {
        connect: { id: 'loc-1' },
      },
    },
  });
}

async function seedTaskPriorities() {
  await prisma.taskPriority.createMany({
    data: [
      { name: 'Urgent' },
      { name: 'Normal' },
      { name: 'Below Normal' },
      { name: 'Low' },
    ],
  });
}
async function seedTaskStatus() {
  await prisma.taskStatus.createMany({
    data: [
      { name: 'Holding' },
      { name: 'Prioritized' },
      { name: 'Started' },
      { name: 'Finished' },
      { name: 'Reverted' },
    ],
  });
}
