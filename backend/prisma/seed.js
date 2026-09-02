import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting full database seeding for Sahyog platform...');

  // Clean existing problems and child records to ensure fresh demo data
  await prisma.solutionUpdate.deleteMany();
  await prisma.solution.deleteMany();
  await prisma.collaborationMember.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.problemMatch.deleteMany();
  await prisma.problemExpertise.deleteMany();
  await prisma.aiClassification.deleteMany();
  await prisma.aiAnalysis.deleteMany();
  await prisma.location.deleteMany();
  await prisma.problemMedia.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.problem.deleteMany();

  // 1. Seed Categories
  const categoriesData = [
    {
      name: 'Road Infrastructure',
      nameHi: 'सड़क अवसंरचना',
      nameKh: 'डहर मरम्मत और गड्ढा',
      description: 'Potholes, damaged rural/urban roads, broken culverts, and dangerous asphalt surfaces.',
      icon: 'Construction'
    },
    {
      name: 'Water & Sanitation',
      nameHi: 'जल एवं स्वच्छता',
      nameKh: 'पानी और नाली समस्या',
      description: 'Drinking water pipeline leaks, contaminated water sources, broken handpumps, and drain blockages.',
      icon: 'Droplets'
    },
    {
      name: 'Waste Management',
      nameHi: 'कचरा प्रबंधन',
      nameKh: 'कचरा और गंदगी',
      description: 'Uncollected community waste, illegal dumping, plastic accumulation, and public health hazards.',
      icon: 'Trash2'
    },
    {
      name: 'Electricity & Power',
      nameHi: 'विद्युत एवं ऊर्जा',
      nameKh: 'बिजली और ट्रांसफार्मर समस्या',
      description: 'Faulty transformers, sagging high-voltage wires, damaged poles, and prolonged blackout areas.',
      icon: 'Zap'
    },
    {
      name: 'Agriculture & Irrigation',
      nameHi: 'कृषि एवं सिंचाई',
      nameKh: 'खेती और पटवन',
      description: 'Damaged irrigation canals, seasonal flooding of crops, and local soil drainage challenges.',
      icon: 'Sprout'
    },
    {
      name: 'Healthcare & Public Safety',
      nameHi: 'स्वास्थ्य एवं जन सुरक्षा',
      nameKh: 'स्वास्थ्य और सुरक्षा',
      description: 'Open manholes, hazardous public structures, and disease vector accumulation points.',
      icon: 'ShieldAlert'
    }
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: cat,
      create: cat
    });
    categoryMap[cat.name] = created;
  }
  console.log(`✅ Seeded ${Object.keys(categoryMap).length} categories.`);

  // 2. Seed Verified Organizations
  const organizationsData = [
    {
      displayId: 'ORG-000001',
      name: 'BIT Mesra, Ranchi',
      type: 'UNIVERSITY',
      description: 'Premier technical institution with dedicated Civil Engineering, Remote Sensing, and Water Resource laboratories.',
      website: 'https://www.bitmesra.ac.in',
      email: 'collaborations@bitmesra.ac.in',
      phone: '+91 651 2275444',
      location: 'Mesra, Ranchi',
      district: 'Ranchi',
      state: 'Jharkhand',
      verificationStatus: 'VERIFIED',
      expertise: [
        { expertiseName: 'Civil Engineering', expertiseCategory: 'Engineering', description: 'Road pavement testing and sustainable asphalt design' },
        { expertiseName: 'Road Infrastructure', expertiseCategory: 'Infrastructure', description: 'Rural road durability and low-cost drainage models' },
        { expertiseName: 'Water Quality & Filtration', expertiseCategory: 'Environmental', description: 'Water contamination testing and localized filtration' }
      ]
    },
    {
      displayId: 'ORG-000002',
      name: 'IIT (ISM) Dhanbad',
      type: 'UNIVERSITY',
      description: 'National Institute of Technology specializing in Advanced Geotechnical Engineering, IoT sensors, and Structural Health.',
      website: 'https://www.iitism.ac.in',
      email: 'research@iitism.ac.in',
      phone: '+91 326 2235001',
      location: 'Sardar Patel Nagar, Dhanbad',
      district: 'Dhanbad',
      state: 'Jharkhand',
      verificationStatus: 'VERIFIED',
      expertise: [
        { expertiseName: 'IoT & Remote Monitoring', expertiseCategory: 'Technology', description: 'Smart water level and structural vibration sensors' },
        { expertiseName: 'Structural Engineering', expertiseCategory: 'Engineering', description: 'Culvert and bridge stability evaluation' },
        { expertiseName: 'Environmental Engineering', expertiseCategory: 'Environmental', description: 'Waste recycling and toxic runoff management' }
      ]
    },
    {
      displayId: 'ORG-000003',
      name: 'NIT Jamshedpur',
      type: 'UNIVERSITY',
      description: 'Center of excellence in Manufacturing, Smart Materials, and Solar Microgrid implementations.',
      website: 'https://www.nitjsr.ac.in',
      email: 'projects@nitjsr.ac.in',
      phone: '+91 657 2282240',
      location: 'Adityapur, Jamshedpur',
      district: 'East Singhbhum',
      state: 'Jharkhand',
      verificationStatus: 'VERIFIED',
      expertise: [
        { expertiseName: 'Power & Microgrids', expertiseCategory: 'Electrical', description: 'Decentralized solar transformers and wiring safety' },
        { expertiseName: 'Material Science', expertiseCategory: 'Engineering', description: 'Corrosion-resistant civic hardware' }
      ]
    },
    {
      displayId: 'ORG-000004',
      name: 'Tata Steel CSR & Infrastructure Division',
      type: 'INDUSTRY',
      description: 'Industrial partner providing heavy machinery, specialized bitumen surfacing materials, and community funding.',
      website: 'https://www.tatasteel.com',
      email: 'csr.projects@tatasteel.com',
      phone: '+91 657 6644000',
      location: 'Jamshedpur',
      district: 'East Singhbhum',
      state: 'Jharkhand',
      verificationStatus: 'VERIFIED',
      expertise: [
        { expertiseName: 'Road Surfacing & Machinery', expertiseCategory: 'Deployment', description: 'Quick-pave bitumen trucks and rapid road roller deployment' },
        { expertiseName: 'Community Funding & Equipment', expertiseCategory: 'Funding', description: 'Corporate CSR funding for vetted high-priority civic repairs' }
      ]
    },
    {
      displayId: 'ORG-000005',
      name: 'L&T Smart Infrastructure Solutions',
      type: 'INDUSTRY',
      description: 'Global engineering firm with IoT deployment teams, pipeline diagnostics, and smart civic sensors.',
      website: 'https://www.larsentoubro.com',
      email: 'smartcivic@larsentoubro.com',
      phone: '+91 22 67525656',
      location: 'Ranchi Regional Office',
      district: 'Ranchi',
      state: 'Jharkhand',
      verificationStatus: 'VERIFIED',
      expertise: [
        { expertiseName: 'IoT Sensors & Diagnostics', expertiseCategory: 'Technology', description: 'Acoustic pipe leak detection and drainage flow monitors' },
        { expertiseName: 'Rapid Repair Teams', expertiseCategory: 'Deployment', description: 'Standardized civic repair toolkits and field technicians' }
      ]
    }
  ];

  const orgMap = {};
  for (const org of organizationsData) {
    const { expertise, ...orgData } = org;
    const createdOrg = await prisma.organization.upsert({
      where: { displayId: org.displayId },
      update: orgData,
      create: orgData
    });
    orgMap[org.displayId] = createdOrg;

    await prisma.organizationExpertise.deleteMany({ where: { organizationId: createdOrg.id } });
    for (const exp of expertise) {
      await prisma.organizationExpertise.create({
        data: {
          organizationId: createdOrg.id,
          expertiseName: exp.expertiseName,
          expertiseCategory: exp.expertiseCategory,
          description: exp.description
        }
      });
    }
  }
  console.log(`✅ Seeded ${organizationsData.length} organizations and expertise profiles.`);

  // 3. Seed Users for All Roles
  const passwordHash = await bcrypt.hash('Password@123', 10);
  const bitMesraOrg = orgMap['ORG-000001'];
  const tataOrg = orgMap['ORG-000004'];

  const usersData = [
    {
      displayId: 'USR-000001',
      name: 'Admin Officer',
      email: 'admin@sahyog.gov.in',
      passwordHash,
      role: 'ADMIN',
      preferredLanguage: 'en',
      emailVerified: true
    },
    {
      displayId: 'USR-000002',
      name: 'Ramesh Kumar (Citizen)',
      email: 'citizen@sahyog.in',
      phone: '9876543210',
      passwordHash,
      role: 'CITIZEN',
      preferredLanguage: 'kh',
      emailVerified: true
    },
    {
      displayId: 'USR-000003',
      name: 'Prof. Anil Sharma (Civil Dept)',
      email: 'prof.sharma@bitmesra.ac.in',
      passwordHash,
      role: 'UNIVERSITY',
      organizationId: bitMesraOrg?.id,
      preferredLanguage: 'en',
      emailVerified: true
    },
    {
      displayId: 'USR-000004',
      name: 'Siddharth Roy (CSR Lead)',
      email: 'siddharth@tatasteel.com',
      passwordHash,
      role: 'INDUSTRY',
      organizationId: tataOrg?.id,
      preferredLanguage: 'en',
      emailVerified: true
    }
  ];

  const userMap = {};
  for (const user of usersData) {
    const created = await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
    userMap[user.email] = created;
  }
  console.log(`✅ Seeded ${usersData.length} demo users across all roles.`);

  // 4. Seed Rich Realistic Problems Across Categories
  const problemsData = [
    {
      displayId: 'PRB-000001',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Road Infrastructure'].id,
      title: 'Severe Asphalt Potholes & Broken Culvert near BIT Mesra Gate 2',
      description: 'गाँव के स्कूल लगे डहर बहुत टूट गेल हौ, गाड़ी आवे जाए में भारी दिक्कत हौ। Rainy water collects creating dangerous craters.',
      originalLanguage: 'kh',
      priority: 'HIGH',
      priorityScore: 82,
      priorityReasons: JSON.stringify(['Arterial public transit route', 'Adjacent to educational institution / school bus route', 'Severe surface erosion']),
      status: 'COLLABORATION',
      verificationStatus: 'APPROVED',
      aiStatus: 'COMPLETED',
      imageFilename: 'road_damage_ranchi.jpg',
      location: {
        locationName: 'BIT Mesra Gate 2 Road',
        district: 'Ranchi',
        state: 'Jharkhand',
        latitude: 23.4241,
        longitude: 85.4385
      },
      aiSummary: 'Severe road surface distress and asphalt erosion with 3 deep cavities. Immediate civil pavement patching and culvert reinforcement required.',
      aiVisualFeatures: ['asphalt disintegration', 'pothole cluster', 'standing stormwater'],
      requiredExpertise: ['Civil Engineering', 'Road Infrastructure', 'Transportation Engineering']
    },
    {
      displayId: 'PRB-000002',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Water & Sanitation'].id,
      title: 'High-Pressure Drinking Water Pipeline Fracture on Main Road',
      description: 'Major underground pipeline cracked, flooding road surface and cutting off clean drinking water supply to 400 households.',
      originalLanguage: 'hi',
      priority: 'HIGH',
      priorityScore: 88,
      priorityReasons: JSON.stringify(['Drinking water supply interruption to residential cluster', 'Sub-surface road foundation softening', 'Continuous water wastage']),
      status: 'MATCHED',
      verificationStatus: 'APPROVED',
      aiStatus: 'COMPLETED',
      imageFilename: 'water_pipe_leak_hazaribagh.jpg',
      location: {
        locationName: 'Main Road Ward 7',
        district: 'Hazaribagh',
        state: 'Jharkhand',
        latitude: 23.9925,
        longitude: 85.3637
      },
      aiSummary: 'Pressurized water pipe rupture with high discharge volume causing structural foundation erosion.',
      aiVisualFeatures: ['high discharge water pooling', 'pipe fracture cavity', 'sediment wash'],
      requiredExpertise: ['Hydrology', 'Environmental Engineering', 'Water Supply Networks']
    },
    {
      displayId: 'PRB-000003',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Electricity & Power'].id,
      title: 'Exposed High-Voltage Transformer with Sparking Low-Hanging Cables',
      description: 'Transformer enclosure damaged after storm; exposed 11kV live wires dangling dangerously close to pedestrian pathway.',
      originalLanguage: 'en',
      priority: 'CRITICAL',
      priorityScore: 96,
      priorityReasons: JSON.stringify(['Immediate public electrocution hazard', 'Close proximity to pedestrian footpath', 'High voltage sparking risk']),
      status: 'APPROVED',
      verificationStatus: 'APPROVED',
      aiStatus: 'COMPLETED',
      imageFilename: 'transformer_fault_bokaro.jpg',
      location: {
        locationName: 'Sector 4 Market Lane',
        district: 'Bokaro',
        state: 'Jharkhand',
        latitude: 23.6693,
        longitude: 86.1511
      },
      aiSummary: 'Critical electrical hazard. Transformer casing fractured with dangling overhead live power lines.',
      aiVisualFeatures: ['dangling electrical cables', 'unshielded transformer housing', 'flash residue'],
      requiredExpertise: ['Electrical Engineering', 'Power Grid Safety', 'Utility Infrastructure']
    },
    {
      displayId: 'PRB-000004',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Waste Management'].id,
      title: 'Illegal Plastic Waste Dumping and Stormwater Drain Choke',
      description: 'Community garbage accumulating for 3 weeks blocking primary storm drain, creating foul odor and mosquito breeding ground.',
      originalLanguage: 'en',
      priority: 'MEDIUM',
      priorityScore: 65,
      priorityReasons: JSON.stringify(['Public health and epidemic vector accumulation', 'Blocked monsoon drainage channel']),
      status: 'SUBMITTED',
      verificationStatus: 'PENDING',
      aiStatus: 'COMPLETED',
      imageFilename: 'waste_dump_dhanbad.jpg',
      location: {
        locationName: 'Bank More Drainage Canal',
        district: 'Dhanbad',
        state: 'Jharkhand',
        latitude: 23.7957,
        longitude: 86.4304
      },
      aiSummary: 'Heavy unsegregated solid municipal waste dumping causing 80% blockage in primary stormwater channel.',
      aiVisualFeatures: ['plastic waste heap', 'stagnant wastewater', 'channel blockage'],
      requiredExpertise: ['Waste Management', 'Environmental Sanitation']
    },
    {
      displayId: 'PRB-000005',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Agriculture & Irrigation'].id,
      title: 'Irrigation Canal Embankment Breach Flooding Paddy Fields',
      description: 'Canal retaining wall collapsed during heavy rain; water flooding 25 acres of standing paddy crops.',
      originalLanguage: 'hi',
      priority: 'HIGH',
      priorityScore: 84,
      priorityReasons: JSON.stringify(['Agricultural crop loss threat for 30+ farmer families', 'Canal retaining wall structural failure']),
      status: 'COLLABORATION',
      verificationStatus: 'APPROVED',
      aiStatus: 'COMPLETED',
      imageFilename: 'canal_irrigation_ghatshila.jpg',
      location: {
        locationName: 'Ghatshila Rural Canal Sector',
        district: 'East Singhbhum',
        state: 'Jharkhand',
        latitude: 22.5855,
        longitude: 86.4837
      },
      aiSummary: 'Earthen embankment breach requiring masonry reinforcement and geotextile slope stabilization.',
      aiVisualFeatures: ['embankment breach', 'inundated crop fields', 'hydraulic scour'],
      requiredExpertise: ['Agricultural Engineering', 'Hydraulic Structures', 'Soil Mechanics']
    },
    {
      displayId: 'PRB-000006',
      reporterId: userMap['citizen@sahyog.in'].id,
      categoryId: categoryMap['Healthcare & Public Safety'].id,
      title: 'Uncovered 8-Foot Deep Manhole Adjacent to Community Health Center',
      description: 'Concrete slab stolen/broken leaving open deep cavity on hospital entrance ramp. High risk of serious injury at night.',
      originalLanguage: 'en',
      priority: 'CRITICAL',
      priorityScore: 92,
      priorityReasons: JSON.stringify(['Direct fall risk at emergency healthcare entry', 'Zero nighttime illumination or barricade']),
      status: 'RESOLVED',
      verificationStatus: 'APPROVED',
      aiStatus: 'COMPLETED',
      imageFilename: 'open_manhole_deoghar.jpg',
      location: {
        locationName: 'CHC Entrance Road',
        district: 'Deoghar',
        state: 'Jharkhand',
        latitude: 24.4826,
        longitude: 86.7000
      },
      aiSummary: 'Severe fall hazard. 8ft deep open subterranean pit directly in front of public clinic access ramp.',
      aiVisualFeatures: ['missing manhole cover', 'deep exposed cavity', 'pedestrian ramp path'],
      requiredExpertise: ['Structural Safety', 'Public Works', 'Civic Hardware']
    }
  ];

  for (const prob of problemsData) {
    const { imageFilename, location, aiSummary, aiVisualFeatures, requiredExpertise, ...probCore } = prob;

    const createdProb = await prisma.problem.create({
      data: probCore
    });

    // Media
    await prisma.problemMedia.create({
      data: {
        problemId: createdProb.id,
        mediaType: 'IMAGE',
        fileUrl: `/uploads/${imageFilename}`,
        storageKey: `seed/${imageFilename}`,
        mimeType: 'image/jpeg',
        fileSize: 45000
      }
    });

    // Location
    await prisma.location.create({
      data: {
        problemId: createdProb.id,
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.locationName,
        district: location.district,
        state: location.state
      }
    });

    // AI Analysis
    const aiAnalysis = await prisma.aiAnalysis.create({
      data: {
        problemId: createdProb.id,
        modelName: 'sahyog-multimodal-v1',
        modelVersion: '1.0.0',
        status: 'SUCCESS',
        summary: aiSummary,
        confidence: 0.94,
        processingTimeMs: 290,
        visualFeatures: JSON.stringify(aiVisualFeatures),
        suggestedCategory: categoriesData.find(c => c.name === probCore.categoryId)?.name || 'Road Infrastructure',
        suggestedPriority: probCore.priority
      }
    });

    // Problem Expertise
    for (const exp of requiredExpertise) {
      await prisma.problemExpertise.create({
        data: {
          problemId: createdProb.id,
          expertiseName: exp,
          importance: 'HIGH',
          source: 'AI'
        }
      });
    }

    // Matches with Universities and Industries
    await prisma.problemMatch.create({
      data: {
        problemId: createdProb.id,
        organizationId: orgMap['ORG-000001'].id, // BIT Mesra
        matchScore: 94,
        matchReasons: JSON.stringify(['Dedicated research laboratory in Jharkhand', 'Civil / Environmental field teams']),
        matchStatus: 'ACCEPTED'
      }
    });

    await prisma.problemMatch.create({
      data: {
        problemId: createdProb.id,
        organizationId: orgMap['ORG-000004'].id, // Tata Steel CSR
        matchScore: 92,
        matchReasons: JSON.stringify(['Rapid equipment deployment capability', 'Regional CSR infrastructure grant mandate']),
        matchStatus: 'ACCEPTED'
      }
    });

    // If in COLLABORATION or RESOLVED status, create collaboration room & solution
    if (['COLLABORATION', 'RESOLVED'].includes(probCore.status)) {
      const collab = await prisma.collaboration.create({
        data: {
          problemId: createdProb.id,
          createdById: userMap['prof.sharma@bitmesra.ac.in'].id,
          status: probCore.status === 'RESOLVED' ? 'COMPLETED' : 'ACTIVE'
        }
      });

      await prisma.collaborationMember.create({
        data: {
          collaborationId: collab.id,
          userId: userMap['prof.sharma@bitmesra.ac.in'].id,
          organizationId: bitMesraOrg.id,
          role: 'LEAD'
        }
      });

      await prisma.collaborationMember.create({
        data: {
          collaborationId: collab.id,
          userId: userMap['siddharth@tatasteel.com'].id,
          organizationId: tataOrg.id,
          role: 'INDUSTRY_PARTNER'
        }
      });

      const sol = await prisma.solution.create({
        data: {
          problemId: createdProb.id,
          collaborationId: collab.id,
          title: `Joint Remediation: ${probCore.title.substring(0, 45)}`,
          description: 'Joint academic testing and industrial contractor deployment.',
          solutionType: 'ENGINEERING',
          status: probCore.status === 'RESOLVED' ? 'COMPLETED' : 'IMPLEMENTATION',
          progressPercentage: probCore.status === 'RESOLVED' ? 100 : 75
        }
      });

      await prisma.solutionUpdate.create({
        data: {
          solutionId: sol.id,
          updatedById: userMap['siddharth@tatasteel.com'].id,
          title: probCore.status === 'RESOLVED' ? 'Final Physical Verification & Sign-off' : 'Field Materials Deployed',
          description: probCore.status === 'RESOLVED' ? 'Work completed and inspected on site with civic authorities.' : 'Contractor team deployed with heavy rollers and bitumen.',
          progressPercentage: probCore.status === 'RESOLVED' ? 100 : 75,
          stage: probCore.status === 'RESOLVED' ? 'COMPLETED' : 'IMPLEMENTATION'
        }
      });
    }
  }

  console.log(`✅ Seeded ${problemsData.length} rich sample problems with media, AI, and collaborations.`);
  console.log('✨ Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
