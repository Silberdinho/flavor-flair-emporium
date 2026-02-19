import { FoodItem } from "@/types/food";

export const categories = ["Alle", "Småretter", "Salater", "Hovedretter", "Drikke"];

export const menuItems: FoodItem[] = [
  // ── Småretter ──
  {
    id: "1",
    name: "Bruschetta",
    description: "Ristet surdeigsbrød med tomater, basilikum, hvitløk og ekstra virgin olivenolje",
    price: 89,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&h=300&fit=crop",
    badge: "Populær",
  },
  {
    id: "2",
    name: "Kyllingvinger",
    description: "Sprøstekte vinger med buffalo-saus og ranch-dip",
    price: 119,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1608039829572-9b0188e45353?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Nachos Supreme",
    description: "Sprø tortillachips med smeltet ost, guacamole, salsa og rømme",
    price: 109,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
  },
  {
    id: "4",
    name: "Hvitløksreker",
    description: "Scampi stekt i smør med hvitløk, chili og frisk persille",
    price: 139,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=400&h=300&fit=crop",
  },

  // ── Salater ──
  {
    id: "5",
    name: "Gresk Salat",
    description: "Friske tomater, agurk, oliven, fetaost og rødløk med oregano-vinaigrette",
    price: 139,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Caesar Salat",
    description: "Crispy romansalat, kylling, parmesan, krutonger og hjemmelaget dressing",
    price: 149,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop",
    badge: "Anbefalt",
  },
  {
    id: "7",
    name: "Thai Biff-salat",
    description: "Grillet biff med mango, koriander, peanøtter og søt chilidressing",
    price: 169,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop",
  },

  // ── Hovedretter ──
  {
    id: "8",
    name: "Grillet Laks",
    description: "Norsk laks med sitronsmør, dampede grønnsaker og kremet potetpuré",
    price: 269,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400&h=300&fit=crop",
    badge: "Anbefalt",
  },
  {
    id: "9",
    name: "Klassisk Burger",
    description: "Angus-burger med cheddar, bacon, løkringer, salat og trøffelaioli",
    price: 189,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    badge: "Populær",
  },
  {
    id: "10",
    name: "Pasta Carbonara",
    description: "Fersk tagliatelle med pancetta, eggekremer, pecorino og svart pepper",
    price: 179,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&h=300&fit=crop",
  },
  {
    id: "11",
    name: "Entrecôte",
    description: "200 g grillet entrecôte med béarnaisesaus, pommes frites og grønnsaker",
    price: 329,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop",
  },
  {
    id: "12",
    name: "Kylling Tikka Masala",
    description: "Mør kylling i kremet, krydret tomatsaus med basmatiris og nanbrød",
    price: 199,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
  },

  // ── Drikke ──
  {
    id: "13",
    name: "Hjemmelaget Lemonade",
    description: "Friskpresset sitron med mynte, agurk og lett søtning",
    price: 69,
    category: "Drikke",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop",
  },
  {
    id: "14",
    name: "Mango Smoothie",
    description: "Frisk mango blandet med yoghurt, banan og honning",
    price: 79,
    category: "Drikke",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400&h=300&fit=crop",
  },
  {
    id: "15",
    name: "Iste med Fersken",
    description: "Avkjølt svart te med fersken, sitron og isbiter",
    price: 59,
    category: "Drikke",
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400&h=300&fit=crop",
  },
  {
    id: "16",
    name: "Espresso Tonic",
    description: "Dobbel espresso over isbiter med premium tonic og appelsinskall",
    price: 75,
    category: "Drikke",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
  },
];
