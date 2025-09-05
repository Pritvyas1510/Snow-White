const Cards = [
  // 1–10
  { name: "Tomatoes",       price: "$2.99/lb",   image: "Image/Tomatoes.png" },
  { name: "Apples",         price: "$1.49/lb",   image: "https://example.com/images/apples.jpg" },
  { name: "Lettuce",        price: "$1.99/head", image: "https://example.com/images/lettuce.jpg" },
  { name: "Bananas",        price: "$0.79/lb",   image: "https://example.com/images/bananas.jpg" },
  { name: "Carrots",        price: "$1.29/lb",   image: "https://example.com/images/carrots.jpg" },
  { name: "Oranges",        price: "$0.99/lb",   image: "https://example.com/images/oranges.jpg" },
  { name: "Spinach",        price: "$2.49/bunch",image: "https://example.com/images/spinach.jpg" },
  { name: "Grapes",         price: "$2.99/lb",   image: "https://example.com/images/grapes.jpg" },
  { name: "Cucumbers",      price: "$0.89/lb",   image: "https://example.com/images/cucumbers.jpg" },
  { name: "Peaches",        price: "$1.79/lb",   image: "https://example.com/images/peaches.jpg" },

  // 11–20
  { name: "Broccoli",       price: "$1.59/lb",   image: "https://example.com/images/broccoli.jpg" },
  { name: "Strawberries",   price: "$3.49/lb",   image: "https://example.com/images/strawberries.jpg" },
  { name: "Pineapple",      price: "$2.99/each", image: "https://example.com/images/pineapple.jpg" },
  { name: "Mango",          price: "$1.49/each", image: "https://example.com/images/mango.jpg" },
  { name: "Blueberries",    price: "$3.99/pint", image: "https://example.com/images/blueberries.jpg" },
  { name: "Zucchini",       price: "$1.09/lb",   image: "https://example.com/images/zucchini.jpg" },
  { name: "Avocado",        price: "$1.29/each", image: "https://example.com/images/avocado.jpg" },
  { name: "Cauliflower",    price: "$2.79/head", image: "https://example.com/images/cauliflower.jpg" },
  { name: "Plums",          price: "$1.89/lb",   image: "https://example.com/images/plums.jpg" },
  { name: "Raspberries",    price: "$4.49/pint", image: "https://example.com/images/raspberries.jpg" },

  // 21–30
  { name: "Bell Peppers",   price: "$1.39/each", image: "https://example.com/images/bell_peppers.jpg" },
  { name: "Watermelon",     price: "$4.99/each", image: "https://example.com/images/watermelon.jpg" },
  { name: "Cabbage",        price: "$0.69/lb",   image: "https://example.com/images/cabbage.jpg" },
  { name: "Eggplant",       price: "$1.99/lb",   image: "https://example.com/images/eggplant.jpg" },
  { name: "Pear",           price: "$1.59/lb",   image: "https://example.com/images/pear.jpg" },
  { name: "Cherries",       price: "$4.99/lb",   image: "https://example.com/images/cherries.jpg" },
  { name: "Kale",           price: "$2.29/bunch",image: "https://example.com/images/kale.jpg" },
  { name: "Onions",         price: "$0.79/lb",   image: "https://example.com/images/onions.jpg" },
  { name: "Garlic",         price: "$0.50/clove",image: "https://example.com/images/garlic.jpg" },
  { name: "Sweet Potatoes", price: "$1.19/lb",   image: "https://example.com/images/sweet_potatoes.jpg" },

  // 31–40
  { name: "Mushrooms",      price: "$2.99/lb",   image: "https://example.com/images/mushrooms.jpg" },
  { name: "Corn",           price: "$0.79/ear",  image: "https://example.com/images/corn.jpg" },
  { name: "Green Beans",    price: "$2.49/lb",   image: "https://example.com/images/green_beans.jpg" },
  { name: "Peas",           price: "$1.99/lb",   image: "https://example.com/images/peas.jpg" },
  { name: "Beets",          price: "$1.49/lb",   image: "https://example.com/images/beets.jpg" },
  { name: "Radishes",       price: "$1.29/bunch",image: "https://example.com/images/radishes.jpg" },
  { name: "Celery",         price: "$1.99/stalk",image: "https://example.com/images/celery.jpg" },
  { name: "Lemons",         price: "$0.69/each", image: "https://example.com/images/lemons.jpg" },
  { name: "Limes",          price: "$0.49/each", image: "https://example.com/images/limes.jpg" },
  { name: "Grapefruit",     price: "$1.19/each", image: "https://example.com/images/grapefruit.jpg" },

  // 41–50
  { name: "Pears",          price: "$1.59/lb",   image: "https://example.com/images/pears.jpg" },
  { name: "Apricots",       price: "$3.29/lb",   image: "https://example.com/images/apricots.jpg" },
  { name: "Blackberries",   price: "$4.99/pint", image: "https://example.com/images/blackberries.jpg" },
  { name: "Cantaloupe",     price: "$3.49/each", image: "https://example.com/images/cantaloupe.jpg" },
  { name: "Honeydew",       price: "$3.99/each", image: "https://example.com/images/honeydew.jpg" },
  { name: "Guava",          price: "$2.49/lb",   image: "https://example.com/images/guava.jpg" },
  { name: "Pomegranate",    price: "$2.99/each", image: "https://example.com/images/pomegranate.jpg" },
  { name: "Dragon Fruit",   price: "$5.99/each", image: "https://example.com/images/dragon_fruit.jpg" },
  { name: "Pear Pear",      price: "$1.59/lb",   image: "https://example.com/images/pear2.jpg" },
  { name: "Starfruit",      price: "$3.99/each", image: "https://example.com/images/starfruit.jpg" },

  // 51–60
  { name: "Jackfruit",      price: "$1.99/lb",   image: "https://example.com/images/jackfruit.jpg" },
  { name: "Lychee",         price: "$6.99/lb",   image: "https://example.com/images/lychee.jpg" },
  { name: "Papaya",         price: "$2.99/each", image: "https://example.com/images/papaya.jpg" },
  { name: "Tangerine",      price: "$1.29/lb",   image: "https://example.com/images/tangerine.jpg" },
  { name: "Nectarine",      price: "$2.49/lb",   image: "https://example.com/images/nectarine.jpg" },
  { name: "Kiwifruit",      price: "$0.79/each", image: "https://example.com/images/kiwi.jpg" },
  { name: "Persimmon",      price: "$2.29/each", image: "https://example.com/images/persimmon.jpg" },
  { name: "Figs",           price: "$3.99/lb",   image: "https://example.com/images/figs.jpg" },
  { name: "Rhubarb",        price: "$2.19/lb",   image: "https://example.com/images/rhubarb.jpg" },
  { name: "Cranberries",    price: "$3.99/lb",   image: "https://example.com/images/cranberries.jpg" },

  // 61–70
  { name: "Elderberries",   price: "$5.49/lb",   image: "https://example.com/images/elderberries.jpg" },
  { name: "Okra",           price: "$2.29/lb",   image: "https://example.com/images/okra.jpg" },
  { name: "Brussels Sprouts",price:"$2.99/lb",   image: "https://example.com/images/brussels_sprouts.jpg" },
  { name: "Artichoke",      price: "$2.49/each", image: "https://example.com/images/artichoke.jpg" },
  { name: "Leeks",          price: "$1.99/lb",   image: "https://example.com/images/leeks.jpg" },
  { name: "Shallots",       price: "$3.19/lb",   image: "https://example.com/images/shallots.jpg" },
  { name: "Thai Chili",     price: "$4.99/lb",   image: "https://example.com/images/thai_chili.jpg" },
  { name: "Jalapeno",       price: "$1.49/lb",   image: "https://example.com/images/jalapeno.jpg" },
  { name: "Habanero",       price: "$3.99/lb",   image: "https://example.com/images/habanero.jpg" },
  { name: "Ghost Pepper",   price: "$9.99/lb",   image: "https://example.com/images/ghost_pepper.jpg" },

  // 71–80
  { name: "Poblano Pepper", price: "$2.49/lb",   image: "https://example.com/images/poblano.jpg" },
  { name: "Anaheim Pepper", price: "$2.29/lb",   image: "https://example.com/images/anaheim.jpg" },
  { name: "Scotch Bonnet",  price: "$6.49/lb",   image: "https://example.com/images/scotch_bonnet.jpg" },
  { name: "Chayote",        price: "$1.99/each", image: "https://example.com/images/chayote.jpg" },
  { name: "Tamarind",       price: "$3.49/lb",   image: "https://example.com/images/tamarind.jpg" },
  { name: "Guava",          price: "$2.49/lb",   image: "https://example.com/images/guava2.jpg" },
  { name: "Quince",         price: "$3.99/lb",   image: "https://example.com/images/quince.jpg" },
  { name: "Soursop",        price: "$4.99/lb",   image: "https://example.com/images/soursop.jpg" },
  { name: "Breadfruit",     price: "$1.99/lb",   image: "https://example.com/images/breadfruit.jpg" },
  { name: "Durian",         price: "$8.99/each", image: "https://example.com/images/durian.jpg" },

  // 81–90
  { name: "Jackfruit",      price: "$1.99/lb",   image: "https://example.com/images/jackfruit2.jpg" },
  { name: "Breadnut",       price: "$2.99/lb",   image: "https://example.com/images/breadnut.jpg" },
  { name: "Taro",           price: "$1.49/lb",   image: "https://example.com/images/taro.jpg" },
  { name: "Cassava",        price: "$0.99/lb",   image: "https://example.com/images/cassava.jpg" },
  { name: "Plantain",       price: "$0.69/each", image: "https://example.com/images/plantain.jpg" },
  { name: "Jicama",         price: "$1.79/lb",   image: "https://example.com/images/jicama.jpg" },
  { name: "Yam",            price: "$1.29/lb",   image: "https://example.com/images/yam.jpg" },
  { name: "Lotus Root",     price: "$3.49/lb",   image: "https://example.com/images/lotus_root.jpg" },
  { name: "Daikon",         price: "$1.59/lb",   image: "https://example.com/images/daikon.jpg" },
  { name: "Fennel",         price: "$2.29/lb",   image: "https://example.com/images/fennel.jpg" },

  // 91–100
  { name: "Arugula",        price: "$2.19/bunch",image: "https://example.com/images/arugula.jpg" },
  { name: "Watercress",     price: "$2.99/bunch",image: "https://example.com/images/watercress.jpg" },
  { name: "Endive",         price: "$1.99/bunch",image: "https://example.com/images/endive.jpg" },
  { name: "Radicchio",      price: "$2.49/each", image: "https://example.com/images/radicchio.jpg" },
  { name: "Kohlrabi",       price: "$1.79/each", image: "https://example.com/images/kohlrabi.jpg" },
  { name: "Bok Choy",       price: "$1.99/each", image: "https://example.com/images/bok_choy.jpg" },
  { name: "Swiss Chard",    price: "$2.49/bunch",image: "https://example.com/images/swiss_chard.jpg" },
  { name: "Collard Greens", price: "$1.99/bunch",image: "https://example.com/images/collard_greens.jpg" },
  { name: "Mustard Greens", price: "$1.99/bunch",image: "https://example.com/images/mustard_greens.jpg" },
  { name: "Chaya",          price: "$2.99/bunch",image: "https://example.com/images/chaya.jpg" }
];

export default Cards;