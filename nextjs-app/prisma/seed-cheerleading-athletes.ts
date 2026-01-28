import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to generate random names
const firstNames = [
  'Emma', 'Olivia', 'Ava', 'Isabella', 'Sophia', 'Mia', 'Charlotte', 'Amelia',
  'Harper', 'Evelyn', 'Abigail', 'Emily', 'Elizabeth', 'Sofia', 'Avery',
  'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily',
  'Aubrey', 'Zoey', 'Penelope', 'Layla', 'Nora', 'Camila', 'Hannah'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBirthdate(minAge: number, maxAge: number): Date {
  const today = new Date();
  const minYear = today.getFullYear() - maxAge;
  const maxYear = today.getFullYear() - minAge;
  const year = Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(year, month, day);
}

async function main() {
  console.log('Seeding cheerleading athletes...');

  // Get the organization
  const org = await prisma.organizations.findFirst();
  if (!org) {
    console.log('No organization found. Please create one first.');
    return;
  }

  // Find or create the 2025 Cheerleading program
  let cheerProgram = await prisma.programs.findFirst({
    where: {
      organization_id: org.id,
      title: { contains: 'Cheerleading' }
    }
  });

  if (!cheerProgram) {
    cheerProgram = await prisma.programs.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: org.id,
        title: '2025 Cheerleading',
        type: 'season',
        event_dates: { start: '2025-08-01', end: '2025-12-15' },
        fee_responsibility: 'parent',
        visibility: 'public',
        registration_status: 'open',
        status: 'published',
        default_season_price: 150.00,
        updated_at: new Date(),
      }
    });
    console.log(`Created program: ${cheerProgram.title}`);
  } else {
    console.log(`Found existing program: ${cheerProgram.title}`);
  }

  // Clean up old registrations and their submissions for this program
  console.log('Cleaning up old registration data...');
  
  // Delete registration submissions for this program
  await prisma.registration_submissions.deleteMany({
    where: { program_id: cheerProgram.id }
  });
  
  // Delete old registrations for this program
  await prisma.registrations.deleteMany({
    where: { program_id: cheerProgram.id }
  });

  // Define the divisions with age ranges (matching existing cheer teams)
  const divisions = [
    { title: '3rd-4th Grade Cheer', minAge: 8, maxAge: 10, grade: 3 },
    { title: '5th-6th Grade Cheer', minAge: 10, maxAge: 12, grade: 5 },
    { title: '7th-8th Grade Cheer', minAge: 12, maxAge: 14, grade: 7 },
  ];

  // Find or create a parent user for the registrations
  let parentUser = await prisma.users.findFirst({
    where: { role: 'parent' }
  });

  if (!parentUser) {
    parentUser = await prisma.users.create({
      data: {
        id: crypto.randomUUID(),
        email: 'parent@example.com',
        first_name: 'Parent',
        last_name: 'User',
        role: 'parent',
      }
    });
    console.log('Created parent user');
  }

  let totalAthletes = 0;

  for (const division of divisions) {
    // Find or create the registration for this division
    let registration = await prisma.registrations.findFirst({
      where: {
        program_id: cheerProgram.id,
        title: division.title
      }
    });

    if (!registration) {
      registration = await prisma.registrations.create({
        data: {
          id: crypto.randomUUID(),
          program_id: cheerProgram.id,
          title: division.title,
          sport: 'Cheerleading',
          price: 150.00,
          event_dates: { start: '2025-08-01', end: '2025-12-15' },
          age_min: division.minAge,
          age_max: division.maxAge,
          gender: 'Female',
          updated_at: new Date(),
        }
      });
      console.log(`Created registration: ${division.title}`);
    } else {
      console.log(`Found existing registration: ${division.title}`);
    }

    // Create ~20 athletes for this division
    const athleteCount = 18 + Math.floor(Math.random() * 5); // 18-22 athletes
    
    for (let i = 0; i < athleteCount; i++) {
      const firstName = randomElement(firstNames);
      const lastName = randomElement(lastNames);
      const birthdate = generateBirthdate(division.minAge, division.maxAge);
      const gradYear = new Date().getFullYear() + (12 - division.grade);

      // Create athlete
      const athlete = await prisma.athletes.create({
        data: {
          id: crypto.randomUUID(),
          first_name: firstName,
          last_name: lastName,
          gender: 'Female',
          birthdate,
          grade: division.grade,
          grad_year: gradYear,
        }
      });

      // Create registration submission
      await prisma.registration_submissions.create({
        data: {
          id: crypto.randomUUID(),
          registration_id: registration.id,
          program_id: cheerProgram.id,
          athlete_id: athlete.id,
          parent_id: parentUser.id,
          registration_status: 'paid',
          assignment_status: 'paid',
          updated_at: new Date(),
        }
      });

      totalAthletes++;
    }

    console.log(`  Added ${athleteCount} athletes to ${division.title}`);
  }

  console.log(`\nSeeding complete! Added ${totalAthletes} athletes across ${divisions.length} divisions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
