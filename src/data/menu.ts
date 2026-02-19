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
  },
  {
    id: "2",
    name: "Kyllingvinger",
    description: "Sprøstekte vinger med buffalo-saus og ranch-dip",
    price: 119,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    name: "Nachos Supreme",
    description: "Sprø tortillachips med smeltet ost, guacamole, salsa og rømme",
    price: 109,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop",
    badge: "Populær",
  },
  {
    id: "4",
    name: "Sprøbakte Vårruller",
    description: "Crispy vårruller fylt med grønnsaker og glassnudler, servert med søt chilisaus",
    price: 99,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1548507200-e9e0e7e0b8e8?w=400&h=300&fit=crop",
  },

  // ── Salater ──
  {
    id: "5",
    name: "Caprese Salat",
    description: "Fersk mozzarella, modne tomater og basilikum med balsamicoglaze og olivenolje",
    price: 129,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=400&h=300&fit=crop",
  },
  {
    id: "6",
    name: "Caesar Salat",
    description: "Crispy romansalat, kylling, parmesan, krutonger og hjemmelaget dressing",
    price: 149,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop",
  },
  {
    id: "7",
    name: "Poke Bowl",
    description: "Marinert laks på sushiris med avokado, edamame, mango og sesamdressing",
    price: 169,
    category: "Salater",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  },

  // ── Hovedretter ──
  {
    id: "8",
    name: "Pizza Margherita",
    description: "Steinovnsbakt pizza med San Marzano-tomater, fersk mozzarella og basilikum",
    price: 179,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
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
    badge: "Populær",
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

  {
    id: "17",
    name: "Pulled Pork Tacos",
    description: "Tre myke tacos med langtidsstekt svinekjøtt, coleslaw, chipotle-aioli og syltet rødløk",
    price: 159,
    category: "Hovedretter",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
  },
  {
    id: "18",
    name: "Edamame",
    description: "Dampede soyabønner med havsalt og sesamolje — en lett og sunn snack",
    price: 69,
    category: "Småretter",
    image: "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?w=400&h=300&fit=crop",
  },
];
