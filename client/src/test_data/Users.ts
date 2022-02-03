const firstNames = [
  "Bob",
  "Susan",
  "Karen",
  "Kyle",
  "Robert",
  "Dave",
  "James",
  "Mary",
  "Patricia",
];

const lastNames = [
  "Smith",
  "Goodman",
  "Gates",
  "Musk",
  "Matthews",
  "Johnson",
  "Williams",
  "Brown",
  "Garcia",
];

// don't tell adobe
const images = [
  "https://t4.ftcdn.net/jpg/03/83/25/83/240_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
  "https://t3.ftcdn.net/jpg/02/99/04/20/240_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg",
  "https://t3.ftcdn.net/jpg/03/02/88/46/240_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg",
  "https://t4.ftcdn.net/jpg/01/51/99/39/240_F_151993994_mmAYzngmSbNRr6Fxma67Od3WHrSkfG5I.jpg",
  "https://t3.ftcdn.net/jpg/02/43/76/54/240_F_243765470_a0hN5zuTKIonTbRGldi8KajuvhSiWvDx.jpg",
  "https://t3.ftcdn.net/jpg/01/92/16/04/240_F_192160468_2ev2JYmocXi7pxbBiPsfNEVwDqmTTLYL.jpg",
  "https://t4.ftcdn.net/jpg/03/13/37/31/240_F_313373132_b9Az7XaGLRvSLHXlINXBIGPMIOLok8ZB.jpg",
  "https://t3.ftcdn.net/jpg/03/49/48/42/240_F_349484220_ztenUZ8pQZ1IC5wsBTWaUZTnMIKZ9wJz.jpg",
  "https://t4.ftcdn.net/jpg/03/61/34/27/240_F_361342769_X26dTcofZpukhMGYWFcn1wJNABEFtNLH.jpg",
];

function getRandomListElement(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}

let nextUserId = 0;

function generateUser(role: string) {
  const image = getRandomListElement(images);
  const firstName = getRandomListElement(firstNames);
  const lastName = getRandomListElement(lastNames);
  const name = `${firstName} ${lastName}`;

  return { id: nextUserId++, name, image, role };
}

export default function generateUsers(
  adminCount: number,
  labbieCount: number,
  makerCount: number
) {
  const users = [];

  for (let i = 0; i < adminCount; i++) {
    users.push(generateUser("Admin"));
  }

  for (let i = 0; i < labbieCount; i++) {
    users.push(generateUser("Labbie"));
  }

  for (let i = 0; i < makerCount; i++) {
    users.push(generateUser("Maker"));
  }

  return users;
}
